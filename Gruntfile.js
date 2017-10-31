/// <binding ProjectOpened='default' />
module.exports = function (grunt) {
    require('time-grunt')(grunt);

    //lancer les tâches automatiques sans faire appel à chaque fois  à grunt.loadNpmTasks('monplugins)
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        clean: 'grunt-contrib-clean',
        htmlmin: 'grunt-contrib-htmlmin',
        uglify: 'grunt-contrib-uglify',
        jshint: 'grunt-contrib-jshint',
        imagemin: 'grunt-contrib-imagemin',
        processhtml: 'grunt-processhtml',
        jsbeautifier: 'grunt-jsbeautifier',
        sprite: 'grunt-spritesmith',
        image: 'grunt-image',
        tinypng: 'grunt-tinypng',
        focus: 'grunt-focus',
        browserSync:'grunt-browser-sync'


    });

    //var imageminMozjpeg = require('imagemin-mozjpeg');
    var imageminMozjpeg = require('mozjpeg');


    //Création d'une tâche custom HelloCustom
    grunt.registerMultiTask('HelloCustom', function () {
        console.log('HelloCustom coucouc');
    })
    //Création d'une tâche custom replace
    grunt.registerMultiTask('replace', function () {
        var options = this.options();
        console.log('Launch replace ');
        this.files.forEach(function (file) {

            var contenu = grunt.file.read(file.src);

            for (var key in options.map) {
                var dest = options.map[key];
                console.log('key  : %s ,valeur : %s ', key, dest);
                contenu = contenu.replace(key, dest);
            }



            grunt.file.write(file.dest, contenu);
        })
    });

    //Déclarations des tâches
    grunt.initConfig({
        //gestion de la config wordpress pour dploiement
        wordpress: grunt.file.readJSON('wordpress.json'),
       
        focus: {
            dev: {
                exclude: ['less', 'js', 'includehtml']
            },
            dist: {
                exclude: ['lessDev', 'jsDev', 'includehtmlDev']
            },

        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'dist/css/**/*.css',
                        'dist/js/**/*.js',
                        'dist/img/**/*.*',
                        'dist/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist',
                    debugInfo: true,
                    logConnections: true,
                    notify: true
                  
                  
                   
                  
                }
            },
             dist: {
                bsFiles: {
                    src: [
                        'dist/css/**/*.css',
                        'dist/js/**/*.js',
                        'dist/img/**/*.*',
                        'dist/*.html'
                    ]
                },
                options: {
                    watchTask: false,
                    server: './dist',
                    debugInfo: true,
                    logConnections: true,
                    notify: true
                  
                  
                   
                  
                }
            }
        },

        //tâche de surveillance de tous les fichiers *.less *.js *.html
        watch: {
            options: {
                livereload: true
            },

            less: {
                files: ['src/less/**/*.less', 'src/css/**/*.css'],
                tasks: ['copy:csssrc', 'watchCss'],

            },
            lessDev: {
                files: ['src/less/**/*.less', 'src/css/**/*.css'],
                tasks: ['copy:csssrc', 'watchCssDev'],

            },

            js: {
                files: ['src/js/**/*.js'],
                tasks: ['copy:jsrc','watchJs'],
            },
            jsDev: {
                files: ['src/js/**/*.js'],
                tasks: ['copy:jsrc','watchJsDev'],
            },
            img: {
                files: ['src/img/**/*.{png,jpg,jpeg,gif,svg}'],
                tasks: ['copy:img', 'tinypng:compress']
            },
            includehtml: {
                files: ['src/Views/**/*.html'],
                tasks: ['watchHtml']
            },
            includehtmlDev: {
                files: ['src/Views/**/*.html'],
                tasks: ['watchHtmlDev']
            }



        },

        tinypng: {
            options: {
                apiKey: 'WaknFb4uIdORKejejbFBNSQuvbH_R4C9',
                checkSigs: true,
                sigFile: 'src/file_sigs.json',
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },

            compress: {

                expand: true,
                cwd: 'src/img',
                src: ['**/*.{png,jpg,jpeg}'],
                dest: 'dist/img/'
            }
        },
        //tâche image optimisation
        image: {
            options: {
                pngquant: true,
                optipng: true,
                zopflipng: true,
                jpegRecompress: false,
                jpegoptim: true,
                mozjpeg: true,
                gifsicle: true,
                svgo: true
            },
            static: {
                options: {
                    pngquant: true,
                    optipng: true,
                    zopflipng: true,
                    jpegRecompress: false,
                    jpegoptim: true,
                    mozjpeg: true,
                    gifsicle: true,
                    svgo: true
                },
                files: {

                }
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: 'dist/img/'
                }]
            }
        },
        //tâche de versionning des fichiers css / js
        rev: {
            dist: {
                files: {
                    src: [''] // Fichier à versionner

                }
            }
        },
        //tâche replace un token donné par une valeur
        replace: {

            dist: {
                options: {
                    //Système de clé valeur
                    map: {
                        //    '"../../.tmp/concat/css/style.css",' : '../../tmp/concat/css/style.css',
                        '.tmp/concat/css/app.bollore.bundle.min.css': '../../tmp/concat/css/app.bollore.bundle.min.css',
                        '../../.tmp/concat/js/app.bollore.bundle.min.js': '../../tmp/concat/js/app.bollore.bundle.min.js'
                        // '.tmp/concat/css/app.bollore.bundle.min.css' : '../css/app.bollore.bundle.min.css'

                        // '../../dist/css/icomoon.css': '../../tmp/concat/css/icomoon.css',
                        // '../../dist/css/style.css': '../../tmp/concat/css/style.css',
                        // '.tmp/concat/css/app.bollore.bundle.min.css': '../../tmp/concat/css/app.bollore.bundle.min.css'
                        // '"../../.tmp/concat/css/style.css",' : '',
                        // '.tmp/concat/css/app.bollore.bundle.min.css': 'dist/css/app.bollore.bundle.min.css',
                        // '../../.tmp/concat/js/app.bollore.bundle.min.js' : 'dist/js/app.bollore.bundle.min.js'


                    }

                },

                files: {
                    'dist/css/app.bollore.bundle.min.css.map': 'dist/css/app.bollore.bundle.min.css.map',
                    'dist/js/app.bollore.bundle.min.js.map': 'dist/js/app.bollore.bundle.min.js.map'

                }

            }
        },
        //tâche de minification fichier html
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'dist/index.html': 'dist/index.html' // 'destination': 'source'

                }
            }
        },
        //tâche de cleanage de dossier
        clean: {
          
            delJsBabel: ['dist/js/app.bollore.js', 'dist/js/app.bollore.js.map','dist/js/app.bollore.rth.js','dist/js/app.bollore.disclaimer.js', 'dist/js/plugins.js','dist/js/vendors/'],
            tmp: ['.tmp'], //je clean mon dossier temp à la fin
            partials: ['dist/partials/'], //je clean mon dossier partials à la fin
            devwordpress: ['devwordpress'],
            dist: ['dist'],
            delCss: ['!dist/css/app.bollore.bundle.*', 'dist/css/ico*.css', 'dist/css/style*']

 

        },
        //tâche lecture des commentaires de build pour automatiser la fusion  des fichiers css et js en un seul
        useminPrepare: {
            html: /* 'src/index.html'*/ {
                expand: true,
                cwd: 'dist',
                src: '*.html',
                dest: 'dist'
            }
        },
        //tâche génération de minification des css et js min.css et min.js vers le dossier dist
        usemin: {
            html: 'dist/*.html'
        },
        //tâche de copy des fichiers html vers le dossier dist
        copy: {

            dist: {
                expand: true,
                cwd: 'src',
                src: ['*.html','json/**/*.*', 'css/**/*.*', 'img/**/*.*', '!partials/', 'ajax/**/*.*', '*.png', '*.ico', '*.json', '!file_sigs.json','js/**/*.*','medias/**/*.*','*.config'],
                dest: 'dist'
            },
            csstmp: {
                expand: true,
                cwd: 'dist',
                src: ['css/ico*.css', 'css/style*'],
                dest: 'tmp/concat'

            },
           jsrc: {
                expand: true,
                cwd: 'src',
                src: ['js/**/*.*'],
                dest: 'dist'

            },
            csssrc: {
                expand: true,
                cwd: 'src',
                src: ['css/**/*.*'],
                dest: 'dist'

            },
            tmp: {
                expand: true,
                cwd: '.tmp',
                src: ['**/*.*'],
                dest: 'tmp'
            },
            img: {
                expand: true,
                cwd: 'src',
                src: ['img/**/*.*'],
                dest: 'dist'
            },

            //copie le contenu du dossier dist dans le dossier 
         
             wordpressdistStatic: {
                expand: true,
                cwd: 'dist',
                src: ['**/*.*'],
                dest: '<%= wordpress.env.pathHtml %>'
            },
            wordpressdistJs: {
                expand: true,
                cwd: 'dist/js',
                src: ['**/*.*','!jquery.animateNumber.min.js','!app.bollore.bundle.min.js.map'],
                dest: '<%= wordpress.env.pathJs %>'
            },
           
            wordpressdistCss: {
                expand: true,
                cwd: 'dist/css',
                src: ['**/*.*'],
                dest:  '<%= wordpress.env.pathCss %>'
            },
            wordpressdistImg: {
                expand: true,
                cwd: 'dist/img',
                src: [ '**/*.*'],
                dest: '<%= wordpress.env.pathImg %>'
            }




        },
        //tâche de transpilation de fichier .less en .css
        less: {

            options: {
                compress: true,
                optimization: 5,
                sourceMap: false,
                sourceMapRootpath: '/',
                sourceMapBasepath: '/src/less/'
            },
            dist: {
                options: {

                    compress: false,


                },
                //  files: {

                //     'dist/css/style.css': ['src/less/style.less']


                //    
                // }
                expand: true,
                cwd: 'src/less',
                src: 'style.less',
                dest: 'dist/css',
                rename: function (destPath, srcPath) {
                    return destPath + '/' + srcPath.replace('.less', '.css');
                }
            }

        },

        //tâche check js nomenclature
        jshint: {
            all: {
                src: ['src/js/*.js'],
            },
        },

        HelloCustom: {
            dev: {}
        },
        //tâche de surveillance de tous les fichiers *.js
        concat: {
            options: {
                separator: ';',
                // banner: '/*! Copyright RC ' + new Date().toDateString() + '*/',
                stripBanners: false,
                sourceMap: false
            }

        },
        //minify js 
        uglify: {
            generated: {
                options: {
                    beautify: false,
                    mangle : false, 
                    compress : false, 
                    sourceMap: false,
                    banner: '/*! Copyright RC :) ' + new Date().toDateString() + '*/'
                }
            }
        },
        //css min
        cssmin: {
            options: {
                root: 'root',
                sourceMap: true,
                roundingPrecision: -1,
                banner: '/*! Copyright RC :) ' + new Date().toDateString() + '*/'
            }
        },

        //css autoprefixer
        autoprefixer: {
            options: {
                // Task-specific options go here. 
                map: false
            },
            dist: {
                expand: true,
                flatten: true,
                cwd: 'dist/css',
                src: ['style.css'],
                dest: 'dist/css/'
            },
        },
        //optin img
        imagemin: {
            optimise: {
                options: { // Target options 
                    optimizationLevel: 5,
                    svgoPlugins: [{
                        removeViewBox: false
                    }],
                    progressive: false
                    // use: [imageminMozjpeg()]
                },
                files: [{
                        expand: true,

                        cwd: 'src/img',
                        src: ['**/*.{png,jpg,jpeg,gif}'],
                        dest: 'src/img/'

                    }


                ]
            }

        },
        //include html
        processhtml: {
            options: {
                process: true,
            },
            Predev: {
                options: {
                    commentMarker: 'core',
                    includeBase: 'src/Views/partials/'

                },
                /*files: {
                    'src/index.html': ['src/Views/index.html'],

                }*/
                files: [{
                    expand: true,
                    cwd: 'src/Views/',
                    src: ['**/*.html'],
                    dest: 'dist/',
                    ext: '.html'
                }, ]
            },
            Postdev: {
                options: {
                    commentMarker: 'core',
                    includeBase: 'src/Views/partials/'

                },
                /*files: {
                    'src/index.html': ['src/Views/index.html'],

                }*/
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['*.html'],
                    dest: 'dist/',
                    ext: '.html'
                }, ]
            }

        },
        /*format html*/
        prettify: {
            options: {
                "indent": 2,
                "indent_char": " ",
                "indent_scripts": "normal",
                "wrap_line_length": 0,
                "brace_style": "collapse",
                "preserve_newlines": true,
                "max_preserve_newlines": 1,
                "unformatted": [
                    "a",
                    "code",
                    "pre"
                ]
            },
            html: {
                /* files: {
                     'src/index.html': ['src/index.html']
                 }*/
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.html'],
                    dest: 'dist/',
                    ext: '.html'
                }, ]
            }
        },
        //format css less js html etc..
        jsbeautifier: {
            dist: {
                src: ['src/less/*.less'],
                options: {

                    css: {
                        fileTypes: ['.less']
                    },

                }

            }

        },
        //generation sprite Mobile et Desktop
        sprite: {
            desktop: {
                src: 'src/img/desktop/sprites/src/**/*.png',
                dest: 'src/img/desktop/sprites/sprite.png',
                destCss: 'src/less/sprites-desktop.less'
            },
            mobile: {
                src: 'src/img/mobile/sprites/src/**/*.png',
                dest: 'src/img/mobile/sprites/sprite.png',
                destCss: 'src/less/sprites-mobile.less'
            }
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: [{
                    'dist/js/app.bollore.js': 'src/js/app.bollore.js'
                }]
            }
        }



    });
    grunt.registerTask('watchHtml', ['processhtml:Predev', 'processhtml:Postdev', 'usemin:html', 'clean:partials', 'babel:dist', 'useminPrepare:html', 'concat:generated', 'uglify:generated', 'replace:dist', 'copy:tmp', 'copy:csstmp', 'clean:delJsBabel', 'clean:tmp']);
    grunt.registerTask('watchHtmlDev', ['processhtml:Predev', 'processhtml:Postdev', 'clean:partials', 'copy:tmp', 'copy:csstmp', 'clean:tmp']);

    grunt.registerTask('watchCss', ['less:dist', 'autoprefixer:dist', 'processhtml:Predev', 'processhtml:Postdev', 'clean:partials', 'babel:dist', 'useminPrepare:html', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin:html', 'replace:dist', 'copy:tmp', 'copy:csstmp', 'clean:delCss', 'clean:tmp']);
    grunt.registerTask('watchCssDev', ['less:dist', 'autoprefixer:dist', 'processhtml:Predev', 'processhtml:Postdev', 'clean:partials', 'copy:tmp', 'copy:csstmp', 'clean:tmp']);

    grunt.registerTask('watchJs', ['processhtml:Predev', 'processhtml:Postdev', 'clean:partials', 'babel:dist', 'useminPrepare:html', 'concat:generated', 'uglify:generated', 'usemin:html', 'replace:dist', 'copy:tmp', 'copy:csstmp', 'clean:delJsBabel', 'clean:tmp']);
    grunt.registerTask('watchJsDev', ['processhtml:Predev', 'processhtml:Postdev', 'clean:partials', 'copy:tmp', 'copy:csstmp', 'clean:tmp']);

    //deployer package dossier ./dist
    grunt.registerTask('dist', [
        'copy:dist',
        'less:dist',
        'autoprefixer',
        'processhtml:Predev',
        'processhtml:Postdev',
        'clean:partials',

        'babel:dist',
        // 'concat:dist',


        'useminPrepare:html', //lecture des commentaires de build//lecture des commentaires de build
        'concat:generated', //concatener les 2 fichiers css
        'cssmin:generated', //minify css
        'uglify:generated', //minify js   'uglify:generated',
        //copier html png ico json
        // 'rev:dist', //verionning fichiers
        'usemin:html', //remplace css et js minifier par la balise link ou script en un seul fichier
        //'htmlmin:dist', //minify html
        //'replace:dist', //remplacement cdn
        'clean:partials',
        'copy:tmp',
        'copy:csstmp',
        'clean:delCss',
        'clean:delJsBabel',
        /* 'prettify',*/

        'clean:tmp',
        'copy:wordpressdistStatic',
        'copy:wordpressdistJs',
        'copy:wordpressdistCss',
        'copy:wordpressdistImg'
        //,'browserSync:dist'
        // 'focus:dist'
    ]);

    grunt.registerTask('dev', [
        'copy:dist',
        'less:dist',
        'autoprefixer',
        'processhtml:Predev',
        'processhtml:Postdev',
        'clean:partials',

        'babel:dist',


        // 'useminPrepare:html', //lecture des commentaires de build//lecture des commentaires de build
        //  'concat:generated', //concatener les 2 fichiers css
        //  'cssmin:generated', //minify css
        //  'uglify:generated', //minify js 
        //copier html png ico json
        // 'rev:dist', //verionning fichiers
        // 'usemin:html', //remplace css et js minifier par la balise link ou script en un seul fichier
        //'htmlmin:dist', //minify html
        //'replace:dist', //remplacement cdn
        'clean:partials',
        'copy:tmp',
        'copy:csstmp',
        'copy:jsrc',

        /* 'prettify',*/
        'clean:tmp',
        'browserSync:dev',
        'focus:dev',
        

    ]);


    //deployer package vers SVN de dev
    grunt.registerTask('wordpressdev', ['clean:dist',
        'dist', //clean le ./dist
        'copy:wordpress', //copie contenu ./dist dans le dossier ./devwordpress
        'clean:dist', //supprime le contenu du dossier ./dist
        'copy:wordpressdevHtml', //copie html js img css dans le dossier SVN  de wordpresss voir variable env.pathHtml à modifier  wordpress.json
        'copy:wordpressdevCss', //copie dossier css  dans le dossier SVN  de wordpresss voir variable env.pathCss à modifier  wordpress.json
        'copy:wordpressdevJs', //copie dossier js  dans le dossier SVN  de wordpresss voir variable env.pathJs à modifier  wordpress.json
        'copy:wordpressdevImg', //copie dossier img  dans le dossier SVN  de wordpresss voir variable env.pathImg à modifier  wordpress.json
        'copy:wordpressdevAjax', //copie dossier ajax  dans le dossier SVN  de wordpresss voir variable env.pathImg à modifier  wordpress.json,
        'clean:devwordpress' //Clean dossier ./devwordpress   une fois la tâche terminée

    ]);

    //mode dev
    grunt.registerTask('default', ['clean:dist', 'dev']);

    //mode prod dist
    grunt.registerTask('build', ['clean:dist',   'dist']);
};
