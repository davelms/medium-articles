module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: {
                src: ["dist", "tmp", ".sass-cache"],
                options: {
                    force: true
                }
            },
            web: {
                src: ["dist/web", "dist/templates", "dist/compilation_cache", "dist/doctrine_cache", "tmp", ".sass-cache"],
                options: {
                    force: true
                }
            }
        },
        jshint: {
            all: ['src/js/*.js']
        },
        concat: {
            all: {
                src: ['src/js/*.js'],
                dest: 'tmp/js/<%= pkg.name %>.js'
            }
        },
        sass: {
            dist: {
                files: {
                    'tmp/css/<%= pkg.name %>.css': 'src/scss/main.scss'
                }
            }
        },
        cssmin: {
            target: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: [{
                    expand: true,
                    cwd: 'tmp/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/web/css/',
                    ext: '.min.css'
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'tmp/js/<%= pkg.name %>.js',
                dest: 'dist/web/js/<%= pkg.name %>.min.js'
            }
        },
        bowercopy: {
            javascript: {
                options: {
                    destPrefix: 'dist/web/js'
                },
                files: {
                    'jquery.min.js': 'jquery/dist/jquery.min.js',
                    'bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                    'html5shiv.min.js': 'html5shiv/dist/html5shiv.min.js',
                    'respond.min.js': 'respond/dest/respond.min.js',
                    'underscore.min.js': 'underscore/underscore-min.js',
                    'jquery.dataTables.min.js': 'datatables.net/js/jquery.dataTables.min.js',
                    'dataTables.bootstrap.min.js': 'datatables.net-bs/js/dataTables.bootstrap.min.js'
                }
            },
            css: {
                options: {
                    destPrefix: 'dist/web/css'
                },
                files: {
                    'bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                    'bootstrap-theme.min.css': 'bootstrap/dist/css/bootstrap-theme.min.css',
                    'font-awesome.min.css': 'components-font-awesome/css/font-awesome.min.css',
                    'dataTables.bootstrap.min.css': 'datatables.net-bs/css/dataTables.bootstrap.min.css'
                }
            },
            bootstrap_fonts: {
                files: {
                    'dist/web/fonts': 'bootstrap/dist/fonts/*.*'
                }
            },
            font_awesome_fonts: {
                files: {
                    'dist/web/fonts': 'components-font-awesome/fonts/*.*'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/php/web/', src: ['**'], dest: 'dist/web/'},
                    {expand: true, cwd: 'src/php/lib/', src: ['**'], dest: 'dist/lib/'},
                    {expand: true, cwd: 'src/static/', src: ['**'], dest: 'dist/web/'},
                    {expand: true, cwd: 'src/ico/', src: ['**'], dest: 'dist/web/ico/'},
                    {expand: true, cwd: 'src/img/', src: ['**'], dest: 'dist/web/img/'},
                    {expand: true, cwd: 'src/css/', src: ['**'], dest: 'dist/web/css/'},
                    {expand: true, cwd: 'src/config/', src: ['**'], dest: 'dist/config/'},
                    {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/templates/'},
                    {src: ['composer.json'], dest: 'dist/'}
                ]
            }
        },
        composer: {
            dist: {
                options: {
                    cwd: 'dist'
                }
            }
        },
        'string-replace': {
            version: {
                files: {
                    'dist/config/settings.ini': 'dist/config/settings.ini'
                },
                options: {
                    replacements: [{
                        pattern: '%APPLICATION_VERSION%',
                        replacement: '<%= pkg.version %>-<%= grunt.template.today("yyyymmdd") %>'
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-composer');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('build-all', ['clean:all', 'concat', 'uglify', 'sass', 'cssmin', 'bowercopy', 'copy', 'string-replace:version', 'composer:dist:install:optimize-autoloader', 'composer:dist:update:optimize-autoloader']);

    grunt.registerTask('build-web', ['clean:web', 'concat', 'uglify', 'sass', 'cssmin', 'bowercopy', 'copy', 'string-replace:version']);

    grunt.registerTask('run-composer', ['composer:dist:install:optimize-autoloader', 'composer:dist:update:optimize-autoloader']);

};