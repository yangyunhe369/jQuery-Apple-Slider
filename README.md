# jQuery-Apple-Slider
一个仿苹果轮播图效果的jQuery插件

该轮播图效果为切换轮播图时会产生视差效果，以及文字的一个缩放效果。

ps:由于本插件使用了大量CSS3属性，对于低版本浏览器（如ie9以下版本等不支持CSS3属性的浏览器）不兼容。

## 使用方法

``` javascript
调用轮播插件：
Html：
<div class="slide_wrapper">
	<div class="gallery_slide_wrapper">
		<a class="gallery_item" href="javascript:;">
			<div class="gallery_item_content">
				<div class="gallery_item_lockup_wrapper">
					<span>iPhone 7</span>
				</div>
			</div>
			<div class="gallery_image"></div>
		</a>
		...
	</div>
</div>	
Javascript：
$(".slide_wrapper").AppleSlider({
	imgItem:'.gallery_item',  //轮播图容器Class
	imgNum:3,  //轮播图数量
	autoplay:true  //是否为自动轮播
});
```

## 个人简介
作者：弦云孤赫(David Yang)

地址：四川成都

职业：web前端开发工程师

爱好：网游、音乐（吉他）

## 联系方式
QQ：314786482

微信：yangyunhe_yyh

