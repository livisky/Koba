module.exports = function (grunt) {

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);

    var aliasInfo = grunt.file.readJSON("alias_info.json");

    // 过滤*-debug的JS文件
    var filterDebugJS = function(filePath) {
        var result = filePath.indexOf('-debug.') === -1;

        return result;
    };

    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),

        // 监视变动
        watch: {
            files: [
                'src/js/**/*.js',
                'src/js/**/*.css',
                './Gruntfile.js',
                'src/less/**/*.less',
                'src/css/**/*.css'
            ],
            tasks: [
                'less',
                'jshint',
                'transport',
                'concat',
                'uglify',
                'clean'
            ]
        },

        // js验证
        jshint: {
            options: {
                immed: false
            },
            foo: {
                src: [
                    'src/js/config/**/*.js',
                    'src/js/common/**/*.js',
                    'src/js/business/**/*.js',
                    'src/js/concatMapping.js',
                    './Gruntfile.js'
                ]
            }
        },

        // 转换cmd模块
        transport : {
            options: {
                paths: ['src'],
                alias: aliasInfo,

                parsers: {
                    '.js': [script.jsParser],
                    '.css': [style.css2jsParser]
                },

                // 是否生产-debug文件
                debug: true
            },
            // 公共模块
            common : {
                options: {
                    idleading: 'common/'
                },
                files : [
                    {
                        expand: true,
                        cwd: 'src/js/common',
                        src : ['**/*.js', '**/*.css'],
                        dest : 'src/js/_build/common/'
                    }
                ]
            },
            // 页面及模块
            business : {
                options: {
                    idleading: 'business/'
                },
                files : [
                    {
                        expand: true,
                        cwd: 'src/js/business',
                        src : ['**/*.js', '**/*.css'],
                        dest : 'src/js/_build/business/'
                    }
                ]
            }
        },

        // 合并文件
        concat: {
            options: {
                separator: '\n;'
            },
            dist: {
                files: [
                    // 合并是的文件对应关系,读取concatMapping模块
                    require('./src/js/concatMapping.js')
                ]
            }
        },

        // 压缩文件
        uglify: {
            options: {
                //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            // 压缩配置文件
            tools: {
                files: {
                  'js/widget/tools.min.js': ['widget/seajs/2.1.1/sea.js','src/js/config/seaConfig.js', 'widget/jquery/1.7.1/jquery.js']
                }
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: 'js/common/',
                        src: '**/*.js',
                        dest: 'js/common/',
                        filter: filterDebugJS
                    }
                ]
            },
            business: {
                files: [
                    {
                        expand: true,
                        cwd: 'js/business/',
                        src: '**/*.js',
                        dest: 'js/business/',
                        filter: filterDebugJS
                    }
                ]
            },
            pageCommon: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/pageCommon/',
                        src: '**/*.js',
                        dest: 'js/pageCommon/',
                        filter: filterDebugJS
                    }
                ]
            }
        },
        cssmin: { 
            compress: {
                options : { 
                    compatibility : 'ie8', //设置兼容模式 
                    advanced : false //取消高级特性 
                },    
                files: [
                    {
                        'css/common/common.min.css': ["src/css/common/reset.css","src/css/common/header.css","src/css/common/footer.css"]
                    },
                    {
                        expand: true, 
                        cwd: 'src/css/',
                        src: '**/*.css', 
                        dest: 'css/',
                        ext: '.css'
                    }
                ]
            }             
        },        
        //压缩图片
        imagemin: {
          prod: {
            options: {
              optimizationLevel: 7,
              pngquant: true
            },
            files: [
              {expand: true, cwd: 'src/images/', src: ['**/*.{png,jpg,jpeg,gif,webp,svg}'], dest: 'images/'}
            ]
          }
        },
        // 清理临时文件
        clean: {
            foo: {
                src: [
                    'src/js/_build',
                ]
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    /*
     * 插件执行顺序:
     * 1、使用jshint插件对js进行验证
     * 2、使用transport插件对所有cmd模块（seajs模块是cmd的一个子集）提取id等操作
     *    将处理好的模块转移到src/js/build目录中
     * 3、使用concat插件按规则对上一步处理src/js/build/下的模块进行合并，将合并后的文件转移到js/目录中；
     *    合并规则详细见concat的配置和src/js/concatMapping.js中
     * 4、使用uglify插件对上一步中合并好的在js/下的js进行压缩处理
     * 5、使用watch插件对文件进行监视，如果文件变得，则按顺序执行以上4步的任务
     */
    grunt.registerTask('default', [/*'less',  'jshint',*/ 'transport', 'concat', 'uglify', 'cssmin','imagemin', 'clean' /*, 'watch'*/]);
};
