/**
 * 一些有用的函数
 */
;(function(window){

  if(typeof window.$ === 'undefined'){
    window.$ = function(eleId){
      return document.querySelector(eleId);
    }
  }

  if(typeof window.addEventHandler === 'undefined'){
    window.addEventHandler = function(element, ev, handler){
      if(element.addEventListener){
        element.addEventListener(ev,handler,false);
      }else if(element.attachEvent){
        element.attachEvent("on" + ev, handler);
      }else{
        element["on" + ev] = handler;
      }
    }
  }

  
})(window);