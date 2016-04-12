var timeID;
var treeOnPage = null;

var menuDiv;
var inputTxt;
var searchBtn;
var cleanBtn;

function initPage(){
  menuDiv = menuDiv || $("menu-div");
  inputTxt = inputTxt || $("search-txt");
  searchBtn = searchBtn || $("search-btn");
  cleanBtn = cleanBtn || $("clean-btn");

  addEventHandler(menuDiv, "click", delegateMenuEvent);
  addEventHandler(searchBtn, "click", searchRun);
  addEventHandler(cleanBtn, "click", cleanStyle);
}

function delegateMenuEvent(ev){
  var target = ev.target;
  // 展开、折叠事件
  console.log(target.tagName);
  if(target && target.tagName.toLowerCase() == "a" ){
    var node = target.parentNode.parentNode.treeNode;
    node.toggleState();
  }
  if( target && target.tagName.toLowerCase() == "i" && 
      target.parentNode.tagName.toLowerCase() == "a" ){
    var node = target.parentNode.parentNode.parentNode.treeNode;
    node.toggleState();
  }
  if( target && 
      target.tagName.toLowerCase() == "i" && 
      target.classList.contains("del-btn") ){
    var node = target.parentNode.parentNode.parentNode.treeNode;
    node.removeNode();
  }
  if( target && 
      target.tagName.toLowerCase() == "i" && 
      target.classList.contains("add-btn") ){
    var node = target.parentNode.parentNode.parentNode.treeNode;
    var data = prompt("输入插入节点的名称","Hahaha_" + Math.ceil(Math.random()*1000));
    if (data !=null && data != "") {
      node.addChild(data);
    }
  }
}

function searchRun(){
  clearTimeout(timeID);
  treeOnPage.cleanStyle();
  var data = inputTxt.value.trim();
  if(data === null || data == ""){
    alert("输入一个字符串");
    return;
  }
  if(treeOnPage === null )return ;

  var Arr = [];
  var flag = false;
  var count = 0;
  if($("dfs-radio").checked){
    treeOnPage.contains(function(node){
      Arr.push(node);
      if(node.data == data){
        flag = true;
        count ++;
      }
    },treeOnPage.traverseDF);
  }else{
    treeOnPage.contains(function(node){
      Arr.push(node);
      if(node.data == data){
        flag = true;
        count ++;
      }
    },treeOnPage.traverseBF);
  }
  
  var i = 0;
  function oneStep(){
    if( i == Arr.length){
      Arr[i-1].eleDom.classList.remove("current");
      console.log("end .................");
      if(flag){
        alert("找到" + count +"个记录");
      }else{
        alert("没有找到");
      }
      return ;
    };
    if(i>0){
      Arr[i-1].eleDom.classList.remove("current");
      if(Arr[i-1].data == data){
       // Arr[i-1].eleDom.classList.add("selected");
      }
    }
    if(Arr[i].folded == true){
      Arr[i].toggleState();
      setTimeout(oneStep, 100);
      return;
    }
    if(Arr[i].data == data){
        Arr[i].eleDom.classList.add("selected");
    }else{
      Arr[i].eleDom.classList.add("current");
    }
    i++;
    console.log(i);
    setTimeout(oneStep, 100);
  }
  oneStep();
}

function cleanStyle(){
  treeOnPage.cleanStyle();
}
function test(){
  var tree = new Tree("目录");
  tree.add("百度前端","目录",tree.traverseBF);
  tree.add("读书","目录",tree.traverseBF);

  tree.add("HTML","百度前端",tree.traverseBF);
  tree.add("Javascript","百度前端",tree.traverseBF);
  tree.add("CSS","百度前端",tree.traverseBF);
  tree.add("PHP","百度前端",tree.traverseBF);
  tree.add("C++","百度前端",tree.traverseBF);

  tree.add("三国演义","读书",tree.traverseBF);
  tree.add("水浒传","读书",tree.traverseBF);
  tree.add("西游记","读书",tree.traverseBF);
  tree.add("红楼梦","读书",tree.traverseBF);

  tree.add("第一回：宴桃园豪杰三结义 斩黄巾英雄首立功","三国演义",tree.traverseBF);
  tree.add("第二回：张翼德怒鞭督邮 何国舅谋诛宦竖","三国演义",tree.traverseBF);
  tree.add("第三回：议温明董卓叱丁原 馈金珠李肃说吕布","三国演义",tree.traverseBF);
  tree.add("第四回：废汉帝陈留践位 谋董贼孟德献刀","三国演义",tree.traverseBF);
  return tree;
}

window.onload = function(){
  initPage();
  treeOnPage = test();
  menuDiv.innerHTML = "";
  menuDiv.appendChild(treeOnPage._root.eleDom);
}