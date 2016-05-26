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

window.onload = function(e){
  //var container = document.getElementById("puzzle-album");
  var album = PuzzleAlbum("puzzle-album");
  album.setImage(   
        [ "img/001.png", "img/002.png" ],     // imageArray
        {}                    // option
      );
  addEventHandler(addImgBtn,"click",function(e){
    album.addImage(txtImageURL.value.trim());
  });

  addEventHandler(addRanImgBtn,"click",function(e){
    var w = Math.round(200 * Math.random()) + 100;
    var h = Math.round(200 * Math.random()) + 100;
    var R = Math.floor(239 * Math.random()) + 16; 
    var G = Math.floor(239 * Math.random()) + 16; 
    var B = Math.floor(239 * Math.random()) + 16; 
    var bgColor = R.toString(16) + G.toString(16) + B.toString(16); back = R.toString(16) + G.toString(16) + B.toString(16);
    var fontColor = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16); fore = (255 - R).toString(16) + (255 - G).toString(16) + (255 - B).toString(16);
    album.addImage( "http://placehold.it/" + w + "x"+ h+"/" + bgColor +"/" + fontColor);
    // test :http://placehold.it/120x160/3399ff/ffffff
  });

  addEventHandler(fileUploadBtn,"change",function(e){
    // album.addImage(txtImageURL.value.trim());
    var target = e.target;
    var src = window.URL.createObjectURL(target.files[0]);
    console.log(src);
    album.addImage(src);
    
  });

}