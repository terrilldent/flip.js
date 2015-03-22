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
      distDir   = 'dist/',

      devJS     = latest+'.js',
      minJS     = latest+'.min.js';
      gzipJS     = latest+'.min.js.gz';
       
       
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
        src: distDir + devJS,
        dest: distDir + minJS
      }
    },

    jslint: {
      flip: {
        src: ['src/**/*.js'],
        directives: { 
          sloppy: true,
          browser: true,
          nomen: true,
          plusplus: true,
          todo: true,
          white: true,
          predef: []
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
      flip: {
        src: [ sourceDir + 'flip.js', 
               sourceDir + '**/*.js' ],
        dest : distDir + devJS
      }
    },

    compress: {
      flip: {
        options: {
          mode: 'gzip'
        },
        src  : [ distDir + minJS ],
        dest : distDir + gzipJS
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.registerTask('default', [ 'jslint:flip', 'concat:flip', 'uglify:flip', 'compress:flip' ] );
};


