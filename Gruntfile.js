module.exports = function( grunt )
{
  var latest = '<%= pkg.name %>',
      name = '<%= pkg.name %>-v<%= pkg.version%>',
      bannerContent = 
        '/*!\n' + 
        ' * <%= pkg.name %> <%= pkg.version %> - Copyright <%= grunt.template.today("yyyy") %> Terrill Dent, http://terrill.ca\n' +
        ' * <%= pkg.license %>\n' +
        ' */\n',

      sourceDir = 'src/',
      distDirJS = 'dist/js/',
      distDirCSS = 'dist/css/',

      devCSS    = name+'.css',

      devJS     = name+'.js',
      minJS     = name+'.min.js';
      gzipJS    = name+'.min.js.gz';
       
       
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    // configure uglify task
    uglify:{
      options : {
        banner: bannerContent,
        report: 'gzip',
        mangle: {
          except: [ '$', 'flip' ]
        }
      },
      flip: {
        src: distDirJS + devJS,
        dest: distDirJS + minJS
      }
    },

    jslint: {
      flip: {
        src: ['src/js/**/*.js'],
        directives: { 
          sloppy: true,
          browser: true,
          nomen: true,
          plusplus: true,
          todo: true,
          white: true,
          predef: ['console']
        },
        options: {
          failOnError: false
        }
      }
    },

    // configure concat task
    concat: {
      options : {
        process : function( source, filepath ) {
            /* Remove block comments */
            return source.replace( /\/\*([\s\S]*?)\*\//g, '' );
        },
        banner: bannerContent
      },
      js: {
        src: [ sourceDir + 'js/flip.js', 
               sourceDir + '**/*.js' ],
        dest : distDirJS + devJS
      },
      css: {
        src: [ sourceDir + 'css/flip.css', 
               sourceDir + '**/*.css' ],
        dest : distDirCSS + devCSS
      }
    },

    compress: {
      flip: {
        options: {
          mode: 'gzip'
        },
        src  : [ distDirJS + minJS ],
        dest : distDirJS + gzipJS
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.registerTask('default', [ 'jslint:flip', 'concat', 'uglify:flip', 'compress:flip' ] );
};


