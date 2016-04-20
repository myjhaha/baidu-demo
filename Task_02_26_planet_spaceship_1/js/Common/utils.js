
function PriorityQueue(compareCallback){
  var m_Arr = [0];
  function HeapAdjustDown(Arr,s,m){
    var cur = Arr[s];
    for(var j = 2*s; j<=m; j*=2){
      if(j < m && compareCallback(Arr[j], Arr[j+1]) ){
        j++;
      }
      if(compareCallback(Arr[j], cur)){
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
      if( compareCallback(Arr[j], cur) ){
        Arr[s] = Arr[j];
        s = j;
      }else{
        break;
      }
    }
    Arr[s] = cur;
  };
  this.push = function(e){
    m_Arr.push(e);
    m_Arr[0]++;
    HeapAdjustUp(m_Arr,m_Arr[0]);
  };
  this.pop = function(){
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
}
