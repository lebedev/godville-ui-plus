module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      chrome: {
        files: [
          {expand: true, flatten: true, src: ['source/chrome/*', 'source/*'], dest: '<%= compile_path %>/chrome/', filter: 'isFile'},
          {expand: true, cwd: 'source/chrome/_locales', src: '**', dest: '<%= compile_path %>/chrome/_locales/'},
          {expand: true, src: 'images/*', dest: '<%= compile_path %>/chrome/'}
        ]
      },
      firefox: {
        files: [
          {expand: true, cwd: 'source/firefox', src: '**', dest: '<%= compile_path %>/firefox/'},
          {expand: true, flatten: true, src: 'source/*.js', dest: '<%= compile_path %>/firefox/resources/godville-ui-plus/data/', filter: 'isFile'},
          {expand: true, flatten: true, src: 'source/*.css', dest: '<%= compile_path %>/firefox/content/', filter: 'isFile'},
          {expand: true, src: 'images/*', dest: '<%= compile_path %>/firefox/content/'},
          {expand: true, cwd: '<%= compile_path %>/chrome/', src: ['forum.js', 'superhero.js'], dest: '<%= compile_path %>/firefox/resources/godville-ui-plus/data/'}
        ]
      },
      opera: {
        files: [
          {expand: true, cwd: 'source/opera', src: '**', dest: '<%= compile_path %>/opera/'},
          {expand: true, cwd: 'source/', src: '*', dest: '<%= compile_path %>/opera/content/', filter: 'isFile'},
          {expand: true, cwd: 'source/vendor/', src: '*', dest: '<%= compile_path %>/opera/content/'},
          {expand: true, cwd: '<%= compile_path %>/chrome/', src: ['forum.js', 'superhero.js'], dest: '<%= compile_path %>/opera/content/'}
        ]
      },
      version: {
        options: {
          process: function(content, srcpath) {
            return content.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        files: [
          {expand: true, cwd: 'source/chrome/', src: 'manifest.json', dest: '<%= compile_path %>/chrome/'},
          {expand: true, cwd: 'source/', src: 'superhero.js', dest: '<%= compile_path %>/chrome/'},

          {expand: true, cwd: 'source/firefox/', src: ['install.rdf', 'harness-options.json'], dest: '<%= compile_path %>/firefox/'},
          {expand: true, cwd: 'source/', src: 'superhero.js', dest: '<%= compile_path %>/firefox/resources/godville-ui-plus/data/'},

          {expand: true, cwd: 'source/opera/', src: 'config.xml', dest: '<%= compile_path %>/opera/'}
        ]
      }
    },
    concat: {
      forum: {
        options: {
          banner: "(function() {\n" +
                  "'use strict';\n\n",
          footer: "\n\n})();"
        },
        src: ['source/forum/init.js',
              'source/forum/topic_formatting.js',
              'source/forum/topic_other.js',
              'source/forum/main.js'],
        dest: '<%= compile_path %>/chrome/forum.js'
      },
      superhero: {
        options: {
          banner: "(function() {\n" +
                  "'use strict';\n\n",
          footer: "\n\n})();",
          process: function(content, srcpath) {
            return content.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        src: ['source/superhero/init.js',
              'source/superhero/data.js',
              'source/superhero/utils.js',
              'source/superhero/timeout.js',
              'source/superhero/help.js',
              'source/superhero/storage.js',
              'source/superhero/words.js',
              'source/superhero/stats.js',
              'source/superhero/logger.js',
              'source/superhero/informer.js',
              'source/superhero/forum.js',
              'source/superhero/improver.js',
              'source/superhero/inventory.js',
              'source/superhero/timers.js',
              'source/superhero/observers.js',
              'source/superhero/trycatcher.js',
              'source/superhero/starter.js',
              'source/superhero/main.js'],
        dest: '<%= compile_path %>/chrome/superhero.js'
      }
    },
    clean: {
      chrome: "<%= compile_path %>/chrome/*",
      firefox: "<%= compile_path %>/firefox/*",
      opera: "<%= compile_path %>/opera/*"
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
      },
      opera: {
        options: {
          archive: '<%= compile_path %>/godville-ui-plus@badluck.dicey.oex',
          mode: 'zip'
        },
        files: [
          {expand: true, cwd: '<%= compile_path %>/opera', src: '**'}
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
      options: {
        'curly': true,
        'eqnull': true,
        'eqeqeq': true,
        'undef': true
      },
      gruntfile: {
        options: {
          'globals': {
            'module': false
          }
        },
        src: 'Gruntfile.js'
      },
      superhero: {
        options: {
          'globals': {
            'worker': true,
            'window': false,
            'createObjectIn': false,
            'document': false,
            'location': false,
            'navigator': false,
            'localStorage': false,
            'XMLHttpRequest': false,
            'MutationObserver': false,
            'ui_data': true,
            'ui_utils': true,
            'ui_timeout': true,
            'ui_help': true,
            'ui_storage': true,
            'ui_words': true,
            'ui_stats': true,
            'ui_logger': true,
            'ui_informer': true,
            'ui_forum': true,
            'ui_improver': true,
            'ui_inventory': true,
            'ui_timers': true,
            'ui_observers': true,
            'ui_starter': true,
            'ui_trycatcher': true,
            'starterInt': true,
          }
        },
        src: 'source/superhero/*.js'
      },
      forum: {
        options: {
          'globals': {
            'worker': true,
            'window': false,
            'document': false,
            'location': false,
            'localStorage': false,
            'MutationObserver': false,
            'getComputedStyle': false,
            '$id': true,
            '$C': true,
            '$Q': true,
            '$q': true,
            'storage': true,
            'addSmallElements': true,
            'addLinks': true,
            'addFormattingButtonsAndCtrlEnter': true,
            'fixGodnamePaste': true,
            'improveTopic': true,
            'i': true,
            'len': true,
            'isTopic': true,
            'forum_no': true,
            'topics': true,
            'topic': true
          }
        },
        src: 'source/forum/*.js'
      },
      other: {
        options: {
          'globals': {
            'worker': true,
            'window': false,
            'document': false,
            'location': false,
            'localStorage': false,
            'unsafeWindow': false,
            'require': false,
            'opera': false,
            'FileReader': false,
            'createObjectIn': false,
            'XMLHttpRequest': false,
          }
        },
        src: [
          'source/**/*.js',
          '!source/vendor/*.js',
          '!source/superhero/*.js',
          '!source/forum/*.js',
          '!source/firefox/bootstrap.js'
        ]
      }
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
              validate: isCorrentVersion
            }
          ]
        }
      },
      publish: {
        options: {
          questions: [
            {
              config: 'run_publish',
              type: 'confirm',
              message: 'Did you signed .xpi-file and want to run "publish" task?',
              default: true,
              validate: isCorrentVersion
            }
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: ['source/**/*', 'Gruntfile.js'],
        tasks: ['notify_hooks', 'debug'],
        options: {
          spawn: true,
          atBegin: true
        }
      }
    },
    notify: {
      start: {
        options: {
          title: 'Godville UI+',
          message: 'Rebuild initiated',
        }
      },
      end: {
        options: {
          title: 'Godville UI+',
          message: 'Rebuild successful',
          callbackurl: 'D:\\Stuff\\Codein\\godville\\godville-ui-plus\\debug\\godville-ui-plus@badluck.dicey.xpi'
        }
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        title: 'Godville UI+'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-prompt');

  grunt.task.registerTask('debug', 'Compiles in debug mode.', function() {
    grunt.log.ok("Compiling in debug mode.");
    grunt.config.set('compile_path', 'debug');
    var new_version = grunt.file.read('current_version').split('.');
    new_version[3]++;
    grunt.config.set('new_version', new_version.join('.'));
    grunt.task.run([
      'notify:start',
      'jshint',
      'concat',
      'copy',
      'build_firefox',
      'build_opera',
      'notify:end'
    ]);
  });

  function isCorrentVersion(value) {
    if (!value.match(/\d+\.\d+\.\d+\.\d+/)) {
      return false;
    } else {
      var new_version = value.split('.'),
          old_version = grunt.config('old_version').split('.'),
          isCorrect = +old_version[0] < +new_version[0] ? true :
                      +old_version[0] > +new_version[0] ? false :
                      +old_version[1] < +new_version[1] ? true :
                      +old_version[1] > +new_version[1] ? false :
                      +old_version[2] < +new_version[2] ? true :
                      +old_version[2] > +new_version[2] ? false :
                      +old_version[3] < +new_version[3] ? true : false;
      if (isCorrect) {
        grunt.file.write('new_version', value);
      }
      return isCorrect;
    }
  }

  grunt.task.registerTask('release', 'Compiles in release mode and publishes.', function(new_version) {
    grunt.log.ok("Compiling in release mode.");
    if (grunt.file.exists('publish')) {
      grunt.config.set('compile_path', 'release');
      grunt.config.set('old_version', grunt.file.read('current_version'));
      grunt.task.run([
        'jshint'
      ]);
      if (new_version && isCorrentVersion(new_version)) {
        grunt.config.set('new_version', new_version);
        grunt.log.ok('Got new version number: ' + new_version);
      } else {
        grunt.task.run('prompt:version');
      }
      grunt.task.run([
        'concat',
        'copy',
        'build_chrome',
        'build_opera',
        'build_firefox',
        'prompt:publish',
        'add_publish_task_to_queue_if_needed',
      ]);

    } else {
      grunt.fail.warn("The required files don't exist. Can't run in 'release' mode.");
      return false;
    }
  });

  grunt.task.registerTask('publish', 'Publishes all versions.', function(new_version) {
    grunt.log.ok("Publishing.");
    if (grunt.file.exists('publish')) {
      grunt.task.run([
        'publish_chrome',
        'publish_firefox',
      ]);
    } else {
      grunt.fail.warn("The required files don't exist. Can't publish.");
      return false;
    }
  });

  grunt.task.registerTask('exec_with_token', 'Sets token to a command and runs it.', function(arg) {
    grunt.config.set(arg, grunt.file.read('publish/' + arg).replace('$TOKEN', grunt.file.readJSON('publish/token').access_token));
    grunt.task.run('exec:' + arg);
  });

  grunt.task.registerTask('build_chrome', 'Compiles Chrome extension.', function() {
    grunt.task.run([
      'compress:chrome',
      'clean:chrome',
    ]);
  });

  grunt.task.registerTask('publish_chrome', 'Publishes Chrome extension to Chrome Web Store.', function() {
    grunt.config.set('token_request', grunt.file.read('publish/token_request'));
    grunt.task.run([
      'exec:token_request',
      'exec_with_token:upload',
      'exec:token_request',
      'exec_with_token:publish_chrome'
    ]);
  });

  grunt.task.registerTask('build_firefox', 'Compiles Firefox add-on.', function() {
    grunt.task.run([
      'compress:firefox',
      'clean:firefox',
    ]);
  });

  grunt.task.registerTask('publish_firefox', 'Publishes Firefox add-on to Github repo.', function() {
    if (!grunt.config('new_version')) {
      grunt.config.set('new_version', grunt.file.read('new_version'));
    }
    grunt.config.set('update', grunt.file.read('publish/update'));
    grunt.task.run([
      'exec:update',
      'exec:sign',
      'update_version',
      'exec:publish_firefox'
    ]);
  });

  grunt.task.registerTask('build_opera', 'Compiles Opera extension.', function() {
    grunt.task.run([
      'compress:opera',
      'clean:opera'
    ]);
  });

  grunt.task.registerTask('update_version', 'Updates version in "current_version" file and deletes "new_version" file.', function() {
    grunt.file.write('current_version', grunt.file.read('new_version'));
    grunt.file.delete('new_version');
  });

  grunt.task.registerTask('add_publish_task_to_queue_if_needed', 'Adds "publish" task to queue if needed.', function() {
    if (grunt.config('run_publish')) {
      grunt.task.run('publish');
    } else {
      grunt.log.ok('Run "publish" task manually when you\'re ready.');
    }
  });

  grunt.registerTask('default', 'watch');

};
