
var timeID;

var tree;
var treeDiv;
var BFSBtn;
var DFSBtn;
var inputTxt;
var searchBtn;
function $(id) {
    return document.getElementById(id);
}
function initPage(){
  treeDiv = treeDiv ||$("tree-div");
  BFSBtn = BFSBtn ||$("bfs-btn");
  DFSBtn = DFSBtn ||$("dfs-btn");
  inputTxt = inputTxt || $("input-txt");
  searchBtn = searchBtn || $("search-btn");

  addEventHandler(BFSBtn, "click", traverseBF);
  addEventHandler(DFSBtn, "click", traverseDF);
  addEventHandler(searchBtn, "click", searchRun);
}

function test(){
  tree = new Tree("0");
  tree.add(1,0,tree.traverseBF);
  tree.add(2,0,tree.traverseBF);
  tree.add(3,0,tree.traverseBF);
  tree.add(4,1,tree.traverseBF);
  tree.add(5,1,tree.traverseBF);
  tree.add(6,1,tree.traverseBF);
  tree.add(7,1,tree.traverseBF);
  tree.add(8,2,tree.traverseBF);
  tree.add(9,2,tree.traverseBF);
  tree.add(10,2,tree.traverseBF);
  tree.add(5,2,tree.traverseBF);
  tree.add(11,3,tree.traverseBF);
  tree.add(5,3,tree.traverseBF);
  treeDiv.appendChild(tree.createDOMTree());
}

function traverseAnimationRun(nodeArr){
  var i = 0;
  clearTimeout(timeID);
  function oneStep(){
    console.log("step:" + i);
    if( i < nodeArr.length){
      if( i > 0){
        nodeArr[i-1].domEle.className = "tree-node";
      }
      nodeArr[i].domEle.className="tree-node current";
      //console.log(nodeArr[i]);
      i++;
      timeID = setTimeout(oneStep, 300);
    }
  }
  oneStep(); 
}
function cleanTreeDOMState(){
  var divs = document.querySelectorAll("#tree-div .tree-node");
  for (var i = divs.length - 1; i >= 0; i--) {
    divs[i].className = "tree-node";
  }
}
function traverseBF(){
  cleanTreeDOMState();
  var nodeArr = [];
  tree.traverseBF(function (node){
    nodeArr.push(node);
  });
  traverseAnimationRun(nodeArr);
}
function traverseDF(){
  cleanTreeDOMState();
  var nodeArr = [];
  tree.traverseDF(function (node){
    nodeArr.push(node);
  });
  traverseAnimationRun(nodeArr);
}

function searchRun(){
  var searchData = inputTxt.value;
  var method ;
  var flag = false;
  var count = 0;
  var nodeArr = [];
  if(searchData == "null"){
    alert("输入查询的信息");
    return ;
  }
  cleanTreeDOMState();
  if($("dfs-radio").checked) {
    tree.contains(function(node){
      nodeArr.push(node);
      if(node.data == searchData ){
        flag = true;
        count ++;
      }
    }, tree.traverseDF);
  }else{
    tree.contains(function(node){
      nodeArr.push(node);
      if(node.data == searchData ){
        flag = true;
        count ++;
      }
    }, tree.traverseBF);
  }
  function searchAnimationRun(){
    var i = 0;
    clearTimeout(timeID);
    function oneStep(){
      console.log("step:" + i);
      if(i == nodeArr.length){
        //??? the last step
        if(!flag){
          cleanTreeDOMState();
          alert("没有找到...");
        }else{
          alert("找到" + count + "个记录");
        }
      }
      if( i < nodeArr.length){
        if( i > 0){
          if(nodeArr[i-1].data == searchData){
            nodeArr[i-1].domEle.className="tree-node selected";
          }else{
            nodeArr[i-1].domEle.className="tree-node";
          }
        }
        if(nodeArr[i].data == searchData){
          nodeArr[i].domEle.className="tree-node selected";
        }else{
          nodeArr[i].domEle.className="tree-node current";
        }
        //console.log(nodeArr[i]);
        i++;
        timeID = setTimeout(oneStep, 300);
      }
    }
    oneStep(); 
  }
  searchAnimationRun();
}
window.onload = function (){
  initPage();
  test();
}