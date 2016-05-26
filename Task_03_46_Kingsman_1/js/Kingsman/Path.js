

function Path(numPoint, minX, minY, maxX, maxY, loop){
  var m_WayPoints = null;
  var m_iCurIndex = 0;
  var m_bLooped = loop || false;
  _createRandomPath(numPoint, minX, minY, maxX, maxY);

  function _createRandomPath(_numPoint, _minX, _minY, _maxX, _maxY){
    m_WayPoints = [];
    for (var i = _numPoint - 1; i >= 0; i--) {
      var p = new Vector2D(random(_minX,_maxX), random(_minY,_maxY));
      m_WayPoints.push(p);
    };
    m_iCurIndex = 0;
  }
  
  this.createRandomPath = function(numPoint, minX, minY, maxX, maxY){
    _createRandomPath(numPoint, minX, minY, maxX, maxY);
  }
  this.getCurrentPoint = function(){
    if(m_iCurIndex < m_WayPoints.length)
      return m_WayPoints[m_iCurIndex];
    else
      return null;
  };
  this.isEnd = function(){
    if(m_bLooped) return false;
    if(m_iCurIndex < m_WayPoints.length)
      return false;
    else
      return true;
  }
  this.setNextPoint = function(){
    m_iCurIndex ++;
    if(m_bLooped && m_iCurIndex >= m_WayPoints.length){
      m_iCurIndex = 0;
    }
  };
  this.isLast = function(){
    return m_iCurIndex == m_WayPoints.length-1;
  };
  this.loopOn = function(){
    m_bLooped = true;
  };
  this.loopOff = function(){
    m_bLooped = false;
  };
  this.getPath = function(){
    return m_WayPoints;
  };
  this.setPath = function(pointArr){
    m_WayPoints = pointArr;
  };
  this.render = function(){
    if(m_WayPoints.length <=1 )return;
    context.strokeStyle='#00f';
    context.lineWidth=1;
    context.beginPath();
    var p0 = m_WayPoints[0];
    for(var i=1;i<m_WayPoints.length;i++){
      var p1 = m_WayPoints[i];
      context.moveTo(p0.x,p0.y);
      context.lineTo(p1.x,p1.y);
      p0 = p1;
    }
    if(m_bLooped){
      p1 = m_WayPoints[0];
      context.moveTo(p0.x,p0.y);
      context.lineTo(p1.x,p1.y);
    }
    context.closePath();
    context.stroke();
  }
}