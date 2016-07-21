/**
 * 图片数据Model 原型
 *
 */

;(function(window) {

  function ImageModel(opts){

    this.init(opts);
  }
  ImageModel.prototype.init = function(opts){
    if(typeof opts === 'undefined'){ opts = {}; }

    //-- 每页图片数 --//
    this.m_iNumberOfImgInOnePage = opts.NumberOfImgInOnePage || 30;
    //-- 图片服务器源 --//
    this.m_sImageWebServiceURL = opts.WebServiceURL || "http://placehold.it/";
    //-- 存放得到的图片信息 --//
    this.m_pImageDataAll = [];
  }
  /**
   * 取n个新数据
   */
  ImageModel.prototype.getImageJSONs = function(n){
    var res = [];
    while(n--){
      var obj = this.getOneImageJSONsByRandom();
      res.push(obj);
    } 
    return  res;
  }
  /**
   * 取一页新数据
   */
  ImageModel.prototype.getNewPageImageJSONs = function(){
    var len = this.m_iNumberOfImgInOnePage;
    var res = [];
    while(len--){
      var obj = this.getOneImageJSONsByRandom();
      res.push(obj);
    } 
    return  res;
  }
  /**
   * 取一个新数据
   */
  ImageModel.prototype.getOneImageJSONsByRandom = function(){
     var w = Math.round(200 * Math.random()) + 100;
      var h = Math.round(200 * Math.random()) + 100;
      var R = Math.floor(239 * Math.random()) + 16; 
      var G = Math.floor(239 * Math.random()) + 16; 
      var B = Math.floor(239 * Math.random()) + 16; 
      var bgColor = R.toString(16) + G.toString(16) + B.toString(16); back = R.toString(16) + G.toString(16) + B.toString(16);
      var fontColor = (R>127?16:255).toString(16) + 
                      (G>127?16:255).toString(16) + 
                      (B>127?16:255).toString(16); 
      //fore = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16);
      var url = (this.m_sImageWebServiceURL+""+ w + "x"+ h+"/" + bgColor +"/" + fontColor );
      var obj = { url     :  url,
                  title   :  "Title " + Math.floor((Math.random()*1000)),
                  detail  :  "detail detail detail detail",
                  width   :  w,
                  height  :  h
                }
      return obj;
  }



  //-- 对外可使用的原型 --//
  if (typeof window.ImageModel === 'undefined') {
    window.ImageModel = function (opts){
      return new ImageModel(opts);
    }
  }
})(window);