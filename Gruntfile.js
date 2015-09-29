module.exports = function(grunt) {

  var config = {
    in: 'src',
    out: 'dist'
  };


  var javascriptFiles = [
    '<%= config.in %>/bower/jquery/dist/jquery.js',
    '<%= config.in %>/bootstrap/dist/js/bootstrap.js',
    '<%= config.in %>/classie/classie.js',
    '<%= config.in %>/pace/pace.js',
    '<%= config.in %>/wow/dist/wow.js',

    '<%= config.in %>/js/*.js'
  ];


  var minifiedJs = '<%= config.out %>/js/min/all.min.js';
  var minifiedCss = '<%= config.out %>/css/min/all.min.css';


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    config: config,

    clean: [
      '<%= config.out %>/js/min/*',
      '<%= config.out %>/css/min/*'
    ],

    less: {
      bower: {
        options: {
          compress: true,
          optimization: 2,
          outputSourceFiles: true
        },
        files: {
          "<%= config.in %>/stylesheets/css/concat/style.css": "<%= config.in %>/stylesheets/less/style.less"
        }
      }
    },

    watch: {
      scripts: {
        files: javascriptFiles,
        tasks: ['run_js'],
        options: {
          spawn: false
        }
      },
      css: {
        files: [
          '<%= config.in.core%>/stylesheets/less/**/*.less',
          '<%= config.in.content%>/stylesheets/less/**/*.less'
        ],
        tasks: ['run_css'],
        options: {
          spawn: false
        }
      }
    },

    concat: {
      /* Main Stylesheet */
      main_css: {
        stripBanners: true,
        src:"<%= config.in %>/stylesheets/css/style.css",
        dest: minifiedCss
      },

      /* Main Javascript */
      main_js: {
        options: {
          separator: ';'
        },
        src: javascriptFiles,
        dest: '<%= config.in %>/js/concat/all.js'
      }
    },

    uglify: {
      js: {
        files: {
          '<%= config.out %>/js/min/all.min.js': '<%= config.in %>/js/concat/all.js'
        }
      }
    }


    //copy: {
    //  main: {
    //    files: [
    //      { flatten: true, expand: true, filter: 'isFile', cwd: '<%= config.in.bower %>/', src: 'bootstrap/fonts/*', dest: '<%= config.out %>/fonts/bootstrap/' },
    //      { flatten: true, expand: true, filter: 'isFile', cwd: '<%= config.in.bower %>/', src: 'font-awesome/fonts/*', dest: '<%= config.out %>/fonts/font-awesome/' },
    //      { flatten: true, expand: true, filter: 'isFile', cwd: '<%= config.in.core %>/', src: 'img/*', dest: '<%= config.out %>/img/' }
    //    ]
    //  }
    //}
  });


  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'clean',
    'less',
    'concat',
    'uglify'

  ]);

  grunt.registerTask('run_js', [
    'clean',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('run_css', [
    'clean',
    'concat'
  ]);

};
