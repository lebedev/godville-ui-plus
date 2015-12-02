module.exports = function(grunt) {

  grunt.config.init({
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
      versioned: {
        options: {
          process: function(aContent) {
            return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        files: [
          {expand: true, cwd: 'source/chrome/', src: 'manifest.json', dest: '<%= compile_path %>/chrome/'},

          {expand: true, cwd: 'source/firefox/', src: 'install.rdf', dest: '<%= compile_path %>/firefox/'},

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
        src: [
          'source/forum/init.js',
          'source/forum/topic_formatting.js',
          'source/forum/topic_other.js',
          'source/forum/main.js'
        ],
        dest: '<%= compile_path %>/chrome/forum.js'
      },
      superhero: {
        options: {
          banner: "(function() {\n" +
                  "'use strict';\n\n",
          footer: "\n\n})();",
          process: function(aContent) {
            return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        src: [
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
          'source/superhero/main.js'
        ],
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
          archive: '<%= compile_path %>/godville-ui-plus@badluck.dicey_chrome.zip'
        },
        files: [
          { expand: true, cwd: '<%= compile_path %>/chrome', src: '**' }
        ]
      },
      firefox: {
        options: {
          archive: '<%= compile_path %>/godville-ui-plus@badluck.dicey.xpi',
          mode: 'zip'
        },
        files: [
          { expand: true, cwd: '<%= compile_path %>/firefox', src: '**' }
        ]
      },
      opera: {
        options: {
          archive: '<%= compile_path %>/godville-ui-plus@badluck.dicey.oex',
          mode: 'zip'
        },
        files: [
          { expand: true, cwd: '<%= compile_path %>/opera', src: '**' }
        ]
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

  require('load-grunt-tasks')(grunt);
  if (grunt.file.exists('publish')) {
    grunt.loadTasks('publish');
  }

  grunt.registerTask('debug', 'Compiles in debug mode.', function(browser) {
    grunt.log.ok('Compiling in debug mode.');
    grunt.config.set('compile_path', 'debug');
    if (browser === 'firefox') {
      var build;
      try {
        build = (+grunt.file.read('debug/build') + 1) || 1;
      } catch(e) {
        build = 1;
      } finally {
        grunt.file.write('debug/build', build);
      }
      grunt.config.set('new_version', grunt.file.read('current_version') + '-' + build);
    } else {
      grunt.config.set('new_version', grunt.file.read('current_version'));
    }
    grunt.log.ok('Debug version is *' + grunt.config.get('new_version') + '*.');
    var tasks = [
      'notify:start',
      'clean:chrome',
      'jshint',
      'concat',
      'copy',
      'build:opera',
      'build:firefox',
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
    require("request").post({ url: "http://localhost:8888", body: require("fs").readFileSync("debug/godville-ui-plus@badluck.dicey.xpi") });
  });


  grunt.registerTask('build', 'Compiles extension for a specific browser.', function(aBrowser) {
    if (!aBrowser) {
      grunt.fatal('No browser specified');
    } else if (!aBrowser.match(/chrome|firefox|opera/)) {
      grunt.fatal('Wrong parameter. Possible values are: *chrome*, *firefox* and *opera*.');
    } else {
      grunt.task.run([
        'compress:' + aBrowser,
        'clean:' + aBrowser
      ]);
    }
  });

  grunt.registerTask('default', 'watch');

  grunt.task.run('notify_hooks');

};
