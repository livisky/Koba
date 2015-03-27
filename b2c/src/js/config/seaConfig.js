(function() {

	var locationHref = location.href;
	
	var staticPath = staticsBase+'/b2c/';
	
	var jsSrc = staticPath + 'js/';
	
	var debug = false;
    
    var plugins = ['style'];
	
	if(locationHref.indexOf('&debug=true') > -1 || locationHref.indexOf('?debug=true') > -1) {
		debug = true;
	}
	
	if(debug) {
		jsSrc = staticPath + 'src/js/';
		
		plugins.push('nocache');
	}

	seajs.config({
		paths: {
			'business' : jsSrc + 'business/',
			'common' : jsSrc + 'common/',
			'pageCommon':jsSrc+'pageCommon'
		},
		map: [
            ['.js', '.js?']
        ],
		alias: {
			'jQuery' : staticPath + 'widget/jquery/1.7.1/jquery.js',
            'jQuery-debug' : staticPath + 'widget/jquery/1.7.1/jquery.js',
			'$' : staticPath + 'widget/jquery/1.7.1/jquery.js',
			'$-debug' : staticPath + 'widget/jquery/1.7.1/jquery.js'
		},
		plugins: plugins
	});
})();