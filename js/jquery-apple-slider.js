/* by：弦云孤赫——David Yang
***仿苹果轮播图插件
***插件支持图片数量为至少为三张的情况，且可以无限轮播
*/
+function($) {
	$.fn.AppleSlider = function(options) {
        var _options = $.extend({
            imgItem : '.gallery_item',  //轮播列表框
            autoplay : true, //是否处于自动轮播状态
            imgNum : 3, //轮播图数量
            autoTime : 5000 //自动轮播时间
        }, options);
        var win_w = $(window).width(), //轮播容器宽度值
			$this = $(this), //当前对象
        	_imgNum = _options.imgNum, //轮播图数量
			_imgItem = _options.imgItem, //轮播容器class名称
        	_index = 0, //当前轮播图绝对序号
			slide_state = 0, //轮播状态值(为1时不能执行滚动动画)
			sildeTimer = null, //自动轮播定时器
			stateTimer = null, //状态值改变定时器
			listDom = $this.find(_imgItem); //轮播图容器dom集合

		//给所有轮播图添加对应idx值
		for(var i = 0;i < listDom.length;i++){
			listDom.eq(i).attr('data-idx',i);
		}

        //初始化轮播图定位
		for(var i = 0;i < _imgNum;i++){
			$this.find(_imgItem + '[data-idx='+ i +']').css({'transform':'translate3d('+ win_w * i +'px,0,0)','transition':'all 0s ease-in-out'});
			if(i == _imgNum - 1){
				$this.find(_imgItem + '[data-idx='+ i +']').css({'transform':'translate3d(-'+ win_w +'px,0,0)','transition':'all 0s ease-in-out'});
			}
		}

        //初始化轮播导航按钮
        var li_html = '', //导航按钮单个按钮html
            ul_html = '', //导航按钮容器html
        	btn_html = ''; //左右翻页按钮html

        for(var i = 0;i < _imgNum;i++){
	        if(_options.autoplay && i == 0){ //当自动轮播时
	        	li_html = '<li data-target="'+i+'" class="nav_slide nav_slide_'+i+' active autoplay"><div class="slide_btn"></div></li>';
	        }else if(i == 0){
	        	li_html = '<li data-target="'+i+'" class="nav_slide nav_slide_'+i+' active"><div class="slide_btn"></div></li>';
	        }else{
	        	li_html += '<li data-target="'+i+'" class="nav_slide nav_slide_'+i+'"><div class="slide_btn"></div></li>';
	        }
        }

        ul_html = '<ul class="nav">' + li_html +'</ul>';
        $this.append(ul_html);
        //判断浏览设备
        if(win_w <= 640){ //当为移动设备时
			//监听触屏滑动事件
			$this.swipe({
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
					cleanAutoMove();
					if(direction == "left"){ //向左滑动时
						if(slide_state == 0){
							moveTo("right",1);
						}
					}else if(direction == "right"){ //向右滑动时
						if(slide_state == 0){
							moveTo("left",1);
						}
					} 
				}
			});
        }else{ //当为PC端时
        	btn_html = '<div class="nav_btn left"><div class="btn_left"></div></div><div class="nav_btn right"><div class="btn_right"></div></div>';
			$this.append(btn_html);
        	//向右滚动按钮事件
			$this.find('.nav_btn.right').on('click',function(){
				cleanAutoMove();
				if(slide_state == 0){
					moveTo("right",1);
				}
			})
			//向左滚动按钮事件
			$this.find('.nav_btn.left').on('click',function(){
				cleanAutoMove();
				if(slide_state == 0){
					moveTo("left",1);
				}
			})
			
        }
		//点击导航按钮事件
		$this.find('.nav li').click(function(){
			cleanAutoMove();
			if(slide_state == 1){
				return;
			}
			var idx = _index % _imgNum, //当前轮播图的序号
				li_idx = $(this).index(); //点击的按钮序号
			//当_index值为负数时转为正数的idx值
			for(var i = 0;i < _imgNum;i++){
				if(idx < 0){
					idx = _imgNum + idx;
				}else if(idx == 0){
					idx = 0;
				}
			}
			//给当前按钮添加class
			$(this).addClass('active').siblings().removeClass('active');
			//判断当前轮播图移动方向，以及移动次数
			if(li_idx > idx){  //向右移动
				moveTo("right",li_idx - idx);
			}else if(li_idx < idx){ //向左移动
				moveTo("left",idx - li_idx);
			}else if(li_idx == idx){
				return;
			}
			//清除定时器
			clearTimeout(stateTimer);
			stateTimer = setTimeout(function(){
				slide_state = 0;
			},700);
		})
		//移动事件
		function moveTo(direction,moveTimes){
			//改变轮播状态，避免移动过程中连续执行动画
			slide_state = 1;
			//根据传入参数，设置当前轮播图序号值
			if(direction == "left"){ //向左滚动
				_index -= moveTimes;
			}else if(direction == "right"){ //向右滚动
				_index += moveTimes;
			}

			//初始化变量
			var i = _index , //轮播图的绝对序号
				idx = _index % _imgNum, //轮播图的相对序号
				warp_w = - win_w * i,  //最外层容器移动距离
				st_arr = [], //轮播图系数数组
				idxW_arr = []; //轮播图移动距离数组	
			
			//设置轮播图系数，轮播图移动距离
			for(var k = 0;k < _imgNum;k++){
				if(k == 0){ //第一张轮博图
					st_arr[k] = Math.floor((i + 1) / _imgNum); //轮播图系数
					idxW_arr[k] = win_w * _imgNum * st_arr[k]; //轮播图移动距离
				}else if(k == _imgNum - 1){ //最后一张轮播图
					st_arr[k] = Math.floor((i - 1) / _imgNum) + 1; //轮播图系数
					idxW_arr[k] = - win_w + st_arr[k] * _imgNum * win_w; //轮播图移动距离
				}else{
					st_arr[k] = Math.floor(i / _imgNum); //轮播图系数
					idxW_arr[k] = win_w * k + st_arr[k] * _imgNum * win_w; //轮播图移动距离
				}
			}
			//当_index值为负数时转为正数的idx值
			for(var j = 0;j < _imgNum;j++){
				if(idx < 0){
					idx = _imgNum + idx;
				}else if(idx == 0){
					idx = 0;
				}
			}
			//控制轮播图移动事件
			$this.find('.gallery_slide_wrapper').css({'transform':'translate3d('+ warp_w +'px,0,0)','transition':'all .7s ease-in-out'});
			for(var k = 0;k < _imgNum;k++){
				$this.find(_imgItem+'[data-idx="'+k+'"]').css({'transform':'translate3d('+ idxW_arr[k] +'px,0,0)','transition':'all .7s ease-in-out'});
			}
			//控制图层在未显示时无延时移动
			if(idx == 0 && direction == "right" && moveTimes == 1 || 
			   idx == _imgNum - 1 && direction == "left" && moveTimes == 1){ //_imgNum - 1 <=> 0 
				for(var k = 0;k < _imgNum;k++){
					if(k != 0 && k != _imgNum - 1){
						$this.find(_imgItem+'[data-idx="'+ k +'"]').css({'transition':'all 0s ease-in-out'});
					}
				}
			}else if(idx == 0 && direction == "left" && moveTimes == 1 ||
			   idx == 1 && direction == "right" && moveTimes == 1){ //0 <=> 1 
				$this.find(_imgItem+'[data-idx="'+ (_imgNum - 1) +'"]').css({'transition':'all 0s ease-in-out'});
			}else if(idx == _imgNum - 2 && direction == "left" && moveTimes == 1 ||
			   idx == _imgNum - 1 && direction == "right" && moveTimes == 1){ //_imgNum - 2 <=> _imgNum - 1 
				$this.find(_imgItem+'[data-idx="0"]').css({'transition':'all 0s ease-in-out .7s'}).addClass('zIndex').siblings().removeClass('zIndex');
			}else if(idx == 0 && direction == "left" && moveTimes > 1 && moveTimes < _imgNum - 1 ||
			   idx != 0 && idx != _imgNum - 1 && direction == "right" && moveTimes > 1 && moveTimes < _imgNum - 1){ //0 <=> _imgNum - n 
				$this.find(_imgItem+'[data-idx="'+ (_imgNum - 1) +'"]').css({'transition':'all 0s ease-in-out .7s'}).addClass('zIndex').siblings().removeClass('zIndex');			
			}else if(idx == _imgNum - 1 && direction == "right" && moveTimes > 1 && moveTimes < _imgNum - 1 ||
			   idx != 0 && idx != _imgNum - 1 && direction == "left" && moveTimes > 1 && moveTimes < _imgNum - 1){ //_imgNum - n <=> 4 				
				$this.find(_imgItem+'[data-idx="0"]').css({'transition':'all 0s ease-in-out .7s'}).addClass('zIndex').siblings().removeClass('zIndex');			
			}else if(idx == _imgNum - 1 && direction == "right" && moveTimes == _imgNum - 1){ //_imgNum - 1 <=> 0 				
				$this.find(_imgItem+'[data-idx="'+ (_imgNum - 1) +'"]').css({'transition':'all 0s ease-in-out'});
				$this.find(_imgItem+'[data-idx="0"]').css({'transition':'all 0s ease-in-out .7s'}).addClass('zIndex').siblings().removeClass('zIndex');			
			}else if(idx == 0 && direction == "left" && moveTimes == _imgNum - 1){ //0 <=> _imgNum - 1 				
				$this.find(_imgItem+'[data-idx="0"]').css({'transition':'all 0s ease-in-out'});
				$this.find(_imgItem+'[data-idx="'+ (_imgNum - 1) +'"]').css({'transition':'all 0s ease-in-out .7s'}).addClass('zIndex').siblings().removeClass('zIndex');
			}			
			//控制背景文字移动、控制背景图片移动
			$this.find(_imgItem+'[data-idx="'+ idx +'"]').find('.gallery_item_content').css({transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all .7s ease-in-out'});
			$this.find(_imgItem+'[data-idx="'+ idx +'"]').find('.gallery_image').css({transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all .7s ease-in-out'});
			if(idx == _imgNum - 1){
				for(var k = 0;k < _imgNum;k++){
					if(k > 1){
						$this.find(_imgItem+'[data-idx="'+ (idx - k) +'"]').find('.gallery_item_content').css({transform: 'translate3d('+ win_w * .2 +'px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all .7s ease-in-out'});
						$this.find(_imgItem+'[data-idx="'+ (idx - k) +'"]').find('.gallery_image').css({transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all .7s ease-in-out'});
					}
				}
			}else{
				for(var k = 0;k < _imgNum;k++){
					if(k < _imgNum - 1 && k > 0){
						$this.find(_imgItem+'[data-idx="'+ (idx + k) +'"]').find('.gallery_item_content').css({transform: 'translate3d('+ win_w * .2 +'px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all .7s ease-in-out'});
						$this.find(_imgItem+'[data-idx="'+ (idx + k) +'"]').find('.gallery_image').css({transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all .7s ease-in-out'});
					}
				}			
			}
			if(idx > 0){
				$this.find(_imgItem+'[data-idx="'+ (idx - 1) +'"]').find('.gallery_item_content').css({transform: 'translate3d('+ win_w * .95 +'px, 0px, 0px) scale3d(.9, .9, 1)',transition: 'all .7s ease-in-out'});
				$this.find(_imgItem+'[data-idx="'+ (idx - 1) +'"]').find('.gallery_image').css({transform: 'translate3d('+ win_w * .9 +'px, 0px, 0px) scale3d(.9, .9, 1)',transition: 'all .7s ease-in-out'});			
			}else{
				$this.find(_imgItem+'[data-idx="'+ (idx + _imgNum - 1) +'"]').find('.gallery_item_content').css({transform: 'translate3d('+ win_w * .95 +'px, 0px, 0px) scale3d(.9, .9, 1)',transition: 'all .7s ease-in-out'});
				$this.find(_imgItem+'[data-idx="'+ (idx + _imgNum - 1) +'"]').find('.gallery_image').css({transform: 'translate3d('+ win_w * .9 +'px, 0px, 0px) scale3d(.9, .9, 1)',transition: 'all .7s ease-in-out'});			
			}
			//连续滚动时背景图片文字移动逻辑
			if(direction == "right" && moveTimes > 1 && moveTimes < _imgNum - 1 || 
			   direction == "left" && moveTimes > 1 && moveTimes < _imgNum - 1){
				$this.find(_imgItem).find('.gallery_item_content').css({transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all 0s ease-in-out'});
				$this.find(_imgItem).find('.gallery_image').css({transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',transition: 'all 0s ease-in-out'});
				if(idx > 0){
					$this.find(_imgItem+'[data-idx="'+ (idx - 1) +'"]').find('.gallery_item_content').css({transform: 'translate3d('+ win_w * .95 +'px, 0px, 0px) scale3d(.9, .9, 1)',transition: 'all 0s ease-in-out .7s'});
				}else{
					$this.find(_imgItem+'[data-idx="'+ (idx + _imgNum - 1) +'"]').find('.gallery_image').css({transform: 'translate3d('+ win_w * .9 +'px, 0px, 0px) scale3d(.9, .9, 1)',transition: 'all 0s ease-in-out .7s'});
				}
			}
			//控制导航按钮移动
			$this.find('.nav li').eq(idx).addClass('active').siblings().removeClass('active');
			//当自动轮播时导航按钮动画效果
			if(_options.autoplay){
				$this.find('.nav li').eq(idx).addClass('autoplay').siblings().removeClass('autoplay');
			}
			//控制滚动状态
			clearTimeout(stateTimer);
			stateTimer = setTimeout(function(){
				slide_state = 0;
			},700);
		}
		function autoMove(){ //自动轮播事件
			_options.autoplay = true;
			sildeTimer = setInterval(function(){
				moveTo("right",1);
			},_options.autoTime);
		}
		function cleanAutoMove(){ //停止自动轮播事件
			_options.autoplay = false;
			$this.find('.nav li').removeClass('autoplay');
			clearInterval(sildeTimer);
		}
		if(_options.autoplay){ //当为自动轮播时
			autoMove();
		}
    };
}(jQuery)