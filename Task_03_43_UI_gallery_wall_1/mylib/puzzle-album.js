;(function(_window){
  'use strict';

  function PuzzleAlbum(id){
    var m_AutoIncrement = 0;
    // 布局的枚举类型，纠结要不要做成全局的
    var LAYOUT = {
        PUZZLE: 1,    // 拼图布局
        WATERFALL: 2, // 瀑布布局 未实现
        BARREL: 3     // 木桶布局 未实现
    };
    var FULL_SCREEN = {
      NONE: 1,  //不全屏显示
      PAGE: 2,  //占据浏览器内整个页面
      WINDOW: 3 //整个窗口全屏显示
    };
    //---- 私有变量 ----//
    //-- 渲染用的容器 --//
    var m_Container = createContainer(id);
    //-- 相册中的所有图片 --//
    var m_Images = [];
    //-- 布局标识 --//
    var m_Layout = LAYOUT.PUZZLE;  //默认拼图布局
    //-- 图片间距 --//
    var m_Gutter = [0,0];
    //-- 图片全部加载后的回调函数 --//
    var m_ImageLoadCallBack = null; //在setImage的配置项中取得。。。

    //---- 你想增加的其他接口 ----//
    /**
     * 按拼图相册的方式更新相册
     * 正在纠结要不要在javascript里修改CSS样式
     */
    function _puzzleUpdate(){
      m_Container.clearChildren();
      m_Container.clearClass();
      m_Container.addClass("puzzle").addClass("clearfix");
      //可以在此调整CSS样式，不知以后要不要改，先这样写吧。。。
      switch(m_Images.length){
        case 0: 
          return;
          break;
        case 1:
          m_Container.addClass("puzzle-1");
          var imgDiv = m_Container.appendImage(m_Images[0])[0];

          break;
        case 2:
          m_Container.addClass("puzzle-2");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          break;
        case 3:
          m_Container.addClass("puzzle-3");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[2])[0];
          break;
        case 4:
          m_Container.addClass("puzzle-4");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[2])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[3])[0];
          break;
        case 5:
          m_Container.addClass("puzzle-5");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv3 = m_Container.appendImage(m_Images[2])[0];
          var imgDiv4 = m_Container.appendImage(m_Images[3])[0];
          var imgDiv5 = m_Container.appendImage(m_Images[4])[0];
          break;
        case 6:
          m_Container.addClass("puzzle-6");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv3 = m_Container.appendImage(m_Images[2])[0];
          var imgDiv4 = m_Container.appendImage(m_Images[3])[0];
          var imgDiv5 = m_Container.appendImage(m_Images[4])[0];
          var imgDiv6 = m_Container.appendImage(m_Images[5])[0];
          break;
        case 7:
          m_Container.addClass("puzzle-7");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv3 = m_Container.appendImage(m_Images[2])[0];
          var imgDiv4 = m_Container.appendImage(m_Images[3])[0];
          var imgDiv5 = m_Container.appendImage(m_Images[4])[0];
          var imgDiv6 = m_Container.appendImage(m_Images[5])[0];
          var imgDiv7 = m_Container.appendImage(m_Images[6])[0];
          break;
        case 8:
          m_Container.addClass("puzzle-8");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv3 = m_Container.appendImage(m_Images[2])[0];
          var imgDiv4 = m_Container.appendImage(m_Images[3])[0];
          var imgDiv5 = m_Container.appendImage(m_Images[4])[0];
          var imgDiv6 = m_Container.appendImage(m_Images[5])[0];
          var imgDiv7 = m_Container.appendImage(m_Images[6])[0];
          var imgDiv8 = m_Container.appendImage(m_Images[7])[0];
          break;
        case 9:
          m_Container.addClass("puzzle-9");
          var imgDiv1 = m_Container.appendImage(m_Images[0])[0];
          var imgDiv2 = m_Container.appendImage(m_Images[1])[0];
          var imgDiv3 = m_Container.appendImage(m_Images[2])[0];
          var imgDiv4 = m_Container.appendImage(m_Images[3])[0];
          var imgDiv5 = m_Container.appendImage(m_Images[4])[0];
          var imgDiv6 = m_Container.appendImage(m_Images[5])[0];
          var imgDiv7 = m_Container.appendImage(m_Images[6])[0];
          var imgDiv8 = m_Container.appendImage(m_Images[7])[0];
          var imgDiv9 = m_Container.appendImage(m_Images[8])[0];
          break;
        default:
          m_Container.addClass("puzzle-n");
          for(var i =0;i<m_Images.length;i++){
            m_Container.appendImage(m_Images[i]);
          }
          break;
      }

    }


    //---- 本库提供的方法 ----//
    /**
     * 初始化相册，并设置图片
     * 当相册原本包含图片时，该方法会替换原有图片
     * @param {(string|string[])} image 一张图片的URL或多张图片URL数组
     * @param {{
          layout?: LAYOUT,
          callBack?: function,
        }}            [option] 配置项
     */
    this.setImage = function (images, option) {
      if (typeof images === 'string') {
          // 包装成数组处理
          this.setImage([images]); // 注意this实际指向
          return;
      }
      m_Container.clearChildren();
      m_ImageLoadCallBack = option.callBack ? option.callBack : null;
      _addImage(images); 
    };
    /**
     * 向相册添加图片，图片加载总是异步的，处理起来比较麻烦
     * 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
     * @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     * @param {(Function)} [onLoadCallback] 每张图片加载结果的回调函数: function(ture|false)
     * @return {Image[]} 返回添加的图片
     */
    function _addImage(images, onLoadCallback){ //影子函数 没有上下文
      var res = [];

      var imageToLoadNum = images.length;
      for(var i=0;i<images.length;i++){
        var img = new Image();
        img.dataset.info = i;
        img.onload = function(e){ //加载成功回调
          //console.log(this);
          this.dataset.info = m_AutoIncrement++;
          console.log("图片["+ this.dataset.info +"]加载成功.");
          m_Images.push(this);
          if(onLoadCallback instanceof Function) {
            onLoadCallback.call( true);
          }
          if(--imageToLoadNum == 0){
            if(m_ImageLoadCallBack instanceof Function) {
              m_ImageLoadCallBack.call();
            }
            console.log("图片全部加载完毕.");
            _puzzleUpdate();
          }
          //_puzzleUpdate();
        }
        img.onerror = function(e){
          console.log("图片["+this.dataset.info+"]加载失败.");
          if(onLoadCallback instanceof Function) {
            onLoadCallback.call(_this, false);
          }
          if(--imageToLoadNum == 0){
            if(m_ImageLoadCallBack instanceof Function) {
              m_ImageLoadCallBack.call(_this);
            }
            console.log("图片全部加载完毕.");
            _puzzleUpdate();
          }
        }
        img.src = images[i];
        res.push(img);
      }
      return res; //返回也没啥用
    }
    this.addImage = function (images, onLoadCallback) {
      if(! (images instanceof Array)) {
        return _addImage([images],onLoadCallback);
      }else{
        return _addImage(images,onLoadCallback);
      }
    };
    /**
     * 移除相册中的图片
     * @param  {(HTMLElement|HTMLElement[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    this.removeImage = function (image) {

    };
    /**
     * 设置相册的布局
     * @param {number} layout 布局值，IfeAlbum.LAYOUT 中的值
     */
    this.setLayout = function (layout) {

    };

    /**
     * 获取相册的布局
     * @return {number} 布局枚举类型的值
     */
    this.getLayout = function() {

    };
    /**
     * 设置图片之间的间距
     * 注意这个值仅代表图片间的间距，不应直接用于图片的 margin 属性，如左上角图的左边和上边应该紧贴相册的左边和上边
     * 相册本身的 padding 始终是 0，用户想修改相册外框的空白需要自己设置相框元素的 padding
     * @param {number}  x  图片之间的横向间距
     * @param {number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
     */
    this.setGutter = function (x, y) {
      m_Gutter[0] = x;
      m_Gutter[1] = y;
    };

  } 

  /**
   * 一个容器，用于封装DOM操作，包括CSS样式修改，工厂方法
   * @param {string} 某个容器在页面的ID
   */
  function createContainer(id){
    //---- 容器实例原型 ----//
    function Container(id){
      var _container = null;
      if(typeof id === "string") {
          _container = document.getElementById(id);
      } else {
          _container = id; //可以直接用DOM作为参数
      }
      //---- 私有方法，用于获取元素的样式 ----//
      function _getProperty(property,_div){
        if(_div){
          if(_div.currentStyle) {
              return _div.currentStyle.getAttribute(property); //IE
          } else {
              return getComputedStyle(_div, null).getPropertyValue(property);
          }
        }else{
          if(_container.currentStyle) {
              return _container.currentStyle.getAttribute(property); //IE
          } else {
              return getComputedStyle(_container, null).getPropertyValue(property);
          }
        }
      }
      /**
       * public method
       * 取样式
       * @param {string} 样式名
       * @param {hTMLElemetn} [_DIV] 任一指定元素
       * @return {string} 样式对应的值 
       */
      this.getCSS = function(property,_div){
        if(_div) {
            return _getProperty(property, _div);
        } else {
            return _getProperty(property);
        }
      }
      /**
       * 删除所有元素
       * @return {Container} 支持链式调用
       */
      this.clearChildren = function(){
        _container.innerHTML = "";
        return this;
      }
      /**
       * 添加一个DIV结点，用于坑爹的特殊需求
       * @param {HTMLElement} [_parent] 可选的任意的DIV
       * @returns {HTMLElement} 一个空的DIV节点
       */
      this.appendDiv = function( _parent){
        var div = document.createElement("div");
        if(_parent) {
            _parent.appendChild(div);
        } else {
            _container.appendChild(div);
        }
        return div;
      }
      /**
       * 添加image
       * @param {Image} 图片结点，不可以是URL，因为涉及到延时加载的问题，需要另外处理
       * @param {HTMLElement} [_DIV] 可选的任意的DIV
       * @returns {HTMLElement} 图片被DIV包围的节点
       */
      this.appendImage = function(image,_div){
        var div = document.createElement("div");
        div.appendChild(image);
        div.setAttribute("data-width",image.width);
        div.setAttribute("data-height",image.height);
        if(_div) {
          _div.appendChild(div);

        } else {
          _container.appendChild(div);
        }
        var divWidth = parseFloat(this.getCSS("width",div));
        var divHeight = parseFloat(this.getCSS("height",div));
        // console.log("divWidth/divHeight:" + divWidth/divHeight);
        // console.log("imgWidth/imgHeight:" + image.width/image.height);
        // 拉伸并截断，这可能是有问题的，因为要求div必须是已经知道大小的
        if(divWidth/divHeight > image.width/image.height){
          image.style.width = "100%";
          image.style.height = "auto";
        }else{
          image.style.width = "auto";
          image.style.height = "100%";
        }
        return div;
      }
      /**
       * 获取容器
       * @returns {HTMLElement} 相册容器节点
       */
      this.getContainer = function(){
        return _container;
      }
      /**
       * 设置容器的 css class 操作：has
       * @param {string} css类名
       * @return {boolean}
       */
      this.hasClass = function(cls){
        return _container.classList.contains(cls);
      }
      /**
       * 设置容器的 css class 操作：add
       * @param {string} css类名
       * @return {Container} 支持链式调用
       */
      this.addClass = function(cls){
        _container.classList.add(cls);
        return this;
      }
      /**
       * 设置容器的 css class 操作：remove
       * @param {string} css类名
       * @return {Container} 支持链式调用
       */
      this.removeClass = function(cls){
        _container.classList.remove(cls);
        return this;
      }
      /**
       * 设置容器的 css class 操作：clear
       * @return {Container} 支持链式调用
       */
      this.clearClass = function(){
        _container.className=""; //这个能用不？？
        return this;
      }

    } //Container 原型 END
    return new Container(id);
  }// createContainer 工厂方法 END

  /**
   * 
   *
   */

  // 实例化
  if (typeof window.PuzzleAlbum === 'undefined') {
    // 实例化将在main.js进行 调用window.PuzzleAlbum(id)实例化
    window.PuzzleAlbum = function(id){
      console.log("create PuzzleAlbum.");
      return new PuzzleAlbum(id);
    };
  }

})(window);