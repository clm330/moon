var me = {
	//检测函数参数对象
	detect_object : function(obj,fun_obj){
		for (var key in fun_obj){
			if(Object.prototype.toString.call(fun_obj[key]) === '[object Object]'){
				if(me.detect_object(obj[key],fun_obj[key]) === false){
					console.log('detect_object false');
					return false;
				}
			}
			if( obj.hasOwnProperty(key) === false || (Object.prototype.toString.call(fun_obj[key])!== Object.prototype.toString.call(obj[key])) )
			{
				console.log('detect_object false');
				return false;
			}
		}
		return true;
	},



	//获取鼠标点取canvas的RGB
	getRGB : function(cv_obj){
		var canvas_obj = { 
			canvas_id:'a',
			x:1,
			y:1,
		};
		if(me.detect_object(cv_obj,canvas_obj)){
			var canvas = document.getElementById(cv_obj.canvas_id);
			var ctx = canvas.getContext('2d');
			var imageData = ctx.getImageData(cv_obj.x,cv_obj.y,1,1);
			return imageData;
		}
	}
};


