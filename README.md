# Koba
fontend template for pc 
(grunt+seajs+jquery)

静态资源架构及配置，样式压缩，图片压缩，js合并压缩


使用package包管理，先下载依赖模块。进入package.json所在目录，命令行输入:npm install

（一）图片压缩
1、在newMall\statics\b2c\Gruntfile.js 文件中找到imagemin的配置中files的配置，在files对象里添加要压缩的文件和压缩后的路径及文件名，例如：
imagemin: {
prod: {
            options: {
                 optimizationLevel: 7,
                 pngquant: true
            },
           files: [
                {expand: true, cwd: 'src/images/', src: ['test/*.{png,jpg,JPG,jpeg,gif,webp,svg}'], dest: 'images/'}
           ]
}
},


（二）js合并压缩

1、在newMall\statics\b2c\Gruntfile.js 文件中找到uglify的配置中tools的配置，在files对象里添加要压缩的文件和压缩后的路径及文件名，例如：
tools: {
       files: {
                'js/widget/tools.min.js': ['widget/seajs/2.1.1/sea.js','src/js/config/seaConfig.js', 'widget/jquery/1.7.1/jquery.js']
        }
},
tools.min.js为压缩后的文件名，数组内的文件为欲合并压缩的js文件

（三）css压缩
2、在newMall\statics\b2c\Gruntfile.js 文件中找到cssmin的配置中compress的配置，在files对象里添加要压缩的文件和压缩后的路径及文件名，例如：
cssmin: {
    compress: {
        files: {
           'css/common.min.css': ["src/css/common/reset.css","src/css/common/header.css","src/css/common/footer.css"]
       }
    }
},
common.min.css为压缩后的文件名，数组内的文件为欲合并压缩的样式文件
 
