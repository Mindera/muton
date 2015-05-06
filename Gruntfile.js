module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            pre: ['muton*', 'bower_components', 'lib', 'coverage']
        },
        bower: {
            install: {
                options: {
                    install: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    verbose: true
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: ['Gruntfile.js']
            },
            js: {
                src: ['src/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        mochacli: {
            options: {
                reporter: 'nyan',
                bail: true
            },
            all: ['test/*.js']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:js', 'mochacli']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'mochacli']
            }
        },

        requirejs: {
            dist: {
                options: {
                    optimize: 'uglify2',
                    uglify2: {
                        mangle: false,
                        compress: {
                            sequences: true,
                            properties: true,
                            dead_code: true,
                            conditionals: true,
                            booleans: true,
                            unused: true,
                            if_return: true,
                            join_vars: true,
                            drop_console: true
                        }
                    },
                    baseUrl: './src',
                    paths: {
                        lodash: '../lib/lodash/lodash',
                        bucket: 'mutators/bucket',
                        throttle: 'mutators/throttle',
                        helicase: 'enzymes/helicase',
                        primase: 'enzymes/primase',
                        polymerase: 'enzymes/polymerase',
                        chemical: 'reactions/chemical',
                        proofReading: 'reactions/proof-reading'
                    },
                    name: 'muton',
                    out: 'muton-amd.min.js',
                    onModuleBundleComplete: function (data) {
                        var fs = require('fs');
                        var amdclean = require('amdclean');
                        var inputFile = data.path;

                        fs.writeFileSync('muton.js', amdclean.clean({
                            'filePath': inputFile
                        }));
                    }
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            minjs: {
                files: {
                    'muton.min.js': ['muton.js']
                }
            }
        },
        mocha_istanbul: {
            coveralls: {
                src: ['test'],
                options: {
                    check: {
                        lines: 80,
                        statements: 80,
                        branches: 80
                    },
                    root: './src',
                    reportFormats: ['lcov']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'mochacli', 'coveralls']);
    grunt.registerTask('coveralls', ['mocha_istanbul:coveralls']);
    grunt.registerTask('travis', ['clean:pre', 'bower']);
    grunt.registerTask('default', [
        'clean:pre',
        'bower',
        'test',
        'coveralls',
        'requirejs:dist',
        'uglify'
    ]);
};
