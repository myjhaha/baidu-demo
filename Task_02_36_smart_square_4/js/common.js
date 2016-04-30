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
function getChatLength(str){
  var len = 0;
  var s = str.trim();
  for(var i = 0;i<s.length;i++){
    var chatCode = s.charCodeAt(i);
    if(chatCode >= 0 && chatCode <= 128){
      len += 1;
    }else{
      len += 2;
    }
  }
  return len;
}
// 0 close
// 1 open
// 2 end Node
function markPos (x,y,flag,debug){
  if(debug){
    switch(flag){
      case 0:
        View.setColorAt(x,y, "rgba(256,0,0,0.2)");
        break;
      case 1:
        View.setColorAt(x,y, "rgba(0,256,0,0.2)");
        break;
      case 2:
        View.setColorAt(x,y, "rgba(0,0,256,0.5)");
        break;
      default:
        break;
    }
  }
}
function getDirection(from, to){
  if(from[1] - to[1] === 1 ){
    return Direction.UP;
  }
  if(from[1] - to[1] === -1){
    return Direction.DOWN;
  }
  if(from[0] - to[0] === 1){
    return Direction.LEFT;
  }
  if(from[0] - to[0] === -1){
    return Direction.RIGHT;
  }
}