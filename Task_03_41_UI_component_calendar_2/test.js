var $ = function(eleId){
  return document.querySelector(eleId);
}

var container = $("#container");

function test(){
 // new Calendar().init({id:"#calendar-input"});
 new Calendar({ 
                date:"2011-01-01",
                id:"#calendar-input"  
              });
}


window.onload = function(e){
 // test2();
  test();
}