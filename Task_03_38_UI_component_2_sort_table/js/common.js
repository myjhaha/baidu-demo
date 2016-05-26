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
function randomNum (n,m){
  return (Math.random()*(m-n)+n).toFixed(2);
}
function randomIntStr(from,to){
  var i = Math.floor(Math.random()*(to-from+1)+from);
  var str = (i<10)?("00"+i):((i<99)?("0"+i):(""+i));
  return str;
}

//---- 测试数据也放这里算了 ----//
var testData = {
  head:["学号","姓名","语文","数学","英文","地理","政治","物理"],
  data:[
    ["001","大阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["002","二阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["003","三阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["004","四阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["005","五阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["006","六阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["007","七阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["008","八阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["009","九阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["010","十阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["011","十一阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["012","十二阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["013","十三阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["014","十四阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["015","十五阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["016","十六阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["017","十七阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["018","十八阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)],
    ["019","十九阿哥",randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100),randomNum(60,100)]
  ]
}

