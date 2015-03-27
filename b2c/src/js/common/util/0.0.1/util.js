var hk={};

    //取得cookie
	hk.getCookie=function(name) 
	{ 
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg))
		        return unescape(arr[2]); 
		    else 
		        return null; 
	}

	//跨域js
	hk.loadScript=function(url, callback) {
         var script = document.createElement('script')
         script.type = 'text/javascript';
     
         if (script.readyState) { //for ie
             script.onreadystatechange = function() {
                 if (script.readyState == 'loaded' || script.readyState == 'complete') {
                     script.onreadystatechange = null;
                     callback();
                 }
             };
         } else { //other browser
             script.onload = function() {                  
              callback();
             };
         }
         script.src = url;
         document.getElementsByTagName('head')[0].appendChild(script);
    }

    //几秒后自动跳转timeFn(3);
	hk.timeFn =function(t,link){
		 window.setTimeout(function(){
			 t--;
			 if(t>-1){
				$("#timer").html(t);
				timeFn(t);
			 }else{
				window.location.href=link;
			 }               	
		 },1000);
		 window.clearTimeout();
    };
