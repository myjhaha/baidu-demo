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

//展示用DIV
var container = $("#container");


function test(){
  var cal1 = new Calendar({ 
                date:"1980-01-01",
                id:"#calendar-input-1"  
               });
  var cal2 = new Calendar({ 
                date:"2000-01-01",
                id:"#calendar-input-2"  
               });
  var cal3 = new Calendar({ 
                date:"2016-01-01",
                id:"#calendar-input-3"  
               });
  var updateBtn = $("#update-date-btn");
  addEventHandler(updateBtn,"click",function(e){
    var txt1 = $("#selected-date-1");
    var txt2 = $("#selected-date-2");
    var txt3 = $("#selected-date-3");
    var d1 = cal1.getSelectedDate();
    var d2 = cal2.getSelectedDate();
    var d3 = cal3.getSelectedDate();
    txt1.innerHTML = (d1.getFullYear()+"年" + (d1.getMonth()+1) + "月" + d1.getDate() + "日");
    txt2.innerHTML = (d2.getFullYear()+"年" + (d2.getMonth()+1) + "月" + d2.getDate() + "日");
    txt3.innerHTML = (d3.getFullYear()+"年" + (d3.getMonth()+1) + "月" + d3.getDate() + "日");
  });
}


window.onload = function(e){
  test();
}