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


window.onload = function(e){
  var album = WaterfallAlbum("water-fall-album-container");
  var imgJSON_1 = {
                    url:"img/001.png", 
                    title:"This is Title 1", 
                    detail:"detail detail detail"
                  } ;
  var imgJSON_2 = {
                    url:"img/002.png", 
                    title:"This is Title 2", 
                    detail:"detail detail detail"
                  } ;
  var imgJSON_3 = {
                    url:"img/003.png", 
                    title:"This is Title 3", 
                    detail:"detail detail detail"
                  } ;
  var imgJSON_4 = {
                    url:"img/004.png", 
                    title:"This is Title 4", 
                    detail:"detail detail detail"
                  } ;

  album.setImage(
      // imageArray
      [ imgJSON_1, imgJSON_2, imgJSON_3, imgJSON_4 ],  
      // option   
      {                                                 
        column: 4,
        gutter: [6,6]
      }                   
    );
  //---- 初始化页面的一些区域 ----//
  document.getElementById("column-num").innerHTML = album.getColumnsNum().toString();
  document.getElementById("gutter-span").innerHTML = album.getGutter()[0];
  gutterChangeSlider.value = album.getGutter()[1];
  //---- 外部操作事件 ----//
  //-- 给出超连接添加图片 --//
  addEventHandler(addImgBtn,"click",function(e){
    var url = txtImageURL.value.trim();
    album.addImage( {  url:url, 
                      title:"Title " + Math.floor((Math.random()*100)), 
                      detail:"detail detail detail"}  );
  });

  //-- 随机从图片测试网站添加 --//
  addEventHandler(addRanImgBtn,"click",function(e){
    // var w = Math.round(200 * Math.random()) + 100;
    // var h = Math.round(200 * Math.random()) + 100;
    // var R = Math.floor(239 * Math.random()) + 16; 
    // var G = Math.floor(239 * Math.random()) + 16; 
    // var B = Math.floor(239 * Math.random()) + 16; 
    // var bgColor = R.toString(16) + G.toString(16) + B.toString(16); back = R.toString(16) + G.toString(16) + B.toString(16);
    // var fontColor = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16); fore = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16);
    // var url = ("http://placehold.it/" + w + "x"+ h+"/" + bgColor +"/" + fontColor );
    // album.addImage( {  url: url, 
    //                   title:"Title " + Math.floor((Math.random()*100)), 
    //                   detail:"detail detail detail"}  );
    // test :http://placehold.it/120x160/3399ff/ffffff
    album.addImage(getNewRandomImageJSON());
  });

  //-- 从本地添加 一次可多个 自动筛选 --//
  addEventHandler(fileUploadBtn,"change",function(e){
    var target = e.target;
    var imgToAdd = [];
    for(var i=0;i<target.files.length;i++){
      if(target.files[i].name.match( /.jpg$|.gif$|.png$|.bmp$|.jpeg$/i )){
        var url = window.URL.createObjectURL(target.files[i]);
        imgToAdd.push( {  url:url, 
                          title:"Title " + Math.floor((Math.random()*100)), 
                          detail:"detail detail detail"}  );
      }else{
        console.log("File:"+target.files[i].name+" 不是图片");
      }
    }
    album.addImage(imgToAdd);
  });

  //-- 加一列并重排 --//
  addEventHandler(addColBtn,"click",function(e){
    album.addColumn();
    document.getElementById("column-num").innerHTML = album.getColumnsNum().toString();
  });

  //-- 修改间距 --//
  var gTxt = document.getElementById("gutter-span");
  addEventHandler(gutterChangeSlider,"change",function(e){
    var target  = e.target;
    //console.log(target.value);
    album.setGutter(target.value);
    gTxt.innerHTML = target.value;
  });

  //-- 滚动页面事件响应 --//
  addEventHandler(window,"scroll",function(e){
    function addImg(e){               // 回调函数
      if(album.isScrollToBottom()){
        console.log("看到底部了，要继续加载新图片");
        album.addImage(getNewRandomImageJSON(),addImg);
      }else{
        console.log("足够多图了，先不加载");
      }
    }
    addImg();
  });
  

  test();
}

function test(){
  //console.log(document.body);
}
function getNewRandomImageJSON(){
  var w = Math.round(200 * Math.random()) + 100;
    var h = Math.round(200 * Math.random()) + 100;
    var R = Math.floor(239 * Math.random()) + 16; 
    var G = Math.floor(239 * Math.random()) + 16; 
    var B = Math.floor(239 * Math.random()) + 16; 
    var bgColor = R.toString(16) + G.toString(16) + B.toString(16); back = R.toString(16) + G.toString(16) + B.toString(16);
    var fontColor = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16); fore = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16);
    var url = ("http://placehold.it/" + w + "x"+ h+"/" + bgColor +"/" + fontColor );
    return {  url: url, 
                      title:"Title " + Math.floor((Math.random()*100)), 
                      detail:"detail detail detail"}  ;
}