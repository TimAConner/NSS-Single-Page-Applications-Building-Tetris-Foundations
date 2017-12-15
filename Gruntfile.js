module.exports = function(grunt){
    
    grunt.initConfig({
        jshint: {
            files: ['js/**/*.js'],
            options: {
                predef: ["document", "console", "$", "alert"],//Ignore these even though we haven't defined them
                esnext: true, //Telling to use latest version of javascript
                globalstrict: true,
                globals: {},
                browserify: true
            }
        },
        sass: {
            dist: {
                files: {
                    'css/main.css': 'sass/sass.scss'
                }
            }
        }, 
        watch: {
            javascripts: {
                files: ['js/**/*.js'],
                tasks: ['jshint', 'browserify']
            },
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass']
            }
        },
        browserify: {
            'dist/bundle.js': ['js/main.js']
        }
    });

    require("matchdep").filter("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.registerTask("default", ['jshint', 'sass', 'browserify', 'watch']);//Will do by default when you excecute grunt.
//'jshint',
}