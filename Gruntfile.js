module.exports = function(grunt) {

  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      chrome: {
        files: [
          { expand: true, flatten: true, src: ['source/chrome/*', 'source/*'], dest: '<%= compile_path %>/chrome/', filter: 'isFile' },
          { expand: true, cwd: 'source/chrome/_locales', src: '**', dest: '<%= compile_path %>/chrome/_locales/' },
          { expand: true, src: 'images/*', dest: '<%= compile_path %>/chrome/' },
          { expand: true, cwd: '<%= compile_path %>/', src: ['forum.js', 'superhero.js'], dest: '<%= compile_path %>/chrome/' }
        ]
      },
      chrome_versioned: {
        options: {
          process: function(aContent) {
            return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        files: [
          { expand: true, cwd: 'source/chrome/', src: 'manifest.json', dest: '<%= compile_path %>/chrome/' }
        ]
      },
      firefox: {
        files: [
          { expand: true, cwd: 'source/firefox', src: '**', dest: '<%= compile_path %>/firefox/' },
          { expand: true, flatten: true, src: 'source/*.js', dest: '<%= compile_path %>/firefox/data/', filter: 'isFile' },
          { expand: true, flatten: true, src: 'source/*.css', dest: '<%= compile_path %>/firefox/content/', filter: 'isFile' },
          { expand: true, src: 'images/*', dest: '<%= compile_path %>/firefox/content/' },
          { expand: true, cwd: '<%= compile_path %>/', src: ['forum.js', 'superhero.js'], dest: '<%= compile_path %>/firefox/data/' }
        ]
      },
      firefox_versioned: {
        options: {
          process: function(aContent) {
            return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        files: [
          { expand: true, cwd: 'source/firefox/', src: 'install.rdf', dest: '<%= compile_path %>/firefox/' }
        ]
      },
      opera: {
        files: [
          { expand: true, cwd: 'source/opera', src: '**', dest: '<%= compile_path %>/opera/' },
          { expand: true, cwd: 'source/', src: '*', dest: '<%= compile_path %>/opera/content/', filter: 'isFile' },
          { expand: true, cwd: 'source/vendor/', src: '*', dest: '<%= compile_path %>/opera/content/' },
          { expand: true, cwd: '<%= compile_path %>/', src: ['forum.js', 'superhero.js'], dest: '<%= compile_path %>/opera/content/' }
        ]
      },
      opera_versioned: {
        options: {
          process: function(aContent) {
            return aContent.replace(/\$VERSION/g, grunt.config('new_version'));
          }
        },
        files: [
          { expand: true, cwd: 'source/opera/', src: 'config.xml', dest: '<%= compile_path %>/opera/' }
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
        src: 'source/forum/*.js',
        dest: '<%= compile_path %>/forum.js'
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
        src: 'source/superhero/*.js',
        dest: '<%= compile_path %>/superhero.js'
      }
    },
    clean: {
      temp: "<%= compile_path %>/*.js",
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
            'chrome': false,
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
          '!source/vendor/*.js',
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
        image: '../../images/guip.png'
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
      'jshint',
      'concat'
    ];
    switch(browser) {
    case 'chrome': tasks.push('build:chrome'); break;
    case 'firefox': tasks.push('build:firefox', 'update_installed_addon'); break;
    case 'opera': tasks.push('build:opera'); break;
    default: tasks.push('build:chrome', 'build:firefox', 'update_installed_addon', 'build:opera');
    }
    tasks.push('clean:temp', 'notify:end');
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
      grunt.config.set('browser', aBrowser);
      grunt.task.run([
        'copy:' + aBrowser,
        'copy:' + aBrowser + '_versioned',
        'compress:' + aBrowser,
        'clean:' + aBrowser
      ]);
    }
  });

  grunt.registerTask('default', 'watch');

  grunt.task.run('notify_hooks');

};
