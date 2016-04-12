var timeID;
// data
var tree;

var treeDiv;
var BFSBtn;
var DFSBtn;
var inputTxt;
var searchBtn;
var addBtn;
var delBtn;

function $(id) { return document.getElementById(id);}
function initPage(){
  treeDiv = treeDiv ||$("tree-div");
  BFSBtn = BFSBtn ||$("bfs-btn");
  DFSBtn = DFSBtn ||$("dfs-btn");
  inputTxt = inputTxt || $("input-txt");
  searchBtn = searchBtn || $("search-btn");
  addBtn = addBtn ||$("add-btn");
  delBtn = delBtn ||$("del-btn");

  addEventHandler(BFSBtn, "click", traverseBF);
  addEventHandler(DFSBtn, "click", traverseDF);
  addEventHandler(searchBtn, "click", searchRun);
  addEventHandler(addBtn, "click", addNode);
  addEventHandler(delBtn, "click", delNode);
  addEventHandler(treeDiv, "click", delegateClickEvent);
  
}
//
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
///
function traverseAnimationRun(nodeArr){
  var i = 0;
  clearTimeout(timeID);
  function oneStep(){
    console.log("step:" + i);
    if( i < nodeArr.length){
      if( i > 0){
        nodeArr[i-1].domEle.classList.remove("current");
      }
      nodeArr[i].domEle.classList.add("current");
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

function delegateClickEvent(e){
  var target = e.target;
  if( target && 
      target.tagName =="DIV" && 
      target.classList.contains("tree-node") ){
    //console.log(treeDiv.querySelectorAll(".tree-node"));
    if(target.classList.contains("clicked"))
      target.classList.remove("clicked");
    else{
      var a = treeDiv.querySelectorAll(".tree-node");
      for (var i = a.length - 1; i >= 0; i--) {
        a[i].classList.remove("clicked");
      };
      target.classList.add("clicked");
    }
  }
}

function addNode(){
  clearTimeout(timeID);
  var inputData = inputTxt.value.trim();
  if(!inputTxt){
    alert("请输入插入的信息");
    return;
  }
  if(treeDiv.innerHTML == ""){
    tree = new Tree(inputData);
    treeDiv.appendChild(tree.createDOMTree());
    return ;
  }
  var ele = treeDiv.querySelector(".clicked");
  if(!ele){
    alert("请选中插入的节点");
    return ;
  }
  tree.contains(function(node){
    if(node.domEle == ele){
      var newNode = new Node(inputData);
      newNode.parent = node;
      node.children.push(newNode);
      treeDiv.innerHTML = "";
      treeDiv.appendChild(tree.createDOMTree());
    }
  },tree.traverseBF);
}
function delNode(){
  clearTimeout(timeID);
  var ele = treeDiv.querySelector(".clicked");
  if(!ele){
    alert("请选中删除的节点");
    return ;
  }
  var res;
  tree.contains(function(node){
    if(node.domEle == ele){
      var parent = node.parent;
      if(parent){
        for (var i = parent.children.length - 1; i >= 0; i--) {
          if(parent.children[i] == node){
            res = parent.children.splice(i,1);
            treeDiv.innerHTML="";
            treeDiv.appendChild(tree.createDOMTree());
          }
        };
      }else{
        treeDiv.innerHTML="";
      }
    }
  },tree.traverseBF);
}
window.onload = function (){
  initPage();
  test();
}