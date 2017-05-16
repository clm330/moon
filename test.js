$(document).ready(function(){


    const CANVAS_BG = "canvas_bg";
    const SATELLITE = "satellite";
    const DIV_BUTTON = 'div_button';
    const CANVAS_BUTTON_TOP = 'canvas_button_top';
    const DIV_BUTTON_TOP = 'div_button_top';
    const DIV_BG = 'div_bg';

	var create_div = function(sid,appid,width,height,left,top){
    	var tmp = document.createElement('div');
    	tmp.id = appid;
    	tmp.style.width = width +'px';
    	tmp.style.height = height +'px';
    	tmp.style.top = top +'px';
    	tmp.style.left = left +'px';
    	tmp.style.position = 'absolute';
		if($(`#${sid}`).length === 1)
    		document.getElementById(sid).appendChild(tmp);
		else
			console.log('源元素不存在');
	}



	var angle = 0,
		radius = 300,
		speed =0.001;

	var rotation = function(){
		var rotation_div = document.getElementById(DIV_BUTTON_TOP);
		var bg_canvas = document.getElementById(CANVAS_BG);
		var	centerX = bg_canvas.clientWidth/2;
		var	centerY = bg_canvas.clientHeight/2;
		rotation_div.style.top = centerY + Math.sin(angle)*radius + 'px';
		rotation_div.style.left = centerX + Math.cos(angle)*radius + 'px';
		angle += speed;
	};



	function mou_click(tag,className){
		var click_tag = document.getElementById(tag);
		click_tag.classList.add(className);
		click_tag.addEventListener("oanimationend animationend webkitAnimationEnd",function(e){
			click_tag.classList.remove(className);
		},false);
	}


	//mou_click(CANVAS_BG,'flash');

	//document.getElementById(DIV_BUTTON).classList.add('flash');



    $(`#${DIV_BUTTON}`).click(function(e){
    	var canvas_id = CANVAS_BUTTON_TOP;
    	if($(`#${canvas_id}`).length === 1) return false;
    	create_div(DIV_BG,DIV_BUTTON_TOP,80,80,100,100);
    	create_canvas(DIV_BUTTON_TOP,canvas_id,80,80,0,0);

    	//draw circle
    	var stage = new createjs.Stage(canvas_id);
    	var arc = new createjs.Shape();
    	var arc2 = new createjs.Shape();
    	var circle = new createjs.Shape();
    	arc.graphics.beginFill('#0099CC').drawCircle(40,40,35);
    	arc.graphics.setStrokeStyle(5).beginStroke("#FFFFCC").arc(40,40,35,0,Math.PI*2*0.618,0);
    	arc2.graphics.setStrokeStyle(5).beginStroke("#003366").arc(40,40,35,0,Math.PI*2*0.618,1);
    	stage.addChild(arc);
    	stage.addChild(arc2);
    	stage.update();

    	mou_click(DIV_BUTTON,'flash');

    	//window.requestAnimationFrame(rotation);
    	
    	//公转

    	(function animloop(){
    		rotation();
    		requestAnimationFrame(animloop);
    	})();

	    $(`#${CANVAS_BUTTON_TOP}`).click(function(e){
			var getRGB_obj = {
				canvas_id:CANVAS_BUTTON_TOP,
				x:e.offsetX,
				y:e.offsetY,
			};
			var a = me.getRGB(getRGB_obj);
			if( a.data[0] === 0 && a.data[1] === 0 && a.data[2] === 0 && a.data[3] === 0 ){
				console.log('click on op.');
			}
			else{
				var a = document.getElementById(CANVAS_BUTTON_TOP);
			// 	console.log($(`#${CANVAS_BUTTON_TOP}`).css('animation'));
			// 	a.className += ' fast';
			// 	$(`#${CANVAS_BUTTON_TOP}`).bind('oanimationend animationend webkitAnimationEnd',function(){
			// 		a.className = SATELLITE;
			// 		console.log('fin');
			// });
			}
		});

    });


	var create_canvas = function(sid,appid,width,height,left,top){
		var canvas = document.createElement("canvas");
		canvas.id = appid;
		canvas.width = width;
		canvas.height = height;
		canvas.className = SATELLITE;
		canvas.style.top = top +"px";
		canvas.style.left = left +"px";
		if($(`#${sid}`).length === 1)
			document.getElementById(sid).appendChild(canvas);
		else
			console.log('源元素不存在');
	}


	$(`#${DIV_BUTTON}`).css('top',(($(`#${CANVAS_BG}`).width())/2));
});