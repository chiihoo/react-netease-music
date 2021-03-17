# moonlite-music 移动端音乐播放站点

<p>
  <img src="https://img.shields.io/badge/react-16.13.0-brightgreen" alt="react">
  <img src="https://img.shields.io/static/v1?label=react-router-dom&message=5.2.0&color=green" alt="react-router-dom">
  <img src="https://img.shields.io/badge/mobx-5.15.7-yellowgreen" alt="mobx">
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="license">
</p>


## 项目线上地址	http://121.196.155.101:3000

**请使用移动端浏览器预览，如果使用PC端，请切换到Chrome的移动端调试模式**

* 本项目的音频可视化效果用到了 `AudioContext`接口的 `createMediaElementSource`方法，该方法在iOS上存在[**BUG**](https://stackoverflow.com/questions/58306894/has-ios13-broken-audio-tags-used-as-audio-buffers-connected-to-the-audio-conte)，会导致歌曲无法播放，因此针对iOS系统，去除了音频可视化效果，**建议在Android系统上进行预览**

* 云村热评墙接口被官方下线了，所以首页云村那儿目前是空白的



## 项目说明

前端使用React进行开发（全面拥抱Hooks），状态管理库使用Mobx，并用vw布局进行移动端适配

后端使用开源项目[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)进行搭建

本项目UI参考网易云音乐Android App 7.x版本，除Swiper外，未使用第三方UI组件



主要动画效果均为手动实现，包括但不局限于：

* 下拉刷新
* 上拉加载
* 滑动输入条Slider
* 类似marquee的横向无缝循环滚动展示组件Ticker
* 抽屉Drawer
* 全局提示Toast
* 对话框Dialog
* 验证码输入框
* ......



部分动画效果参考了：

* kurodaakira-jp/cloud-music-master (使用Vue的一个高仿网易云音乐项目，原作者貌似改名了，未找到项目地址)

* [ant-design](https://github.com/ant-design/ant-design)

* [react-ticker](https://github.com/AndreasFaust/react-ticker)

* [react-components](https://github.com/clancysong/react-components)

* [cursor-vcode](https://github.com/useryangtao/cursor-vcode)

* [Web Audio在音频可视化中的应用](https://juejin.cn/post/6844903953130323976)



本项目的音频可视化只是将连续的音频点进行平滑连接，但在起始和末尾相连的地方不够平整，更好的方法是用傅里叶变换进行采样，再进行平滑处理，具体可见网易云音乐大前端团队的文章——[Android 音频可视化](https://juejin.cn/post/6873253309944168456)



## 值得注意的动画效果与交互

1. **横向无缝循环滚动展示组件**

   在mini播放器上与歌单详情页的顶部都有用到，主要的效果是：当文本长度大于盒子长度时，就会触发左侧横向无缝滚动效果，当文本抵达左侧边界时，会有停顿时间（可以设置），之后接着滚动。动画效果用`requestAnimationFrame`写的一个`Hook`实现的，组件用的时候也可以设置水平滚动方向、滚动速度以及两组文本间的间缝大小

2. **播放页进度条、歌词的互动**

   这里的效果较好地还原了网易云音乐安卓端的操作。首先可以上下滑动歌词，并且有一个指示条可以提示当前选中的歌词，点击可直接切换进度，而拖拽进度条也会实时显示进度，松手可切换进度，这个是通过封装的滑动输入条组件，提供了触摸时和触摸结束的钩子函数，返回滑块的进度

3. **mini播放器会实时显示歌词，并且可以左右滑动切换歌曲**



## 功能预览



![1](./gif/1.gif)

![2](./gif/2.gif)

![3](./gif/3.gif)

![4](./gif/4.gif)

![5](./gif/5.gif)

![6](./gif/6.gif)

