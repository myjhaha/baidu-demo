var $ = function(eleId){
  return document.querySelector(eleId);
}
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}

var addImgBtn = $("#add-img-btn");
var txtImageURL = $("#img-url-txt");
var addRanImgBtn = $("#add-random-img-btn");
var fileUploadBtn = $("#file-upload");
var addColBtn = $("#add-col-btn");
var gutterChangeSlider = $("#gutter-slider");




var barrelAlbum = new BarrelAlbum({
    id:"barrel-album-root-2", 
    min:5, 
    max:6, 
    gutter:[3,3], 
    rowheight:150
  });
var Model = new ImageModel({NumberOfImgInOnePage:20});

window.onload = function(e){

  var imgJSONs = Model.getNewPageImageJSONs()
  console.log(imgJSONs);
  barrelAlbum.setImageWithJSON(imgJSONs);

  //-- 滚动页面事件响应 --//
  addEventHandler(window,"scroll",function(e){
    if(barrelAlbum.isLocking()){
      console.log("相册正在加载图片中，先不执行新的加载任务");
      return;
    }
    addImg();
  });
  
  //-- 修改间距 --//
  var gTxt = document.getElementById("gutter-span");
  addEventHandler(gutterChangeSlider,"change",function(e){
    var target  = e.target;
    //console.log(target.value);
    barrelAlbum.setGutter(target.value);
    gTxt.innerHTML = target.value;
  });
  //test();
}

///////////////////////////////////////////
  





//-- 添加图片的回调函数 --//
/**
 * 一直加到看不到相册的询问为止，在window.onscroll中调用最好
 */
function addImg(e){               
  // if(barrelAlbum.isScrollToBottom()){
  //   console.log("看到底部了，要继续加载新图片");
  //   barrelAlbum.addImage(Model.getOneImageJSONsByRandom());
  // }else{
  //   console.log("足够多图了，先不加载");
  // }
  if(barrelAlbum.isScrollToBottom()){
    console.log("看到底部了，要继续加载新图片");
    barrelAlbum.addImageWithJSON(Model.getNewPageImageJSONs());
  }
  else{
    console.log("足够多图了，先不加载");
  }
}