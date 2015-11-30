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
          {expand: true, flatten: true, src: 'source/*.js', dest: '<%= compile_path %>/firefox/data/', filter: 'isFile'},
          {expand: true, flatten: true, src: 'source/*.css', dest: '<%= compile_path %>/firefox/content/', filter: 'isFile'},
          {expand: true, src: 'images/*', dest: '<%= compile_path %>/firefox/content/'},
          {expand: true, cwd: '<%= compile_path %>/chrome/', src: ['forum.js', 'superhero.js'], dest: '<%= compile_path %>/firefox/data/'}
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
          {expand: true, cwd: 'source/', src: 'superhero.js', dest: '<%= compile_path %>/firefox/data/'},

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
        src: ['source/superhero/data.js',
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
        'undef': true,
        'moz': true
      },
      gruntfile: {
        options: {
          'globals': {
            'module': false,
            'require': false
          }
        },
        src: 'Gruntfile.js'
      },
      superhero: {
        options: {
          'globals': {
            'clearInterval': false,
            'clearTimeout': false,
            'confirm': false,
            'console': false,
            'document': false,
            'localStorage': false,
            'location': false,
            'navigator': false,
            'MutationObserver': false,
            'Notification': false,
            'setInterval': false,
            'setTimeout': false,
            'XMLHttpRequest': false,
            'window': false,
            'GUIp': true,
            'starterInt': true,
            // vendor
            '$': true,
            'so': true,
            'Loc': true,
          }
        },
        src: 'source/superhero/*.js'
      },
      forum: {
        options: {
          'globals': {
            'window': false,
            'console': false,
            'document': false,
            'location': false,
            'localStorage': false,
            'MutationObserver': false,
            'getComputedStyle': false,
            'getSelection': false,
            'setInterval': false,
            'clearInterval': false,
            'setTimeout': false,
            'clearTimeout': false,
            'GUIp': true,
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
            'topic': true,
            // vendor
            'EditForm': true,
            'ReplyForm': true,
            'Effect': true,
          }
        },
        src: 'source/forum/*.js'
      },
      other: {
        options: {
          'globals': {
            'chrome': false,
            'window': false,
            'console': true,
            'alert': true,
            'document': false,
            'location': false,
            'localStorage': false,
            'require': false,
            'opera': false,
            'FileReader': false,
            'createObjectIn': false,
            'XMLHttpRequest': false,
            'setInterval': false,
            'clearInterval': false,
            'setTimeout': false,
            'clearTimeout': false,
            'GUIp': true,
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
              validate: isCorrectVersion
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
              validate: isCorrectVersion
            }
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: ['source/**/*', 'Gruntfile.js'],
        tasks: ['notify_hooks', 'debug:firefox'],
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
          image: '../../images/guip.png'
        }
      },
      end: {
        options: {
          title: 'Godville UI+',
          message: 'Rebuild successful',
          image: '../../images/guip.png'
        }
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        title: 'Godville UI+',
        image: '../../images/guip.png',
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

  grunt.registerTask('debug', 'Compiles in debug mode.', function(browser) {
    grunt.log.ok("Compiling in debug mode.");
    grunt.config.set('compile_path', 'debug');
    var new_version = grunt.file.read('current_version').split('.');
    new_version[3]++;
    grunt.config.set('new_version', new_version.join('.'));
    var tasks = [
      'notify:start',
      'clean:chrome',
      'jshint',
      'concat',
      'copy',
      'build_opera',
      'build_firefox',
      'update_installed_addon',
      'notify:end'
    ];
    switch(browser) {
    case 'firefox': tasks.splice(5, 1); break;
    case 'opera': tasks.splice(6, 2); break;
    }
    grunt.task.run(tasks);
  });

  grunt.registerTask('update_installed_addon', 'Sends debug .xpi to FF.', function() {
    require("request").post({url: "http://localhost:8888", body: require("fs").readFileSync("debug/godville-ui-plus@badluck.dicey.xpi")});
  });

  function isCorrectVersion(value) {
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

  grunt.task.run('notify_hooks');

  grunt.registerTask('release', 'Compiles in release mode and publishes.', function(new_version) {
    grunt.log.ok("Compiling in release mode.");
    if (grunt.file.exists('publish')) {
      grunt.config.set('compile_path', 'release');
      grunt.config.set('old_version', grunt.file.read('current_version'));
      grunt.task.run([
        'jshint'
      ]);
      if (new_version && isCorrectVersion(new_version)) {
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

  grunt.registerTask('publish', 'Publishes all versions.', function(new_version) {
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

  grunt.registerTask('exec_with_token', 'Sets token to a command and runs it.', function(arg) {
    grunt.config.set(arg, grunt.file.read('publish/' + arg).replace('$TOKEN', grunt.file.readJSON('publish/token').access_token));
    grunt.task.run('exec:' + arg);
  });

  grunt.registerTask('build_chrome', 'Compiles Chrome extension.', function() {
    grunt.task.run([
      'compress:chrome',
      'clean:chrome',
    ]);
  });

  grunt.registerTask('publish_chrome', 'Publishes Chrome extension to Chrome Web Store.', function() {
    grunt.config.set('token_request', grunt.file.read('publish/token_request'));
    grunt.task.run([
      'exec:token_request',
      'exec_with_token:upload',
      'exec:token_request',
      'exec_with_token:publish_chrome'
    ]);
  });

  grunt.registerTask('build_firefox', 'Compiles Firefox add-on.', function() {
    grunt.task.run([
      'compress:firefox',
      'clean:firefox',
    ]);
  });

  grunt.registerTask('publish_firefox', 'Publishes Firefox add-on to Github repo.', function() {
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

  grunt.registerTask('build_opera', 'Compiles Opera extension.', function() {
    grunt.task.run([
      'compress:opera',
      'clean:opera'
    ]);
  });

  grunt.registerTask('update_version', 'Updates version in "current_version" file and deletes "new_version" file.', function() {
    grunt.file.write('current_version', grunt.file.read('new_version'));
    grunt.file.delete('new_version');
  });

  grunt.registerTask('add_publish_task_to_queue_if_needed', 'Adds "publish" task to queue if needed.', function() {
    if (grunt.config('run_publish')) {
      grunt.task.run('publish');
    } else {
      grunt.log.ok('Run "publish" task manually when you\'re ready.');
    }
  });

  grunt.registerTask('default', 'watch');

};
