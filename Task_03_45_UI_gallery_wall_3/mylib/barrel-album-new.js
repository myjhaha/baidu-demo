/**
 * 木桶相册组件 
 */
;(function(_window) {
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
  function wrapImg(img,title,detail){ //先不带宽度高度等样式
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.setAttribute("data-width",img.width);
    wrapper.setAttribute("data-height",img.height);
    var d1 = document.createElement("div");
    d1.className = "img-data";
    d1.appendChild(img);
    var d2 = document.createElement("div");
    d2.className = "img-info";
    d2.innerHTML =  ( "<div class=\"titie\">"+title+"</div>" +
                      "<div class=\"detail\">"+detail+"</div>" );
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

    var _this = this;
    addEventHandler(window, "resize", onResizeCallBack);

    function onResizeCallBack(e){
      _this.renderAllImgs(e);
    }
  };

  /**
   * 向相册添加图片，必须做异步处理，不然计算高度将出错
   * @param { imgJSOM[] } images 图片数据对象数组 {url: string, title:string, detail:string}
   * @param { Function } [onLoadCallback] 所有图片加载完毕的回调函数: function(ture|false)
   * @return { Image[] } 返回添加的图片
   */
  BarrelAlbum.prototype.setImage = function(imageJSONs, onLoadCallback){
    if(typeof imageJSONs === 'undefined') return;
    if(! (imageJSONs instanceof Array) ){
      this.setImage([imageJSONs],opts);
      return ;
    }
    var loadingflag = true;
    var imageToLoadNum = imageJSONs.length; //闭包？
    this.m_AlbumContainerinnerHTML = "";
    this.m_AllImages = [];
    //this.m_AllRowDiv = [];
    //this._addImages(imageJSONs, onLoadCallback);
    this.m_LoadingDisplay.show();
    for(var i=0,len=imageJSONs.length;i<len;i++){
      if(imageJSONs[i] == null){
        continue; 
      }
      var img = new Image();
      img.dataset.info = i;
      img.dataset.title = imageJSONs[i].title;
      img.dataset.detail = imageJSONs[i].detail;
      img.src = imageJSONs[i].url;
      var _AlbumThis = this;
      this.m_Lock.lock();
      img.onload = function(e){ //加载成功回调
        // 检查锁
        _AlbumThis.m_Lock.unlock();
        if(_AlbumThis.m_Lock.isLocking()){
          _AlbumThis.m_LoadingDisplay.show();
        }else{
          _AlbumThis.m_LoadingDisplay.hide();
        }
        _AlbumThis.m_AllImages.push(this);
        if(--imageToLoadNum == 0){
          console.log("全部加载完毕.");
          _AlbumThis.renderAllImgs(null);
          console.log(_AlbumThis.m_AllRow);

          if(onLoadCallback instanceof Function) {
            console.log("callback invoke");
            //console.log(onLoadCallback);
            onLoadCallback(loadingflag);
          }
        };
      };
      img.onerror = function(e){
        console.log("单张图片 序号["+this.dataset.info+"]加载失败.");
        loadingflag = false;
        // 检查锁
        _AlbumThis.m_Lock.unlock();
        if(_AlbumThis.m_Lock.isLocking()){
          _AlbumThis.m_LoadingDisplay.show();
        }else{
          _AlbumThis.m_LoadingDisplay.hide();
        }
        if(--imageToLoadNum == 0){
          console.log("全部加载完毕.");
          _AlbumThis.renderAllImgs(null);
          if(onLoadCallback instanceof Function) {
            console.log("callback invoke");
            //console.log(onLoadCallback);
            onLoadCallback(loadingflag);
          }

        }
      };
    }
  }
  //-- 影子函数 --//
  BarrelAlbum.prototype._addImages = function(imageJSONs, onLoadCallback){
    if(typeof imageJSONs === 'undefined' || imageJSONs == null || imageJSONs.length <= 0){
      return ;  
    }
    var loadingflag = true;
    var imageToLoadNum = imageJSONs.length; //闭包？
    for(var i=0,len=imageJSONs.length;i<len;i++){
      if(imageJSONs[i] == null){
        continue; 
      }
      var img = new Image();
      img.dataset.info = i;
      img.dataset.title = imageJSONs[i].title;
      img.dataset.detail = imageJSONs[i].detail;
      img.src = imageJSONs[i].url;
      var _AlbumThis = this;
      this.m_Lock.lock();
      if(this.m_Lock.isLocking()){
        this.m_LoadingDisplay.show();
      }else{
        this.m_LoadingDisplay.hide();
      }
      img.onload = function(e){ //加载成功回调

        _AlbumThis.m_Lock.unlock();
        if(_AlbumThis.m_Lock.isLocking()){
          _AlbumThis.m_LoadingDisplay.show();
        }else{
          _AlbumThis.m_LoadingDisplay.hide();
        }

        _AlbumThis._pushAndRenderImg(this);
        if(--imageToLoadNum == 0){
          console.log("全部加载完毕.");
          //_AlbumThis.renderAllImgs(null);
          console.log(_AlbumThis.m_AllRow);

          if(onLoadCallback instanceof Function) {
            console.log("callback invoke");
            //console.log(onLoadCallback);
            onLoadCallback(loadingflag);
          }
        };
      };
      img.onerror = function(e){
        console.log("单张图片 序号["+this.dataset.info+"]加载失败.");
        loadingflag = false;
        _AlbumThis.m_Lock.unlock();
        if(_AlbumThis.m_Lock.isLocking()){
          _AlbumThis.m_LoadingDisplay.show();
        }else{
          _AlbumThis.m_LoadingDisplay.hide();
        }
        if(--imageToLoadNum == 0){
          console.log("全部加载完毕.");
          if(onLoadCallback instanceof Function) {
            console.log("callback invoke");
            //console.log(onLoadCallback);
            onLoadCallback(loadingflag);
          }
        }
      };

    }
  }

  BarrelAlbum.prototype.addImage = function(imageJSONs,onLoadCallback){
    if(imageJSONs == null){ return ;}
      if(! (imageJSONs instanceof Array)) {
        return this._addImages([imageJSONs],onLoadCallback);
      }else{
        return this._addImages(imageJSONs,onLoadCallback);
      }
  }
  BarrelAlbum.prototype.renderAllImgs = function(e){
    // 清空
    this.m_AllRow = [];         // 存的是div数组
    this.m_CurRow = [];         // 存的是div
    this.m_AlbumContainer.innerHTML = "";
    for(var i=0;i<this.m_AllImages.length;i++){
      //
      var img = this.m_AllImages[i];
      var wrapper = wrapImg( img,
                             img.dataset.title,
                             img.dataset.detail);
      // 估计添加某张图片后当前行宽度
      var sum = 0;
      for(var j=0;j<this.m_CurRow.length;j++){
        var w0 = this.m_CurRow[j].firstChild.firstChild.width * this.m_DefaultRowHeight / this.m_CurRow[j].firstChild.firstChild.height;
        sum += (w0 + this.m_Gutter[0]); 
      }
      var w = img.width * this.m_DefaultRowHeight / img.height ;
      sum += w;
      // 
      if(sum <= this.m_AlbumContainer.clientWidth){  
        console.log("加上此图片后行宽度:"+(sum) + " 少于相册行宽度:"+this.m_AlbumContainer.clientWidth);
        // 宽度足够，直接添加到当前行
        img.style.width = w + "px";
        img.style.height = this.m_DefaultRowHeight + "px";
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
        img.style.width = w + "px";
        img.style.height = this.m_DefaultRowHeight + "px";
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

  BarrelAlbum.prototype._pushAndRenderImg = function(img){
    //
    this.m_AllImages.push(img);
    var wrapper = wrapImg( img,
                           img.dataset.title,
                           img.dataset.detail);
    // 估计添加某张图片后当前行宽度
    var sum = 0;
    for(var j=0;j<this.m_CurRow.length;j++){
      var w0 = this.m_CurRow[j].firstChild.firstChild.width * this.m_DefaultRowHeight / this.m_CurRow[j].firstChild.firstChild.height;
      sum += (w0 + this.m_Gutter[0]); 
    }
    var w = img.width * this.m_DefaultRowHeight / img.height ;
    sum += w;
    // 
    if(sum <= this.m_AlbumContainer.clientWidth){  
      console.log("加上此图片后行宽度:"+(sum) + " 少于相册行宽度:"+this.m_AlbumContainer.clientWidth);
      // 宽度足够，直接添加到当前行
      img.style.width = w + "px";
      img.style.height = this.m_DefaultRowHeight + "px";
      this.m_AlbumContainer.appendChild(wrapper);
      wrapper.style.width = w + "px";
      wrapper.style.height = this.m_DefaultRowHeight + "px";
      wrapper.setAttribute("row-index",this.m_AllRow.length);
      wrapper.style.marginBottom = this.m_Gutter[1] + "px";
      if(this.m_CurRow.length > 0)
        this.m_CurRow[this.m_CurRow.length-1].style.marginRight = this.m_Gutter[0] + "px";
      this.m_CurRow.push(wrapper);
      // if(this.m_CurRow.length >= this.m_MaxImageInRow){
      //   reduceCurRow(this.m_CurRow, this.m_AlbumContainer.clientWidth, this.m_DefaultRowHeight, this.m_Gutter);
      //   this.m_AllRow.push(this.m_CurRow);
      //   this.m_CurRow = [];
      // }
    }else{ 
      // 宽度不足，调整当前行，使其宽度为相册行宽度，然后新建一行再添加再去
      console.log("加上此图片后行宽度:"+(sum) + " 大于相册行宽度:"+this.m_AlbumContainer.clientWidth);
      img.style.width = w + "px";
      img.style.height = this.m_DefaultRowHeight + "px";
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