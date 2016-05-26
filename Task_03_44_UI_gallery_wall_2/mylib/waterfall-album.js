;(function (window) {
  /**
   * 相册原型 简化版
   * @param {{object}} [opts] 初始化配置参数
   */
  function WaterfallAlbum(id){

    var LAYOUT = {
        PUZZLE: 1,    // 拼图布局
        WATERFALL: 2, // 瀑布布局 未实现
        BARREL: 3     // 木桶布局 未实现
    };
    //---- 私有变量 ----//
    //-- 加载锁 --//
    var m_Loadingflag = 0; //0时为无锁状态，可以加载新的图片
    //-- 加增，记录图片加载顺序 --//
    var m_AutoIncrement = 0; //没用
    //-- 配置项 for test --//
    var m_Opts = null;
    //-- 瀑布的列数 --//
    var m_ColumnsNum = 1;
    //-- 初始化时的选择器 --//
    var m_ContainerSelector = id || "album-container";
    //-- 瀑布相册的容器节点 --//
    var m_Container = document.getElementById(m_ContainerSelector);
    //-- 瀑布整体 --//
    var m_WaterfallBody = document.createElement("div");
    m_WaterfallBody.className = "waterfall-body";
    m_Container.appendChild(m_WaterfallBody);
    //-- 相册中的所有图片 --//
    var m_Images = []; // 图片的title/detail等信息全部塞进了dataset中
    //-- 布局标识 --//
    var m_Layout = LAYOUT.WATERFALL;  //默认瀑布布局
    //-- 图片间距 --//
    var m_Gutter = [0,0];
    //-- 所有列元素 --//
    var m_ColumnDIV = [];
    //-- 加载图片时显示的内容 --//
    var m_LoadingDisplay = createLoadingDisplay();
    //-- 全屏时显示的内容 --//
    var m_FullScreenDisplay = new FullScreenDisplay();
    m_Container.appendChild(m_LoadingDisplay);

    if(m_Container == null){
      console.warn("找不到id为[" + m_ContainerSelector +"]的DOM元素");
      return ;
    }
    m_Container.className = "waterfall";

    addEventHandler(m_WaterfallBody,"click",function(e){
      var target = e.target;
      if(target.tagName == 'IMG'){
        //console.log(e);
        m_FullScreenDisplay.showImage(target.src);
      }
    });
    addEventHandler(window,"resize",function(e){
      console.log("window resize 事件");
      updateColumnsCSS();
    });
    

    //---- 私有方法 ----//
    /**
     * 锁方法
     */
    //-- 加锁 --//
    function lock(){
      m_Loadingflag = 1; //非0时表示锁定
      m_LoadingDisplay.style.display = "block";
    }
    //-- 解锁 --//
    function unlock(){
      m_Loadingflag = 0; //非0时表示锁定
      m_LoadingDisplay.style.display = "none";
    }
    //-- 检查锁 --//
    function isLock(){
      return m_Loadingflag != 0;
    }

    /**
     * 创建一个loading的显示层，loading时显示这个
     */
    function createLoadingDisplay(){
      var div = document.createElement("div");
      div.className = "loading-display";
      div.innerHTML = "Loading.....";
      div.style.display = "none";
      return div;
    }

    /**
     * 设置列数为colNum
     * @param {number} 列数
     */
    function setColumnsNum(colNum){
      if(colNum <= 0){
        return false;
      }
      //清空
      m_ColumnDIV = [];
      m_WaterfallBody .innerHTML = "";
      //重建列
      m_ColumnsNum = colNum;
      for(var i=0;i<m_ColumnsNum;i++){
        var div = document.createElement("div");
        div.className = "waterfall-col";
        m_WaterfallBody.appendChild(div);
        m_ColumnDIV.push(div);
      }
      updateColumnsCSS();
      resortImageObj();
    }

    /**
     * 更新列宽与间距
     */
    function updateColumnsCSS(){
      var waterfallBodyWidth = parseFloat(getProperty("width",m_WaterfallBody));
      if( (waterfallBodyWidth-m_Gutter[0]*(m_ColumnsNum-1)) <0 ){
        m_Gutter[0] = 0;
      }
      var colWidth = ((waterfallBodyWidth-m_Gutter[0]*(m_ColumnsNum-1))/m_ColumnsNum).toFixed(9);
      console.log("更新后 width:"+colWidth+" marginRight:"+ m_Gutter[0]);
      for(var i=0;i<m_ColumnsNum;i++){
        if(i == m_ColumnsNum-1){

        }else{
          m_ColumnDIV[i].style.marginRight = (m_Gutter[0] +"px");
        }
        m_ColumnDIV[i].style.width = (colWidth+"px");
      };
    }
    /**
     * 找到高度最小的一列
     */
    function getMinHeightColumn(){
      if(m_ColumnDIV.length<=0){return -1;}
      var min = m_ColumnDIV[0].clientHeight;
      var index = 0;
      //var str = ""; // test
      for(var i=0;i<m_ColumnDIV.length;i++){
        //str += (m_ColumnDIV[i].clientHeight +" ");
        if (m_ColumnDIV[i].clientHeight < min) {
          min = m_ColumnDIV[i].clientHeight;
          index = i;
        }
      }
      //console.log(str);
      //console.log("最短列是["+index+"]. 高度为:"+min);
      return m_ColumnDIV[index];
    }

    /**
     * 向相册添加图片，必须做异步处理，不然计算高度将出错
     * 直接追加图片
     * @param { imgJSOM[] } images 图片数据对象数组 {url: string, title:string, detail:string}
     * @param { Function } [onLoadCallback] 所有图片加载完毕的回调函数: function(ture|false)
     * @return { Image[] } 返回添加的图片
     */
    function _addImage(imageJSONs, onLoadCallback){
      var loadingflag = true;
      var imageToLoadNum = imageJSONs.length; //闭包？
      lock();
      if(imageJSONs.length <= 0){
        unlock();
        return;
      }
      for(var i=0;i<imageJSONs.length;i++){
        var img = new Image();
        img.dataset.info = i;
        img.dataset.title = imageJSONs[i].title;
        img.dataset.detail = imageJSONs[i].detail;
        img.src = imageJSONs[i].url;
        img.onload = function(e){ //加载成功回调
          //console.log(this);
          //this.dataset.info = m_AutoIncrement++;
          console.log("图片["+ this.dataset.info +"]加载成功.");
          //console.log(this);

          if(--imageToLoadNum == 0){
            console.log("图片全部加载完毕.");
            unlock();
            if(onLoadCallback instanceof Function) {
              console.log("callback invoke");
              //console.log(onLoadCallback);
              onLoadCallback(loadingflag);
            }
          }
          this.dataset.info = m_Images.length;
          m_Images.push(this);
          var minHColDiv = getMinHeightColumn();
          var imgDiv = document.createElement("div");
          imgDiv.className = "img-div";
          imgDiv.style.marginBottom = (m_Gutter[1]+"px");
          var titleDiv = document.createElement("div");
          titleDiv.className = "content";
          titleDiv.innerHTML = ( "<div class=\"title\">"+ this.dataset.title+"</div>"+
                               "<div class=\"detail\">"+ this.dataset.detail+"</div>" );
          imgDiv.appendChild(this);
          imgDiv.appendChild(titleDiv);
          imgDiv.setAttribute("data-width",this.width);
          imgDiv.setAttribute("data-height",this.height);
          imgDiv.setAttribute("data-src",this.src);
          minHColDiv.appendChild(imgDiv);
        }
        img.onerror = function(e){
          console.log("图片["+this.dataset.info+"]加载失败.");
          loadingflag = false;
          if(onLoadCallback instanceof Function) {
            console.log("callback invoke false");
            console.log(onLoadCallback);
            onLoadCallback(true);
          }
          if(--imageToLoadNum == 0){
            console.log("图片全部加载完毕.");
            unlock();
            if(onLoadCallback instanceof Function) {
              console.log("callback invoke");
              //console.log(onLoadCallback);
              onLoadCallback(loadingflag);
            }
          }
        }
        
      }
    }
    /**
     * 重排Image对象，必须做异步处理，不然计算高度将出错
     * 直接追加图片
     */
    function resortImageObj(){
      for(var i=0;i<m_Images.length;i++){
        var minHColDiv = getMinHeightColumn();
        var imgDiv = document.createElement("div");
        imgDiv.style.marginBottom = (m_Gutter[1]+"px");
        var titleDiv = document.createElement("div");
        titleDiv.className = "content";
        titleDiv.innerHTML = ( "<div class=\"title\">"+m_Images[i].dataset.title+"</div>"+
                               "<div class=\"detail\">"+m_Images[i].dataset.detail+"</div>" );
        imgDiv.appendChild(m_Images[i]);
        imgDiv.appendChild(titleDiv);
        minHColDiv.appendChild(imgDiv);
      }
    }
    /**
     * 卷轴的事件响应
     */
    function onscroll(e){

    }

    //---- 本库提供的方法 ----//
    /**
     * 初始化相册，并设置图片
     * 当相册原本包含图片时，该方法会替换原有图片
     * @param { imgJSOM|imgJSOM[] } images 图片数据对象数组 
     *        对象格式：{url: string, title:string, detial:string}
     * @param {{
          layout?: LAYOUT,
          callBack?: function,
        }}            [option] 配置项
     */
    this.setImage = function(imageJSONs,opts){
      if(! (imageJSONs instanceof Array) ){
        this.setImage([imageJSONs]);
        return ;
      }
      m_WaterfallBody.innerHTML = "";
      m_Opts = opts || {};
      m_ColumnsNum = opts.column || 1;
      m_Gutter = opts.gutter || [0,0];
      for(var i=0;i<m_ColumnsNum;i++){
        var div = document.createElement("div");
        div.className = "waterfall-col";
        m_WaterfallBody.appendChild(div);
        m_ColumnDIV.push(div);
      }
      updateColumnsCSS();
      _addImage(imageJSONs);
    }
    /**
     * 添加图片 
     * @param { imgJSOM|imgJSOM[] } images 图片数据对象数组 
     *        对象格式：{url: string, title:string, detial:string}
     */
    this.addImage = function(imageJSONs,onLoadCallback){
      if(isLock()){
        return false; //不执行
      }
      if(! (imageJSONs instanceof Array)) {
        return _addImage([imageJSONs],onLoadCallback);
      }else{
        return _addImage(imageJSONs,onLoadCallback);
      }
    }
    
    /**
     * 增加一列，并重排
     * @return {boolean} 返回是否成功
     */
    this.addColumn = function(){
      if(isLock()){
        return false; //不执行
      }
      var colNum = m_ColumnsNum + 1;
      return setColumnsNum(colNum);
    }
    /**
     * 更新列、图片的间距
     * @return {boolean} 返回是否成功
     */
    this.setGutter = function(gutter){
      if(isLock()){
        return false; //不执行
      }
      if(typeof gutter === 'number' || typeof gutter === 'string'){
        m_Gutter[0] = gutter;
        m_Gutter[1] = gutter;
      }else{
        m_Gutter[0] = gutter[0];
        m_Gutter[1] = gutter[1];
      }
      //更新列间距
      updateColumnsCSS();
      var imgDivs = m_WaterfallBody.querySelectorAll(".waterfall-col > div");
      console.log("共"+imgDivs.length+"张图");
      [].forEach.call(imgDivs,function(e){
        e.style.marginBottom =  (m_Gutter[1] +"px");
      });
    }
    this.getColumnsNum = function(){
      return m_ColumnsNum;
    }
    this.getGutter = function(){
      return [m_Gutter[0],m_Gutter[1]];
    }
    /**
     * 是否滚到了底部
     */
    this.isScrollToBottom = function(){
      var screenHeight = (document.documentElement.scrollTop || document.body.scrollTop) + 
                         (document.documentElement.clientHeight || document.body.clientHeight);
      //console.log("screenHeight:"+screenHeight);
      var minHDiv = getMinHeightColumn();
      var minHDivHeight = minHDiv.offsetTop  + minHDiv.offsetHeight;
      //console.log("containerHeight:"+containerHeight);
      //console.log("m_Container.offsetTop:"+m_Container.offsetTop);
      if(screenHeight > minHDivHeight+200 ){
        //_addImage(getNewImage());
        return true;
      }else{
        return false;
      }
    }
  }


  //---- 封装的容器 ----//
  //-- 全屏显示窗口 --//
  function FullScreenDisplay () {
    var _this = this;
    var m_lock = true;
    var m_View = document.createElement("div");
    m_View.className = "fullscreen-display";
    m_View.style.display = "none";
    // var m_ImgDiv = document.createElement("div");
    // m_ImgDiv.className = "img-div";
    // m_View.appendChild(m_ImgDiv);
    var m_Image = new Image();
    var m_isView = false;

    document.body.appendChild(m_View);
    //-- 锁方法 --//
    this.lock = function(){ m_lock = true;}
    this.unLock = function(){ m_lock = false;}
    this.isLock = function(){ return m_lock;}

    this.showImage = function(image){
      if(image instanceof Image){
        this.setImage(image.src);
      }
      //document.body.style.overflow = 'hidden'
      // var windowW = document.documentElement.clientWidth;
      // var windowH = document.documentElement.clientHeight;
      var windowW = window.innerWidth;
      var windowH = window.innerHeight;
      //console.log("document:["+windowW+","+windowH+"]");
      m_View.innerHTML ="";
      img = m_Image;
      img.src = image;
      img.onload = function(e){
        var m_ImgDiv = document.createElement("div");
        m_ImgDiv.appendChild(this);
        m_ImgDiv.className = "img-div";
        var imgWidth = this.width;
        var imgHeight = this.height;
        if(imgWidth/imgHeight > windowW/windowH){
          this.style.width = (windowW*0.8)+"px";
          this.style.height = "auto";
        }else{
          this.style.width = "auto";
          this.style.height = (windowH*0.8)+"px";
        }

        m_View.appendChild(m_ImgDiv);
        console.log("全屏显示图片加载成功");
      }
      img.onerror = function(e){
        console.log("全屏显示图片加载失败");
      }
      m_View.style.display = "flex";
    }

    this.show = function(){
      m_View.style.display = "flex";
      document.body.style.overflow = 'hidden';
      
    }

    this.hide = function(){
      m_View.style.display = "none";
      document.body.style.overflow = 'auto'
    }
    addEventHandler(m_View, "click", function(e){
      var target = e.target;
      if(target.classList.contains("fullscreen-display")){
        _this.hide();
      }
    });
  }
  
  //---- 添加事件代理的方法 ----//
  function addEventHandler(element, ev, handler){
    if(element.addEventListener){
      element.addEventListener(ev,handler,false);
    }else if(element.attachEvent){
      element.attachEvent("on" + ev, handler);
    }else{
      element["on" + ev] = handler;
    }
  }
  //---- 获取元素的样式 ----//
  function getProperty(property,_div){
    if(_div.currentStyle) {
        return _div.currentStyle.getAttribute(property); //IE
    } else {
        return getComputedStyle(_div, null).getPropertyValue(property);
    }
  }

  // 对外可使用的原型
  if (typeof window.WaterfallAlbum === 'undefined') {
    window.WaterfallAlbum = function (opts){
      return new WaterfallAlbum(opts);
    }
  }
})(window);
  
