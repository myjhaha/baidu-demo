
function PriorityQueue(compareCallback){
  var m_Arr = [0];
  var compare = compareCallback;
  function HeapAdjustDown(Arr,s,m){
    var cur = Arr[s];
    for(var j = 2*s; j<=m; j*=2){
      if(j < m &&  compare(Arr[j], Arr[j+1]) < 0 ){
        j++;
      }
      if( compare(Arr[j], cur) < 0){
        break;
      }
      Arr[s] = Arr[j];
      s = j;
    }
    Arr[s] = cur;
  };
  function HeapAdjustUp(Arr,s){
    var cur = Arr[s];
    for(var j = Math.floor(s/2);  j>=1 ; j=Math.floor(j/2) ){
      if( compare(Arr[j], cur) < 0){
        Arr[s] = Arr[j];
        s = j;
      }else{
        break;
      }
    }
    Arr[s] = cur;
  };
  function _updateItem (Arr, e, cmpFun){
    var n = Arr.indexOf(e);
    if(n !== -1){
      HeapAdjustDown(Arr,n,Arr[0]);
      HeapAdjustUp(Arr,n);
    }
  }
  this.updateItem = function(e){
    _updateItem(m_Arr,e,this.compare);
  }
  this.push = function(e){
    m_Arr.push(e);
    m_Arr[0]++;
    HeapAdjustUp(m_Arr,m_Arr[0]);
  };
  this.shift = function(){
    if(m_Arr[0] == 0){
      return null;
    }
    var tmp = m_Arr[1];
    m_Arr[1] = m_Arr[m_Arr[0]];
    m_Arr[m_Arr[0]] = tmp;
    tmp = m_Arr.pop();
    m_Arr[0]--;
    if(m_Arr[0] > 1)
      HeapAdjustDown(m_Arr, 1, m_Arr[0]);
    return tmp;
  };
  this.isEmpty = function(){
    if(m_Arr[0] == 0){
      return true;
    }else{
      return false;
    }
  };
  this.first = function(){
    if(m_Arr[0] <= 0)
      return null;
    else
      return m_Arr[1];
  };
  this.toString = function(){
    return  m_Arr.toString();
  };
  this.getLength = function(){
    return  m_Arr[0];
  };
}

function Queue(){
  var m_Arr = [];
  this.updateItem = function(e){
    // do nothing
  }
  this.push = function(e){
    m_Arr.push(e);
  };
  this.pop = function(){
    if(m_Arr.length == 0){
      return null;
    }
    return m_Arr.pop();
  }
  this.shift = function(){
    if(m_Arr.length == 0){
      return null;
    }
    return m_Arr.shift();
  };
  this.isEmpty = function(){
    return m_Arr.length == 0
  };
  this.first = function(){
    if(m_Arr.length <= 0)
      return null;
    else
      return m_Arr[0];
  };
  this.toString = function(){
    return  m_Arr.toString();
  };
  this.getLength = function(){
    return  m_Arr.length;
  };
}
function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
}
function random(n,m){
  return Math.floor(Math.random()*(m-n)) + n;
}