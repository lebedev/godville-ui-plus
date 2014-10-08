module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      chrome: {
        files: [
          {expand: true, flatten: true, src: ['source/chrome/*', 'source/*', 'vendor/jquery-2.1.0.min.js'], dest: '<%= compile_path %>/chrome', filter: 'isFile'},
          {expand: true, src: 'images/*', dest: '<%= compile_path %>/chrome'}
        ]
      },
      firefox: {
        files: [
          {expand: true, cwd: 'source/firefox', src: '**', dest: '<%= compile_path %>/firefox/'},
          {expand: true, flatten: true, src: ['source/*', 'vendor/jquery-2.1.0.min.js'], dest: '<%= compile_path %>/firefox/content', filter: 'isFile'},
          {expand: true, src: 'images/*', dest: '<%= compile_path %>/firefox/content'}
        ]
      },
      version: {
        options: {
          process: function (content, srcpath) {
            return content.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        files: [
          {expand: true, cwd: 'source/firefox', src: 'install.rdf', dest: '<%= compile_path %>/firefox/'},
          {expand: true, cwd: 'source/chrome', src: 'manifest.json', dest: '<%= compile_path %>/chrome/'},
          {expand: true, cwd: 'source/', src: 'script.js', dest: '<%= compile_path %>/firefox/content'},
          {expand: true, cwd: 'source/', src: 'script.js', dest: '<%= compile_path %>/chrome/'}
        ]
      }
    },
    clean: {
      chrome: "<%= compile_path %>/chrome",
      firefox: "<%= compile_path %>/firefox"
    },
    compress: {
      chrome: {
        options: {
          archive: 'release/godville-ui-plus@badluck.dicey_chrome.zip'
        },
        files: [
          {expand: true, cwd: '<%= compile_path %>/chrome', src: '**'}
        ]
      },
      firefox: {
        options: {
          archive: '<%= compile_path %>/godville-ui-plus@badluck.dicey.xpi',
          mode: 'zip'
        },
        files: [
          {expand: true, cwd: '<%= compile_path %>/firefox', src: '**'}
        ]
      }      
    },
    exec: {
      token_request: {
        cmd: "<%= token_request %>",
        stdout: false,
        stderr: false
      },
      sign: {
        cmd: "mccoy -command update",
        cwd: 'mccoy'
      },
      upload: {
        cmd: "<%= upload %>"
      },
      update: {
        cmd: "<%= update %>",
        cwd: 'publish'
      },
      publish_chrome: {
        cmd: "<%= publish %>"
      },
      publish_firefox: {
        cmd: 'git add --all && git commit -m "Version <%= new_version %>" && git tag -a v<%= new_version %> -m "Release v<%= new_version %>" && git push --follow-tags origin master'
      }
    },
    prompt: {
      copy: {
        options: {
          questions: [
            {
              config: 'new_version',
              type: 'input',
              message: 'Enter new version ><%= old_version %>:',
              default: function() {
                var version = grunt.config('old_version').split('.');
                version[3]++;
                return version.join('.');
              },
              validate: function(value) {
                if (!value.match(/\d+\.\d+\.\d+\.\d+/)) {
                  return false;
                } else {
                  var new_version = value.split('.'),
                      old_version = grunt.config('old_version').split('.');
                  return +new_version[0] > +old_version[0] ||
                         +new_version[1] > +old_version[1] ||
                         +new_version[2] > +old_version[2] ||
                         +new_version[3] > +old_version[3];
                }
              },
              filter: function(value) {
                grunt.file.write('current_version', value);
                return value;
              }
            }
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-prompt');

  grunt.task.registerTask('compile', 'A sample task that logs stuff.', function(arg) {
    if (arguments.length === 1 && (arg === 'debug' || arg === 'release')) {
      grunt.log.ok("Compiling in " + arg + " mode.");
      grunt.config.set('compile_path', arg);
      if (arg === 'debug') {
        var new_version = grunt.file.read('current_version').split('.');
        new_version[3]++;
        grunt.config.set('new_version', new_version.join('.'));
        grunt.task.run([
          'copy',
          'compress:firefox',
          'clean:firefox'
        ]);
      } else if (arg === 'release') {
        if (grunt.file.exists('publish')) {
          grunt.config.set('old_version', grunt.file.read('current_version'));
          grunt.task.run([
            'prompt:copy',
            'copy',
            'process_chrome',
            'process_firefox'
          ]);
        } else {
          grunt.fail.warn("The required files don't exist. Can't run in 'release' mode.");
          return false;
        }
      }
      return true;
    } else {
      grunt.fail.warn("Possible arguments are 'debug' and 'release'.");
      return false;
    }
  });

  grunt.task.registerTask('get_token', 'Gets token from publish/token.', function() {
    grunt.config.set('access_token', grunt.file.readJSON('publish/token').access_token);
    grunt.log.writeln(grunt.config('access_token'));
  });

  grunt.task.registerTask('set_token_to_upload', 'Sets token to an upload command.', function() {
    grunt.config.set('upload', grunt.file.read('publish/upload').replace('$TOKEN', grunt.config('access_token')));
    grunt.log.writeln(grunt.config('upload'));
  });

  grunt.task.registerTask('set_token_to_publish', 'Sets token to a publish command.', function() {
    grunt.config.set('publish', grunt.file.read('publish/publish').replace('$TOKEN', grunt.config('access_token')));
    grunt.log.writeln(grunt.config('publish'));
  });

  grunt.task.registerTask('process_chrome', 'Compiles and publishes Chrome extension to Chrome Web Store.', function() {
    grunt.config.set('token_request', grunt.file.read('publish/token_request'));
    grunt.task.run([
      'compress:chrome',
      'clean:chrome',
      'exec:token_request',
      'get_token',
      'set_token_to_upload',
      'exec:upload',
      'exec:token_request',
      'get_token',
      'set_token_to_publish',
      'exec:publish_chrome'
    ]);
  });

  grunt.task.registerTask('process_firefox', 'Compiles and publishes Firefox add-on to Github repo.', function() {
    grunt.config.set('update', grunt.file.read('publish/update'));
    grunt.task.run([
      'compress:firefox',
      'clean:firefox',
      'exec:update',
      'exec:sign',
      'exec:publish_firefox'
    ]);
  });

  grunt.registerTask('default', ['compile:debug']);

};