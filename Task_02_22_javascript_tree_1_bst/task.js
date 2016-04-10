
/*
var node = {
  value:125,
  left:null,
  right:null
};
*/
// 没用的
function _TEST_(){
  var bst = new BinarySearchTree();
  bst.add(50);bst.add(20);bst.add(25);bst.add(30);bst.add(35);
  bst.add(33);bst.add(34);bst.add(60);bst.add(55);bst.add(10);
  bst.add(5);bst.add(0);bst.add(-1);bst.add(3);bst.add(7);bst.add(8);
  bst.add(9);bst.add(2);bst.add(1);bst.add(0.5);bst.test();

  alert(bst.remove(20));bst.test();
  alert(bst.remove(25));bst.test();
  alert(bst.remove(50));bst.test();
  alert(bst.remove(50));bst.test();
}

/**
 * 事件插入浏览器兼容
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

var preOrderBtn;
var inOrderBtn;
var postOrderBtn;
var treeDiv;

var bst;

function initPage(){
  preOrderBtn = preOrderBtn || document.getElementById("pre-order-btn");
  inOrderBtn = inOrderBtn || document.getElementById("in-order-btn");
  postOrderBtn = postOrderBtn || document.getElementById("post-order-btn");
  treeDiv = treeDiv || document.getElementById("tree-div");
  addEventHandler(preOrderBtn,"click",preOrderAnimationRun);
  addEventHandler(inOrderBtn,"click",inOrderAnimationRun);
  addEventHandler(postOrderBtn,"click",postOrderAnimationRun);
}

function preOrderAnimationRun(){
  var res = bst.createDOMTree("preOrder");
  treeDiv.innerHTML="";
  treeDiv.appendChild(res.domTree);
  traverseAnimation(res.domArr);
}
function inOrderAnimationRun(){
  var res = bst.createDOMTree("inOrder");
  treeDiv.innerHTML="";
  treeDiv.appendChild(res.domTree);
  traverseAnimation(res.domArr);
}
function postOrderAnimationRun(){
  var res = bst.createDOMTree("postOrder");
  treeDiv.innerHTML="";
  treeDiv.appendChild(res.domTree);
  traverseAnimation(res.domArr);
}



window.onload = function(){
  initPage();
  bst = new BinarySearchTree();

  bst.add(50);bst.add(20);bst.add(25);bst.add(30);
  bst.add(35);bst.add(33);bst.add(34);bst.add(60);
  bst.add(55);bst.add(10);bst.add(5);bst.add(0);
  bst.add(-1);bst.add(3);bst.add(7);bst.add(8);
  bst.add(9);bst.add(2);bst.add(1);bst.add(0.5);

  bst.test();
  //bst.render(treeDiv);
  var res = bst.createDOMTree("preOrder");
  treeDiv.appendChild(res.domTree);

}