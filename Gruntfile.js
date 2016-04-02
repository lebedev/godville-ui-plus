module.exports = function(grunt) {

  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      chrome: {
        files: [
          { expand: true, flatten: true, src: ['source/chrome/*', 'source/module_loader.js'], dest: '<%= compile_path %>/chrome/', filter: 'isFile' },
          { expand: true, cwd: 'source/modules', src: '**', dest: '<%= compile_path %>/chrome/modules/' },
          { expand: true, cwd: 'source/css', src: '**', dest: '<%= compile_path %>/chrome/css/' },
          { expand: true, cwd: 'source/chrome/_locales', src: '**', dest: '<%= compile_path %>/chrome/_locales/' },
          { expand: true, src: 'images/*', dest: '<%= compile_path %>/chrome/' }
        ]
      },
      chrome_versioned: {
        options: {
          process: function(aContent) {
            if (grunt.config('compile_path') === 'debug') {
              return aContent.replace(/\$VERSION_NAME/g, grunt.config('debug_version') + ' debug build ' + grunt.config('debug_build'))
                             .replace(/\$VERSION/g, grunt.config('debug_version'));
            } else {
              return aContent.replace(/\$VERSION_NAME|\$VERSION/g, grunt.config('new_version'));
            }
          }
        },
        files: [
          { expand: true, cwd: 'source/chrome/', src: 'manifest.json', dest: '<%= compile_path %>/chrome/' }
        ]
      },
      firefox: {
        files: [
          { expand: true, cwd: 'source/firefox', src: '**', dest: '<%= compile_path %>/firefox/' },
          { expand: true, flatten: true, src: 'source/module_loader.js', dest: '<%= compile_path %>/firefox/content/' },
          { expand: true, cwd: 'source/modules', src: '**', dest: '<%= compile_path %>/firefox/content/modules/' },
          { expand: true, cwd: 'source/css', src: '**', dest: '<%= compile_path %>/firefox/content/css/' },
          { expand: true, src: 'images/*', dest: '<%= compile_path %>/firefox/content/' }
        ]
      },
      firefox_versioned: {
        options: {
          process: function(aContent) {
            if (grunt.config('compile_path') === 'debug') {
              return aContent.replace(/\$VERSION/g, grunt.config('debug_version') + ' debug build ' + grunt.config('debug_build'));
            } else {
              return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
            }
          }
        },
        files: [
          { expand: true, cwd: 'source/firefox/', src: 'install.rdf', dest: '<%= compile_path %>/firefox/' }
        ]
      },
      opera: {
        files: [
          { expand: true, cwd: 'source/opera', src: '**', dest: '<%= compile_path %>/opera/' },
          { expand: true, cwd: 'source/', src: '*', dest: '<%= compile_path %>/opera/content/', filter: 'isFile' }
        ]
      },
      opera_versioned: {
        options: {
          process: function(aContent) {
            if (grunt.config('compile_path') === 'debug') {
              return aContent.replace(/\$VERSION/g, grunt.config('debug_version') + ' debug build ' + grunt.config('debug_build'));
            } else {
              return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
            }
          }
        },
        files: [
          { expand: true, cwd: 'source/opera/', src: 'config.xml', dest: '<%= compile_path %>/opera/' }
        ]
      }
    },
    clean: {
      chrome: '<%= compile_path %>/chrome',
      firefox: '<%= compile_path %>/firefox',
      opera: '<%= compile_path %>/opera'
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
        browser: true,
        curly: true,
        eqnull: true,
        eqeqeq: true,
        undef: true,
        moz: true
      },
      all: {
        options: {
          'globals': {
            // Native
            'module': false,
            'opera': false,
            'require': false,
            // GUIp
            'GUIp': true
          }
        },
        src: [
          'Gruntfile.js',
          'source/**/*.js',
          '!source/opera/polyfills/*.js',
          '!source/firefox/bootstrap.js'
        ]
      }
    },
    watch: {
      scripts: {
        files: ['source/**/*', 'Gruntfile.js'],
        tasks: ['debug:firefox'],
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
        image: '../../images/guip.png'
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  if (grunt.file.exists('publish')) {
    grunt.loadTasks('publish');
  }

  grunt.registerTask('debug', 'Compiles in debug mode.', function (aBrowser) {
    grunt.log.ok('Compiling in debug mode.');
    grunt.config.set('compile_path', 'debug');
    var tasks = [
      'notify:start',
      'jshint',
      'bump_debug_build'
    ];
    switch(aBrowser) {
    case 'chrome':  tasks.push('build:chrome'); break;
    case 'firefox': tasks.push('build:firefox', 'update_installed_addon'); break;
    case 'opera':   tasks.push('build:opera'); break;
    default:        tasks.push('build:chrome', 'build:firefox', 'update_installed_addon', 'build:opera');
    }
    tasks.push('notify:end');
    grunt.task.run(tasks);
  });

  grunt.registerTask('update_installed_addon', 'Sends debug .xpi to FF.', function () {
    require('request').post({ url: 'http://localhost:8888', body: require('fs').readFileSync('debug/godville-ui-plus@badluck.dicey.xpi') });
  });

  grunt.registerTask('bump_debug_build', 'Bumps debug build number.', function () {
    var current_version_octets = grunt.file.read('current_version').split('.');
    current_version_octets[2]++;
    grunt.config.set('debug_version', current_version_octets.join('.'));

    var debug_build;
    try {
      debug_build = (+grunt.file.read('debug/build') + 1) || 1;
    } catch(e) {
      debug_build = 1;
    } finally {
      grunt.file.write('debug/build', debug_build);
    }
    grunt.config.set('debug_build', debug_build);
    grunt.log.ok(
      'Debug version is ' +
      '*' + grunt.config('debug_version') + ' debug build ' + grunt.config('debug_build') + '*.'
    );
  });

  grunt.registerTask('build', 'Compiles extension for a specific browser.', function(aBrowser) {
    if (!aBrowser) {
      grunt.fatal('No browser specified');
    } else if (!aBrowser.match(/chrome|firefox|opera/)) {
      grunt.fatal('Wrong parameter. Possible values are: *chrome*, *firefox* and *opera*.');
    } else {
      grunt.config.set('browser', aBrowser);
      var tasks = [
        'copy:' + aBrowser,
        'copy:' + aBrowser + '_versioned'
      ];
      if (grunt.config('compile_path') !== 'debug' || aBrowser !== 'chrome') {
        tasks.push(
          'compress:' + aBrowser,
          'clean:' + aBrowser
        );
      }
      grunt.task.run(tasks);
    }
  });

  grunt.registerTask('default', 'watch');

  grunt.task.run('notify_hooks');

};
