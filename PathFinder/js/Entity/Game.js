var Game = (function(){
  //-- 常量 --//
  var initMapData = worldData_20x20; // 地图信息
  //-- 地图编辑 --//
  var m_NodeSetting = 0;      // 0 起点，1 终点，2 障碍，3 平地
  //-- 算法选择 --//
  var m_AlgorithmSetting = 0; // 0 A*算法, 1 DFS, 2 BFS, 3 Dijkstra
  //-- 对角通过方式 --//
  var m_DiMovement = 0;       // 0 总是 1 从不 2 最多一个障碍 3 没有障碍
  //-- 距离估计方式 --//
  var m_Heuristic = 0;        // 0 曼哈顿距离， 1 欧拉距离， 2 切比雪夫距离


  var m_Pretimestamp = 0;
  var m_PauseFlag = false;
  function cleanScreen(){
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  function showTimeStamp(curTimestamp){
    var deltaTime = curTimestamp - m_Pretimestamp;
    context.fillStyle = "#00f";
    context.fillText(
      "[Time:"+(curTimestamp/1000.0).toFixed(3)+"s]"+
      " [Fps:"+(1/(deltaTime/1000.0+0.00000000000000001)).toFixed(3)+"p/s]" ,
       1, canvas.height-5 );
  }
  var obj = {
    init: function(){

      //-- init world --//
      World.init(initMapData);
      _grid = World.getGridMap(); 
      _start = World.getStartingPoint();
      _end = World.getEnddingPoint();
      PathFinder.init( { grid:  _grid, 
                          start: _start,
                          end:   _end } );

    },
    update: function(curTimestamp){
      var deltaTime = curTimestamp - m_Pretimestamp;
      //-- do thing here --//
      cleanScreen();
      showTimeStamp(curTimestamp);
      if(!m_PauseFlag){
        World.update(deltaTime/1000); //世界里的单位是秒
        PathFinder.update(deltaTime/1000);
      }

      World.render();
      PathFinder.render();
      //-- end --//
      m_Pretimestamp = curTimestamp;
    },
    handleEvent: function(e){
      var offsetX = e.offsetX;
      var offsetY = e.offsetY;
      switch(e.type){
        case "mousedown":
          if(m_NodeSetting == 0){
            World.setStartingPointAtPos(offsetX, offsetY);
            var start = World.getStartingPoint();
            PathFinder.setStartingPoint(start[0], start[1]);
            //-- 马上寻路
            PathFinder.runFindPath();
          }else if(m_NodeSetting == 1){
            World.setEnddingPointAtPos(offsetX, offsetY);
            var end = World.getEnddingPoint();
            PathFinder.setEnddingPoint(end[0], end[1]);
            //-- 马上寻路
            PathFinder.runFindPath();
          }else if(m_NodeSetting == 2){
            World.setBlockNodeAtPos(offsetX, offsetY);
            var index2D = World.posToIndex2D(offsetX, offsetY);
            PathFinder.setNode(index2D[0], index2D[1],m_NodeSetting);
            //-- 马上寻路
            PathFinder.runFindPath();
          }else if(m_NodeSetting == 3){
            World.setEmptyNodeAtPos(offsetX, offsetY);
            var index2D = World.posToIndex2D(offsetX, offsetY);
            PathFinder.setNode(index2D[0], index2D[1],m_NodeSetting);
            //-- 马上寻路
            PathFinder.runFindPath();
          }
          break;
        default:
          break;
      }
    },
    setNodeSetting: function(flag){
      m_NodeSetting = flag;
    },
    setAlgorithm: function(flag){
      if(m_AlgorithmSetting == flag) 
        return;
      m_AlgorithmSetting = flag;
      PathFinder.setSearchMethod(flag);
      //-- 马上寻路
      PathFinder.runFindPath();
    },
    setDiMovement:function(flag){
      m_DiMovement = flag;
    },
    setHeuristic:function(flag){
      if(m_Heuristic == flag)
        return ;
      m_Heuristic = flag;
      PathFinder.setHeuristic(flag);
      //-- 如果目前是A*算法 --//
      if(m_AlgorithmSetting == 0) {  
        //-- 马上寻路
         PathFinder.runFindPath();
      }
    },
    runPathFinder: function(){
      PathFinder.runFindPath();
    }
  }
  return obj;
})();