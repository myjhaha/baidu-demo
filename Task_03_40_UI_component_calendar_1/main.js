
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

window.onload = function(e){
  var calender = new Calendar(); 
  var container = $("#container");
  var updateBtn = $("#update-date-btn");
  container.appendChild(calender.getDOMTree()); 
  addEventHandler(updateBtn,"click",function(e){
    var txt = $("#selected-date");
    var d = calender.getSelectedDate();
    txt.innerHTML = (d.getFullYear()+"年" + (d.getMonth()+1) + "月" + d.getDate() + "日");
  });
}