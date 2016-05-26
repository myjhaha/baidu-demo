//--------------- SortableTable 原型 ---------------------//
//--------------------------------------------------------//
function SortableTable(_data){
  var m_TableHeads = _data.head;
  var m_TableData = _data.data;
  var m_SortableTableDOM = document.createElement("table");
  m_SortableTableDOM.className="sortable-table";
  _render(m_SortableTableDOM); //new时直接调用啦

  //私有的，根据列进行二维数组的排序
  function _sortArray2DByColIndex(arr2D,colIndex,cmpFun){
    //a排在b前面要满足什么条件？ 
    var __cmp = cmpFun || function(a,b){  
      return a[colIndex] - b[colIndex] < 0;
    }
    //部分排序
    function __partition(arr2D, p, r){
      var i=p-1;
      var tmp;
      for(var j=p;j<r;j++){
        if( __cmp(arr2D[j],arr2D[r]) ){
          tmp = arr2D[++i];
          arr2D[i] = arr2D[j];
          arr2D[j] = tmp;
        }
      }
      tmp = arr2D[++i];
      arr2D[i] = arr2D[r];
      arr2D[r] = tmp;
      return i;
    }
    //快排主程
    function __qsort(arr2D, p, r){
      if(p<r){
        var q = __partition(arr2D,p,r);
        __qsort(arr2D, p, q-1);
        __qsort(arr2D, q+1, r);
      }
    }
    __qsort(arr2D,0,arr2D.length-1);
  }
  //私有方法，触发事件后回调此方法，从target中取得进行排序的列，通过比较函数进行排序
  //比较函数的参数是两个数组， 
  function _onSortUp(e){
    var colIndex = e.target.colIndex;
    //console.log("sortUp Col="+colIndex);
    _sortArray2DByColIndex(m_TableData,colIndex,function(a,b){return a[colIndex]>b[colIndex];});
    _render();
  }
  //同上
  function _onSortDown(e){
    var colIndex = e.target.colIndex;
    //console.log("sortDown Col="+colIndex);
    _sortArray2DByColIndex(m_TableData,colIndex,function(a,b){return a[colIndex]<b[colIndex];});
    _render();
  }
  //生成DOM树，顺便绑定排序事件
  //在new的时候就调用一次，确保DOM树已经生成
  function _render(){
    m_SortableTableDOM.innerHTML="";
    //生成表头，并在这里绑定事件
    var tr0 = document.createElement("tr");
    for (var i = 0;i<m_TableHeads.length; i++) {
      var th = document.createElement("th");
      var txtNode = document.createTextNode(m_TableHeads[i]);
      var sortUpBtn = document.createElement("div");
      sortUpBtn.className="sort-up-btn";
      addEventHandler(sortUpBtn,"click",_onSortUp);
      var sortDownBtn = document.createElement("div");
      sortDownBtn.className="sort-down-btn";
      addEventHandler(sortDownBtn,"click",_onSortDown);
      th.appendChild(txtNode);
      th.appendChild(sortUpBtn);
      th.appendChild(sortDownBtn);
      th.colIndex=i;
      sortUpBtn.colIndex=i;
      sortDownBtn.colIndex=i;
      tr0.appendChild(th);
    };
    //根据数据生成表体
    m_SortableTableDOM.appendChild(tr0);
    for (var i=0;i<m_TableData.length; i++) {
      var _tr = document.createElement("tr");
      for(var j=0;j<m_TableData[i].length;j++){
        var _td = document.createElement("td");
        var txtNode = document.createTextNode(m_TableData[i][j]);
        _td.appendChild(txtNode);
        _tr.appendChild(_td);
      }
      m_SortableTableDOM.appendChild(_tr);
    };
  }
  //唯一的公有方法，只返回一个有效的DOM
  this.getTableDOM = function(){
    return m_SortableTableDOM;
  }
}
