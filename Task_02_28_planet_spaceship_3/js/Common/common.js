/**
 * getElementById
 */
function $(id) { return document.getElementById(id);}
/**
 * 事件绑定
 */
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}
// img loading... fuck..
function preImage(url,callback){  
  var img = new Image(); //创建一个Image对象，实现图片的预下载  
  img.src = url;  
  if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
    callback.call(img);  
    return; // 直接返回，不用再处理onload事件  
  }
  img.onload = function () { //图片下载完毕时异步调用callback函数。  
    callback.call(this,img);//将回调函数的this替换为Image对象  
  };  
}  
function getRadioValue(name){
  var v = null;
  var radios = document.getElementsByName(name);
  for (var i = radios.length - 1; i >= 0; i--) {
    if(radios[i].checked){
      v = radios[i].value;
    }
  };
  return v;
}

function IntToBinary(num){
  var s = (+num).toString(2);
  if(s.length < 8){
    s  = (Array(8-s.length+1).join("0") + s)
  }
  return s;
}
function StateToBinary(state){
  switch(state){
    case "work":
      return "00000001";
    case "stop":
      return "00000010";
    case "destroy":
      return "11111100";
    default:
      return "00000000";
  }
}
function CommandToBrinary(command){
  switch(command){
    case "work":
      return "00000001";
    case "stop":
      return "00000010";
    case "destroy":
      return "11111100";
    default:
      return "00000000";
  }
}
// function JsonToBinary(commandObj){
//   return IntToBinary(commandObj.id)+CommandToBrinary(commandObj.command);
// }

// function BinaryToJson(binaryStr){
//   var _id = parseInt(binaryStr.substr(0,8),2);
//   var _command = "";
//   switch(binaryStr.substr(8)){
//     case "00000001":
//       command="work";
//       break;
//     case "00000010":
//       command="work";
//       break;
//     case "11111100":
//       command="destroy";
//       break;
//   } 
//   return {id:_id, command:_command};
// }



var greenColor = 'rgba(64,255,64,0.6)';
var yellowColor = 'rgba(255,255,0,0.4)';