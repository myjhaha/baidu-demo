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
function randomInt(n,m){
  return Math.floor(Math.random()*(m-n)) + n;
}
function random(n,m){
  return (Math.random()*(m-n)) + n;
}