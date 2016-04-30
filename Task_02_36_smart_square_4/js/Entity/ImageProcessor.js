function ImageProcessor(){
  //私有的？
  var iCanvas = document.createElement("canvas"),
  var iCtx = iCanvas.getContext("2d");
  var img = null;
  this.loadImg = function(url){
    img = new Image();
    img.src = "./img/earth.png";
  }
}