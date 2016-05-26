var $ = function(eleId){
  return document.querySelector(eleId);
}

var container = $("#container");
function test(){
  var calender = new Calendar(); 
  container.appendChild(calender.getDOMTree()); 

  calender.setSelectedDate("2013-106sas-02");
}

function test2(){
  var d = new Date("2016-05-01");
  console.log(d.getDay());
  var d2 = new Date(d);
  d2.setDate(0);
  console.log(d);
  console.log(d2);
}

window.onload = function(e){
 // test2();
  test();
}