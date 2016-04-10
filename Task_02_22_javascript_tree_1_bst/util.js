function Node(val) {
    this.value = val;
    this.parent = null;
    this.left = null;
    this.right = null;
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
  traverse: function(order, process){
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
    function preOrder(node){
      if(node){
        process.call(this,node);
        if(node.left !== null){
          inOrder(node.left);
        }
        if(node.right !== null){
          inOrder(node.right);
        }
      }
    }
    function postOrder(node){
      if(node){
        if(node.left !== null){
          inOrder(node.left);
        }
        if(node.right !== null){
          inOrder(node.right);
        }
        process.call(this,node);
      }
    }
    switch(order){
      case "inOrder":
        inOrder(this._root);
      break;
      case "preOrder":
        preOrder(this._root);
      break;
      case "postOrder":
        postOrder(this._root);
      break;
    }
  },
  size: function(){
    var len = 0;
    this.traverse("inOrder", function(node){
      len ++ ;
    });
    return len;
  },
  toArray:function(){
    var arr = [];
    this.traverse("inOrder", function(node){
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
  add: function(value){
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
  },
  remove: function(value){
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
  },
  render: function(target){
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

/**
 * 运行动画
 */
var timeHook;
function traverseAnimation(elementArr){
  var i = 0;
  clearTimeout(timeHook);
  function oneStep(){
    console.log(i);
    elementArr[i].className="tree-node emphasis";
    if(i > 0 )
      elementArr[i-1].className = "tree-node";

    i++;
    if( i < elementArr.length){
      timeHook = setTimeout(oneStep, 500);
    }
  }
  oneStep();
}

/**
 * 按某种方式遍历树,并创建一棵DOM树,
 * 返回DOM树  以及走过的DOM element节点顺序数组，
 * 顺便返回走过的TreeNode
 * retrun { domTree:Tree, domArr:[], nodeArr:[] };
 */
BinarySearchTree.prototype.createDOMTree = function ( order ){
  var elementTree = null;
  var elementArr = [];
  var nodeArr = [];
  function process(node,curEle){
    var t = document.createTextNode(node.value);
    curEle.appendChild(t);
    curEle.className = "tree-node";
    elementArr.push(curEle);
    nodeArr.push(node);
  }
  function inOrder(node, curEle){
    if(node){
      if(node.left !== null){
        var n = document.createElement("div");
        curEle.appendChild(n);
        inOrder(node.left, n);
      }
      process(node,curEle);
      if(node.right !== null){
        var n = document.createElement("div");
        n.className = "tree-node";
        curEle.appendChild(n);
        inOrder(node.right, n);
      }
    }
  }
  function preOrder(node, curEle){
    if(node){
      process(node,curEle);
      if(node.left !== null){
        var n = document.createElement("div");
        curEle.appendChild(n);
        preOrder(node.left, n);
      }
      if(node.right !== null){
        var n = document.createElement("div");
        n.className = "tree-node";
        curEle.appendChild(n);
        preOrder(node.right, n);
      }
    }
  }
  function postOrder(node, curEle){
    if(node){
      if(node.left !== null){
        var n = document.createElement("div");
        curEle.appendChild(n);
        postOrder(node.left, n);
      }
      if(node.right !== null){
        var n = document.createElement("div");
        n.className = "tree-node";
        curEle.appendChild(n);
        postOrder(node.right, n);
      }
      process(node,curEle);
    }
  }
  switch(order){
    case "inOrder":
      var r = this._root;
      elementTree = document.createElement("div");
      inOrder(r,elementTree);
    break;
    case "preOrder":
      var r = this._root;
      elementTree = document.createElement("div");
      preOrder(r,elementTree);
    break;
    case "postOrder":
      var r = this._root;
      elementTree = document.createElement("div");
      postOrder(r,elementTree);
    break;
  }
  return { domTree:elementTree, domArr: elementArr, nodeArr:nodeArr };
}





