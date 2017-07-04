# jQuery-Apple-Slider
一个仿苹果轮播图效果的jQuery插件

该轮播图效果为切换轮播图时会产生视差效果，以及文字的一个缩放效果。

ps:由于本插件使用了大量CSS3属性，对于低版本浏览器（如ie9以下版本等不支持CSS3属性的浏览器）不兼容。

**demo**：[线上地址](https://yangyunhe369.github.io/jQuery-Apple-Slider/)

## 下载源码

```
git clone https://github.com/yangyunhe369/jQuery-Apple-Slider.git
```

## 使用方法

``` javascript
调用轮播插件：
Html：
<div class="slide_wrapper">
	<div class="gallery_slide_wrapper">
		<a class="gallery_item" href="javascript:;">
			<div class="gallery_item_content">
				<div class="gallery_item_lockup_wrapper">
					<span>...</span>
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
	imgNum:3,  //轮播图数量至少为3张
	autoplay:true  //是否为自动轮播
});
```

## 说明

如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

或者您可以 "follow" 一下，我会不断开源更多的有趣的项目

## 个人简介
作者：弦云孤赫(David Yang)

职业：web前端开发工程师

爱好：网游、音乐（吉他）

## 联系方式
QQ：314786482

微信：yangyunhe_yyh

坐标：四川成都

