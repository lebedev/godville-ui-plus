module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      chrome: {
        files: [
          {expand: true, flatten: true, src: ['source/chrome/*', 'source/*'], dest: '<%= compile_path %>/chrome', filter: 'isFile'},
          {expand: true, src: 'images/*', dest: '<%= compile_path %>/chrome'}
        ]
      },
      firefox: {
        files: [
          {expand: true, cwd: 'source/firefox', src: '**', dest: '<%= compile_path %>/firefox/'},
          {expand: true, flatten: true, src: 'source/*', dest: '<%= compile_path %>/firefox/content', filter: 'isFile'},
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
          {expand: true, cwd: 'source/', src: 'godville-ui-plus.js', dest: '<%= compile_path %>/firefox/content'},
          {expand: true, cwd: 'source/', src: 'godville-ui-plus.js', dest: '<%= compile_path %>/chrome/'}
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
        cmd: "<%= publish_chrome %>"
      },
      publish_firefox: {
        cmd: 'git add --all && git commit -m "Version <%= new_version %>" && git tag -a v<%= new_version %> -m "Release v<%= new_version %>" && git push --follow-tags origin master'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'source/**/*.js']
    },
    prompt: {
      version: {
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
              }
            }
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: 'source/**/*',
        tasks: 'debug',
        options: {
          spawn: false,
          atBegin: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-prompt');

  grunt.task.registerTask('debug', 'Compiles in debug mode.', function() {
    grunt.log.ok("Compiling in debug mode.");
    grunt.config.set('compile_path', 'debug');
    var new_version = grunt.file.read('current_version').split('.');
    new_version[3]++;
    grunt.config.set('new_version', new_version.join('.'));
    grunt.task.run([
      'jshint',
      'copy',
      'compress:firefox',
      'clean:firefox'
    ]);
  });

  grunt.task.registerTask('release', 'Compiles in release mode.', function() {
    grunt.log.ok("Compiling in release mode.");
    if (grunt.file.exists('publish')) {
      grunt.config.set('compile_path', 'release');
      grunt.config.set('old_version', grunt.file.read('current_version'));
      grunt.task.run([
        'jshint',
        'exec:sign',
        'prompt',
        'copy',
        'process_chrome',
        'process_firefox'
      ]);
    } else {
      grunt.fail.warn("The required files don't exist. Can't run in 'release' mode.");
      return false;
    }
  });

  grunt.task.registerTask('exec_with_token', 'Sets token to a command and runs it.', function(arg) {
    grunt.config.set(arg, grunt.file.read('publish/' + arg).replace('$TOKEN', grunt.file.readJSON('publish/token').access_token));
    grunt.task.run('exec:' + arg);
  });

  grunt.task.registerTask('process_chrome', 'Compiles and publishes Chrome extension to Chrome Web Store.', function() {
    grunt.config.set('token_request', grunt.file.read('publish/token_request'));
    grunt.task.run([
      'compress:chrome',
      'clean:chrome',
      'exec:token_request',
      'exec_with_token:upload',
      'exec:token_request',
      'exec_with_token:publish_chrome'
    ]);
  });

  grunt.task.registerTask('process_firefox', 'Compiles and publishes Firefox add-on to Github repo.', function() {
    grunt.config.set('update', grunt.file.read('publish/update'));
    grunt.task.run([
      'compress:firefox',
      'clean:firefox',
      'exec:update',
      'exec:sign',
      'update_version',
      'exec:publish_firefox'
    ]);
  });

  grunt.task.registerTask('update_version', 'Updates version in current_version.', function() {
    grunt.file.write('current_version', grunt.config('new_version'));
  });

  grunt.registerTask('default', 'watch');

};