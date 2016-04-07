
/*
var node = {
  value:125,
  left:null,
  right:null
};
*/
function Node(val) {
    this.value = val;
    this.parent = null;
    this.left = null;
    this.right = null;
    //this.pre = null;
    //this.next = null;
}

function next (node){
  var current;
  if(node === null)return null;
  if(node.right !== null) {
    current = node.right;
    while(current.left != null){
      current = current.left;
    }
    return current;
  }
  if(node.parent === null) return null;
  current = node;
  while(current.parent !== null){
    if(current.parent.left == current){
      return current.parent;
    }
    current = current.parent;
  }
  return null;
}

function pre(node){
  var current;
  if(node === null)return null;
  if(node.left !== null) {
    current = node.left;
    while(current.right !== null){
      current = current.right;
    }
    return current;
  }
  if(node.parent === null) return null;
  current = node;
  while(current.parent !== null){
    if(current.parent.right == current){
      return current.parent; 
    }
    current = current.parent;
  }
  return null;
}

function BinarySearchTree(){
  this._root = null;
}
BinarySearchTree.prototype = {
  constructor: BinarySearchTree,
  add: function(value){
  },
  remove: function(value){

  },
  contains: function(value){
    var found = false;
    var current = this._root;
    while(!found && current){
      if (value < current.value){
        current = current.left;
      }else if(value > current.value){
        current = current.right;
      }else{
        found = true;
      }
    }
    return found;
  },
  find: function(value){
    var found = false;
    var current = this._root;
    while(!found && current){
      if (value < current.value){
        current = current.left;
      }else if(value > current.value){
        current = current.right;
      }else{
        found = true;
        return current;
      }
    }
    return null;
  },
  traverse: function(process){
    // helper function
    function inOrder(node){
      if(node){
        if(node.left !== null){
          inOrder(node.left);
        }
        process.call(this,node);
        if(node.right !== null){
          inOrder(node.right);
        }
      }
    }
    inOrder(this._root);
  },
  size: function(){
    var len = 0;
    this.traverse(function(node){
      len ++ ;
    });
    return len;
  },
  toArray:function(){
    var arr = [];
    this.traverse(function(node){
      arr.push(node.value);
    });
    return arr;
  },
  toString: function(){
    return this.toArray().toString();
  },
  first: function(){
    var current = this._root;
    while(current.left !== null){
      current = current.left;
    }
    return current;
  },
  last: function(){
    var current = this._root;
    while(current.right !== null){
      current = current.right;
    }
    return current;
  },
  test: function(){
    var f = this.first();
    var e = this.last();
    var str = "";

    var current = f;
    str = "Order: ";
    while(current !== null){
      str += ("[" +current.value + "] ");
      current = next(current);
    }
    console.log(str);

    var current = e;
    str = "Desc: ";
    while(current !== null){
      str += ("[" +current.value + "] ");
      current = pre(current);
    }
  }
}
BinarySearchTree.prototype.add = function(value){
  var current;
  var node = new Node(value) ;
  /*
  var node = {  value: value,
                left: null,
                right: null,
                parent: null }; */
  if(this._root === null){
    this._root = node;
  }else{
    current = this._root;
    while(true){
      if(value < current.value){
        if(current.left === null){
          node.parent = current;
          current.left = node;
          break;
        }else{
          current = current.left;
          continue;
        }
      }else if(value > current.value){
        if(current.right === null){
          node.parent = current;
          current.right = node;
          break;
        }else{
          current = current.right;
          continue;
        }
      }else{ //value === current.value
        break;
      }
    }
  }
}
BinarySearchTree.prototype.remove = function(value){
  var toRemove = this.find(value);
  if(toRemove === null) return false;
  var r = this._root;
  function _remove(bst, node){
    if(node === null) return null;
    //1
    if(node.left === null && node.right ===null){
      if(node.parent === null){
        bst._root = null;
        return true;
      }
      if(node.parent.left == node)
        node.parent.left = null;
      else
        node.parent.right = null;
      return true;
    }
    //2
    if(node.left !== null && node.right === null){
      if(node.parent === null){
        bst._root = node.left;
        node.left.parent = null;
        return true;
      }
      if(node.parent.left == node)
        node.parent.left = node.left;
      else
        node.parent.right = node.left;
      node.left.parent = node.parent;
      return true;
    }
    //3
    if(node.left === null && node.right !== null){
      if(node.parent === null){
        bst._root = node.right;
        node.right.parent = null;
        return true;
      }
      if(node.parent.left == node)
        node.parent.left = node.right;
      else
        node.parent.right = node.right;
      node.right.parent = node.parent;
      return true;
    }
    //4
    var nextNode = next(node);
    node.value = nextNode.value;
    return _remove(bst, nextNode);
  }
  return _remove(this, toRemove);
}
BinarySearchTree.prototype.render = function(target){
  var str = "";
  var r = this._root;
  //helper
  function _render(node){
    if(node !== null){
      str += ("<div class=\"tree-node\">" + node.value);
      _render(node.left);
      _render(node.right);
      str += "</div>";
    }
  }
  _render(r);
  target.innerHTML = str;
}

function _TEST_(){
  var bst = new BinarySearchTree();
  bst.add(50);
  bst.add(20);
  bst.add(25);
  bst.add(30);
  bst.add(35);
  bst.add(33);
  bst.add(34);
  bst.add(60);
  bst.add(55);
  bst.add(10);
  bst.add(5);
  bst.add(0);
  bst.add(-1);
  bst.add(3);
  bst.add(7);
  bst.add(8);
  bst.add(9);
  bst.add(2);
  bst.add(1);
  bst.add(0.5);
  bst.test();

  alert(bst.remove(20));
  bst.test();
  alert(bst.remove(25));
  bst.test();
  alert(bst.remove(50));
  bst.test();
  alert(bst.remove(50));
  bst.test();
  alert(bst.remove(50));
  bst.test();
  alert(bst.remove(50));
  bst.test();
}


var dlrBtn;
var ldrBtn;
var lrdBtn;
var treeDiv;

function initPage(){
  dlrBtn = dlrBtn || document.getElementById("dlr-btn");
  ldrBtn = ldrBtn || document.getElementById("ldr-btn");
  lrdBtn = lrdBtn || document.getElementById("lrd-btn");
  treeDiv = treeDiv || document.getElementById("tree-div");
}


window.onload = function(){
  initPage();
  var bst = new BinarySearchTree();

  bst.add(50);
  bst.add(20);
  bst.add(25);
  bst.add(30);
  bst.add(35);
  bst.add(33);
  bst.add(34);
  bst.add(60);
  bst.add(55);
  bst.add(10);
  bst.add(5);
  bst.add(0);
  bst.add(-1);
  bst.add(3);
  bst.add(7);
  bst.add(8);
  bst.add(9);
  bst.add(2);
  bst.add(1);
  bst.add(0.5);
  bst.test();

  bst.render(treeDiv);
}