/**
 * 木桶相册组件 
 */
;(function(window) {
  //---- 公共变量 ----//

  //---- 公有的外部方法 ----//
  //-- 添加事件代理的方法 --//
  function addEventHandler(element, ev, handler){
    if(element.addEventListener){
      element.addEventListener(ev,handler,false);
    }else if(element.attachEvent){
      element.attachEvent("on" + ev, handler);
    }else{
      element["on" + ev] = handler;
    }
  }

  //-- 将img/title/detail 包装成一个 wrapper DIV --//
  function wrapImg(imgJSON){ //先不带宽度高度等样式
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.setAttribute("data-width",imgJSON.width);
    wrapper.setAttribute("data-height",imgJSON.height);
    // wrapper.style.width = imgJSON.width;
    // wrapper.style.height = imgJSON.height;
    var d1 = document.createElement("div");
    d1.className = "img-data";
    var img = new Image();
    img.src = imgJSON.url;
    d1.appendChild(img);
    var d2 = document.createElement("div");
    d2.className = "img-info";
    d2.innerHTML =  ( "<div class=\"titie\">"+imgJSON.title+"</div>" +
                      "<div class=\"detail\">"+imgJSON.detail+"</div>" );
    //console.log("img-data title:"+title+" detail:"+detail);
    wrapper.appendChild(d1);
    wrapper.appendChild(d2);
    return wrapper;
  }
  //-- 将当前行的img归集为一个行，并调整宽高度，前提是已保证不会超宽 --//
  function reduceCurRow(curRow, clientWidth, rowHeight, gutter){
    var rowImgsWidthSum_0 = 0;
    for(var i=0,len=curRow.length;i<len;i++){
      var img = curRow[i].childNodes[0].firstChild; 
      var w0 = img.width * rowHeight / img.height;
      rowImgsWidthSum_0 += (w0); 
    };
    var grapSum = gutter[0] * ((curRow.length -1) < 0?0: (curRow.length -1))
    var newH = rowHeight*(clientWidth - grapSum)/rowImgsWidthSum_0;
    for(var i=0,len=curRow.length;i<len;i++){
      var img = curRow[i].childNodes[0].firstChild;
      var w0 = img.width * rowHeight / img.height; 
      var newW = (clientWidth - grapSum)*w0/rowImgsWidthSum_0;
      img.style.height = (newH + "px");
      img.style.width = (Math.floor(newW)+"px");
      curRow[i].style.height = (newH + "px");
      curRow[i].style.width = (Math.floor(newW)+"px");
      if(i < len-1)
        curRow[i].style.marginRight = (gutter[0]+"px");
      curRow[i].style.marginBottom = (gutter[1]+"px");
    }
  } 

  //---- 外部引用的原型 ----//
  //-- 加载图片时的Loading显示层原型，封装了一些方法 --//
  function LoadingDisplay(rootElement){
    var div = document.createElement("div");
    div.className = "loading-display";
    div.innerHTML = "Loading.....";
    div.style.display = "none";
    rootElement.appendChild(div);
    this.hide = function(){
      div.style.display="none";
    }
    this.show = function(){
      div.style.display="block";
    }
  }
  //-- 锁原型 --//
  function Lock(){
    var m_lockNum =0;
    this.lock = function(){
      m_lockNum++;
      console.log("加锁：m_lockNum["+m_lockNum +"]");
    }
    this.unlock = function(){
      m_lockNum --;
      console.log("解锁：m_lockNum["+m_lockNum +"]");
    }
    this.isLocking = function(){
      //console.log("检查锁：m_lockNum["+m_lockNum +"]");
      return m_lockNum > 0;
    }
  }
  //-- 全屏显示窗口原型 --//
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
    //-- 全屏显示 --//
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
    //-- 点击空白后隐藏 --//
    addEventHandler(m_View, "click", function(e){
      var target = e.target;
      if(target.classList.contains("fullscreen-display")){
        _this.hide();
      }
    });
  }

  /**
   * 木桶相册原型
   */
  function BarrelAlbum(opts){
    if(typeof opts === 'undefined' || opts == null){
      console.error("BarrelAlbum 配置参数为空");
      return ;
    }
    this.init(opts);
  }
  //---- 对外提供的接口 ----//
  /**
   * 初始化
   * @param {obj} opts {id:string, min:number, max:number, gutter:[number,number], rowheight:number}
   */
  BarrelAlbum.prototype.init = function(opts) {
    //-- 初始化时的选择器 --//
    this.m_RootElementSelector = opts.id || "album-container";
    //-- 每行图片数的范围 --//
    this.m_MinImageInRow = opts.min || 3;
    this.m_MaxImageInRow = opts.max || 4;
    //-- 相册的间距 --//
    this.m_Gutter = opts.gutter || [2,2];
    this.m_DefaultRowHeight = opts.rowheight || 200;
    //-- 瀑布相册的容器节点 --//
    this.m_RootElement = document.getElementById(this.m_RootElementSelector);
    this.m_RootElement.classList.add("barrel-album");
    //-- 相册主体 --//
    this.m_AlbumContainer = document.createElement("div");
    this.m_AlbumContainer.className = "album-container";
    this.m_RootElement.appendChild(this.m_AlbumContainer);

    //-- 相册中的所有图片 --//  // 不分组 只存img
    this.m_AllImages = [];      // 图片的title/detail等信息应该全部塞进dataset中
    //-- 已经有的行 --//
    this.m_AllRow = [];         // 存的是div数组
    //-- 当前行 --//
    this.m_CurRow = [];         // 存的是div
    //-- 锁 --//
    this.m_Lock = new Lock();
    //-- 加载图片时显示的内容 --//
    this.m_LoadingDisplay = new LoadingDisplay(this.m_RootElement);
    //-- 全屏显示的窗口 --//
    var m_FullScreenDisplay = new FullScreenDisplay();
    var _this = this;

    //-- 窗口大小改变事件 --//
    addEventHandler(window, "resize", onResizeCallBack);
    function onResizeCallBack(e){
      _this.renderAllImgs(e);
    }
    //-- 单击一张图片时全屏显示 --//
    addEventHandler(this.m_AlbumContainer,"click",function(e){
      var target = e.target;
      if(target.tagName == 'IMG'){
        //console.log(e);
        m_FullScreenDisplay.showImage(target.src);
      }
    });
  };

  /**
   * 向相册添加图片，参数要求是已经加载好的图片
   * @param { images } images 图片对象数组 {url:string, title:string, defail:string, width:int, height:int}
   */
  BarrelAlbum.prototype.setImageWithJSON = function(images){
    if(! (images instanceof Array) ){
      this.setImage([images]);
      return ;
    }
    // 清空
    this.m_CurRow = [];
    this.m_AllRow = [];
    this.m_AlbumContainerinnerHTML = "";
    this.m_AllImages = [];
    for(var i=0;i<images.length;i++){
      if(images[i] == null){
        continue; 
      }
      this.m_AllImages.push(images[i]);
    }
    this.renderAllImgs(null);
    console.log(this.m_AllRow);
  }
  /**
   * 向相册添加图片，参数要求是已经加载好的图片
   * @param { images } images 图片对象数组 
   */
  BarrelAlbum.prototype.addImageWithJSON = function(imageJSONs){
    if(! (imageJSONs instanceof Array) ){
      this.addImageWithJSON([imageJSONs]);
      return ;
    }
    for(var i=0;i<imageJSONs.length;i++){
      if(imageJSONs[i] == null){
        continue; 
      }
      this._pushAndRenderImg(imageJSONs[i]);
    }
    console.log("全部加载完毕.");
    console.log(this.m_AllRow);
  }

  //
  BarrelAlbum.prototype.setGutter = function(gutter){
    // if(isLock()){
    //   return false; //不执行
    // }
    if(typeof gutter === 'number' || typeof gutter === 'string'){
      this.m_Gutter[0] = parseFloat(gutter);
      this.m_Gutter[1] = parseFloat(gutter);
    }else{
      this.m_Gutter[0] = parseFloat(gutter[0]);
      this.m_Gutter[1] = parseFloat(gutter[1]);
    }
    this.renderAllImgs(null);
  }
  BarrelAlbum.prototype.renderAllImgs = function(e){
    // 清空
    this.m_AllRow = [];         // 存的是div数组
    this.m_CurRow = [];         // 存的是div
    this.m_AlbumContainer.innerHTML = "";
    for(var i=0;i<this.m_AllImages.length;i++){
      //
      var imgJSON = this.m_AllImages[i];
      var wrapper = wrapImg( imgJSON);
      // 估计添加某张图片后当前行宽度
      var sum = 0;
      for(var j=0;j<this.m_CurRow.length;j++){
        var w0 = parseFloat(this.m_CurRow[j].getAttribute("data-width")) * this.m_DefaultRowHeight / parseFloat(this.m_CurRow[j].getAttribute("data-height"));
        sum += (w0 + this.m_Gutter[0]); 
      }
      var w = imgJSON.width * this.m_DefaultRowHeight / imgJSON.height ;
      sum += w;
      // 
      if(sum <= this.m_AlbumContainer.clientWidth){  
       console.log("图片"+imgJSON.title + 
              " 宽度:"+w.toFixed(2)+" 添加后当前行宽:"+(sum).toFixed(2) + 
              " 小于相册行宽度:"+this.m_AlbumContainer.clientWidth );
        // 宽度足够，直接添加到当前行
        // img.style.width = w + "px";
        // img.style.height = this.m_DefaultRowHeight + "px";
        this.m_AlbumContainer.appendChild(wrapper);
        wrapper.style.width = w + "px";
        wrapper.style.height = this.m_DefaultRowHeight + "px";
        wrapper.setAttribute("row-index",this.m_AllRow.length);
        wrapper.style.marginBottom = this.m_Gutter[1] + "px";
        if(this.m_CurRow.length > 0)
          this.m_CurRow[this.m_CurRow.length-1].style.marginRight = this.m_Gutter[0] + "px";
        this.m_CurRow.push(wrapper);
        if(this.m_CurRow.length >= this.m_MinImageInRow && 
            this.m_CurRow.length < this.m_MaxImageInRow){
          reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
        }else if(this.m_CurRow.length >= this.m_MaxImageInRow){
          reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
          this.m_AllRow.push(this.m_CurRow);
          this.m_CurRow = [];
        }
      }else{ 
        // 宽度不足，调整当前行，使其宽度为相册行宽度，然后新建一行再添加再去
        console.log("图片"+imgJSON.title+
                    " 宽度:"+w.toFixed(2)+" 添加后当前行宽:"+(sum).toFixed(2) + 
                    " 大于相册行宽度:"+this.m_AlbumContainer.clientWidth);
        // img.style.width = w + "px";
        // img.style.height = this.m_DefaultRowHeight + "px";
        reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
        //当前行清空
        this.m_AllRow.push(this.m_CurRow);
        this.m_CurRow = [];
        this.m_AlbumContainer.appendChild(wrapper);
        wrapper.style.width = w + "px";
        wrapper.style.height = this.m_DefaultRowHeight + "px";
        wrapper.setAttribute("row-index",this.m_AllRow.length);
        wrapper.style.marginBottom = this.m_Gutter[1] + "px";
        this.m_CurRow.push(wrapper);
      }
    };
  }
  BarrelAlbum.prototype.isLocking = function(){
    return this.m_Lock.isLocking();
  }
  BarrelAlbum.prototype.lock = function(){
    this.m_Lock.lock();
    if(this.m_Lock.isLocking()){
      this.m_LoadingDisplay.show();
    }else{
      this.m_LoadingDisplay.hide();
    }
  }
  BarrelAlbum.prototype.unlock = function(){
    this.m_Lock.unlock();
    if(this.m_Lock.isLocking()){
      this.m_LoadingDisplay.show();
    }else{
      this.m_LoadingDisplay.hide();
    }
  }

  BarrelAlbum.prototype.isScrollToBottom_old = function(){
    var screenHeight = (document.documentElement.scrollTop || document.body.scrollTop) + 
                         (document.documentElement.clientHeight || document.body.clientHeight);
    //console.log("screenHeight:"+screenHeight);
    
    var containerHeight = this.m_AlbumContainer.offsetTop  + this.m_AlbumContainer.offsetHeight;
    //console.log("containerHeight:"+containerHeight);

    if(screenHeight > containerHeight ){
      //_addImage(getNewImage());
      return true;
    }else{
      return false;
    }
  }
  BarrelAlbum.prototype.isScrollToBottom = function(){
    var screenHeight = (document.documentElement.scrollTop || document.body.scrollTop) + 
                         (document.documentElement.clientHeight || document.body.clientHeight);
    //console.log("screenHeight:"+screenHeight);
    
    var rootHeight = this.m_RootElement.offsetTop  + this.m_RootElement.offsetHeight;
    //console.log("containerHeight:"+containerHeight);
    //var containerBotton = 

    if(screenHeight > rootHeight ){
      //_addImage(getNewImage());
      return true;
    }else{
      return false;
    }
  }

  BarrelAlbum.prototype._pushAndRenderImg = function(imgJSON){
    //
    this.m_AllImages.push(imgJSON);
    var wrapper = wrapImg( imgJSON );
    // 估计添加某张图片后当前行宽度
    var sum = 0;
    for(var j=0;j<this.m_CurRow.length;j++){
      var w0 = parseFloat(this.m_CurRow[j].getAttribute("data-width")) * this.m_DefaultRowHeight / parseFloat(this.m_CurRow[j].getAttribute("data-height"));
      sum += (w0 + this.m_Gutter[0]); 
    }
    var w = parseFloat(imgJSON.width) * this.m_DefaultRowHeight / parseFloat(imgJSON.height) ;
    sum += w;
    // 
    if(sum <= this.m_AlbumContainer.clientWidth){  
      console.log("加上此图片后行宽度:"+(sum) + " 少于相册行宽度:"+this.m_AlbumContainer.clientWidth);
      // 宽度足够，直接添加到当前行
      // img.style.width = w + "px";
      // img.style.height = this.m_DefaultRowHeight + "px";
      this.m_AlbumContainer.appendChild(wrapper);
      wrapper.style.width = w + "px";
      wrapper.style.height = this.m_DefaultRowHeight + "px";
      wrapper.setAttribute("row-index",this.m_AllRow.length);
      wrapper.style.marginBottom = this.m_Gutter[1] + "px";
      if(this.m_CurRow.length > 0)
        this.m_CurRow[this.m_CurRow.length-1].style.marginRight = this.m_Gutter[0] + "px";
      this.m_CurRow.push(wrapper);
      if(this.m_CurRow.length >= this.m_MinImageInRow){
        reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
      }
      if(this.m_CurRow.length >= this.m_MaxImageInRow){
        reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
        this.m_AllRow.push(this.m_CurRow);
        this.m_CurRow = [];
      }
    }else{ 
      // 宽度不足，调整当前行，使其宽度为相册行宽度，然后新建一行再添加再去
      console.log("加上此图片后行宽度:"+(sum) + " 大于相册行宽度:"+this.m_AlbumContainer.clientWidth);
      // img.style.width = w + "px";
      // img.style.height = this.m_DefaultRowHeight + "px";
      reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
      //当前行清空
      this.m_AllRow.push(this.m_CurRow);
      this.m_CurRow = [];
      this.m_AlbumContainer.appendChild(wrapper);
      wrapper.style.width = w + "px";
      wrapper.style.height = this.m_DefaultRowHeight + "px";
      wrapper.setAttribute("row-index",this.m_AllRow.length);
      wrapper.style.marginBottom = this.m_Gutter[1] + "px";
      this.m_CurRow.push(wrapper);
    }
  }

  //-- 对外可使用的原型 --//
  if (typeof window.BarrelAlbum === 'undefined') {
    window.BarrelAlbum = function (opts){
      return new BarrelAlbum(opts);
    }
  }
})(window);