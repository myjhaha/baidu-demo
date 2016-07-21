function getIndex2DInDirection(row,col,dir){
  switch(dir){
    case Direction.UP:
      return [row-1,col];
    case Direction.RIGHT:
      return [row,col+1];
    case Direction.DOWN:
      return [row+1,col];
    case Direction.LEFT:
      return [row,col-1];
    case Direction.UPPER_RIGHT:
      return [row-1,col+1];
    case Direction.BUTTOM_RIGHT:
      return [row+1,col+1];
    case Direction.BUTTOM_LEFT:
      return [row+1,col-1];
    case Direction.UPPER_LEFT:
      return [row-1,col-1];
    default: 
      return [-1,-1];
  }
}
/*
function PathFinder(){
  this.start = [-1,-1];
  this.end = [-1,-1];
  this.gridMap = null;
  this.graph =null;
  this.runningState = 0;
}
PathFinder.prototype.init = function(opt){
  opt = opt || {}
  this.gridMap = opt.grid || null;
  //---- start & end ----//
  var start = opt.start || [-1,-1];
  var end = opt.end || [-1,-1];
  this.start[0] = start[0];
  this.start[1] = start[1];
  this.end[0] = end[0];
  this.end[1] = end[1];
  //---- make a SparseGraph ----//
  this.graph = new SparseGraph();
  var map2D = this.gridMap.getNodeMap2D();
  var nextIndex = 0;
  //-- add node --//
  for(var i =0;i<map2D.length;i++){
    for(var j=0;j<map2D[i].length;j++){
      var gnode = new GraphNode( nextIndex,
                            { 
                              pos: map2D[i][j].pos,
                              index2D: [i,j],
                              width: this.gridMap.getNodeWidth()
                            });
      this.graph.addNode(gnode);
      if(!this.gridMap.isWalkableAt(i,j)){
        gnode.index = -1;
      }
      nextIndex++;
    }
  }
  //-- add edge --//
  var width = this.gridMap.getRows();
  var height = this.gridMap.getCols();
  for(var i=0;i<height;i++){
    for(var j=0;j<width;j++){
      //var gNode = m_GridMap.getNode(i,j);
      if(!this.gridMap.isWalkableAt(i,j)){
        continue;
      }
      //if(!gNode.walkable)
      var fromIndex = width*i+j;
      // get Neighbor
      for(var d=0;d<8;d++){
        var toIndex2D = getIndex2DInDirection(i,j,d);
        if( toIndex2D[0]>=0 && toIndex2D[0]<height &&
            toIndex2D[1]>=0 && toIndex2D[1]<width ){
          //-- 相邻节点能走？ --//
          if(this.gridMap.isWalkableAt(toIndex2D[0],toIndex2D[1])){
            var toIndex = width*toIndex2D[0]+toIndex2D[1];
            var cost = d<=3?1:1.41421356237309504880168872421;
            this.graph.addEdge(new Edge(fromIndex,toIndex,true,cost));
          }
        }
      };
    }
  }
  console.log( "Node:"+this.graph.numNodes() +
              " Edges:" + this.graph.numEdges() );
};

PathFinder.prototype.setStartingPoint = function(row,col){
  this.start[0] = row;
  this.start[1] = col;
};
PathFinder.prototype.setEnddingPoint = function(row,col){
  this.end[0] = row;
  this.end[1] = col;
};
PathFinder.prototype.render = function(){
  var rows = this.gridMap.getRows();
  var cols = this.gridMap.getCols();
  var w = this.gridMap.getNodeWidth();
  var start = this.start;
  var end = this.end;
  //-- 画出来会卡 --//
  this.graph.render(false); 
  //-- 画起点 --//
  if(this.gridMap.isIndex2DAvailable(start[0],start[1]) && 
     this.gridMap.isWalkableAt(start[0],start[1]) ){
    context.fillStyle = "rgba(255,255,0,0.7)";
    context.fillRect( w*start[1]+1, 
                      w*start[0]+1, w-2,w-2);
  }
  //-- 画终点 --//
  if(this.gridMap.isIndex2DAvailable(end[0],end[1]) && 
     this.gridMap.isWalkableAt(end[0],end[1]) ){
    context.fillStyle = "rgba(255,0,0,0.7)";
    context.fillRect( w*end[1]+1, 
                      w*end[0]+1, w-2,w-2);
  }
};
PathFinder.prototype.addNodeWithEdge = function(row,col,nodeSetting){
  var rows = this.gridMap.getRows();
  var cols = this.gridMap.getCols();
  var w = this.gridMap.getNodeWidth();
  console.assert(row>=0&&row<rows&&col>=0&&col<cols, 
      "二维节点坐标["+row+","+col+"] 越界");
  var index = cols * row + col;
  var map2D = this.gridMap.getNodeMap2D();
  var gnode = new GraphNode( index,
                            { 
                              pos: map2D[row][col].pos,
                              index2D: [row,col],
                              width: w,
                            });
  this.graph.addNode(gnode);
  for(var d=0;d<8;d++){
    var toIndex2D = getIndex2DInDirection(row,col,d);
    if( toIndex2D[0]>=0 && toIndex2D[0]<rows &&
        toIndex2D[1]>=0 && toIndex2D[1]<cols ){
      //-- 相邻节点能走？ --//
      if(this.gridMap.getNode(toIndex2D[0],toIndex2D[1]).isWalkable()){
        var toIndex = cols*toIndex2D[0]+toIndex2D[1];
        var cost = d<=3?1:1.41421356237309504880168872421;
        this.graph.addEdge(new Edge(index,toIndex,true,cost));
        this.graph.addEdge(new Edge(toIndex,index,true,cost));
      }
    }
  };
}
PathFinder.prototype.setNode = function(row,col,nodeSetting){
  var rows = this.gridMap.getRows();
  var cols = this.gridMap.getCols();
  console.assert(row>=0&&row<rows&&col>=0&&col<cols, 
      "二维节点坐标["+row+","+col+"] 越界");
  if(row>=0&&row<rows&&col>=0&&col<cols){
    var index = cols * row + col;
    if(nodeSetting == 2){
      this.graph.removeNode(index);
    }else{
      var map2D = this.gridMap.getNodeMap2D();
      var gnode = new GraphNode( index,
                                { 
                                  pos: map2D[row][col].pos,
                                  index2D: [row,col],
                                  width: w,
                                });
      this.graph.addNode(gnode);
      for(var d=0;d<8;d++){
        var toIndex2D = getIndex2DInDirection(row,col,d);
        if( toIndex2D[0]>=0 && toIndex2D[0]<rows &&
            toIndex2D[1]>=0 && toIndex2D[1]<cols ){
          //-- 相邻节点能走？ --//
          if(this.gridMap.getNode(toIndex2D[0],toIndex2D[1]).isWalkable()){
            var toIndex = cols*toIndex2D[0]+toIndex2D[1];
            var cost = d<=3?1:1.41421356237309504880168872421;
            this.graph.addEdge(new Edge(index,toIndex,true,cost));
            this.graph.addEdge(new Edge(toIndex,index,true,cost));
          }
        }
      };
    } 
  }
};


*/

var PathFinder = (function(){
  //-- 常量 --//
  var SearchAStar = new Graph_SearchAStar();
  var SearchBFS = new Graph_SearchBFS();
  var SearchDFS = new Graph_SearchDFS();
  var SearchDijkstra = new Graph_SearchDijkstra();
  var SearchDBFS = new Graph_SearchDBFS();
  //-- 私有变量 --//
  var m_Start = [-1,-1];
  var m_End = [-1,-1];
  //-- 世界地图节点 --//
  var m_GridMap;
  //-- 抽象图 --//
  var m_SparseGraph;
  //-- 寻到的路径 --//
  var m_Path = [[0,0], [3,3], [7,3], [8,8]];  // 形如[[0,0], [1,1], [2,2], [3,3]]
  //-- 运行状态 --//
  var m_RunningState = 0;   //0 未运行，1 寻路中，2 寻路完成
  //-- 寻路方法 --//
  var m_SearchingMethod = SearchAStar;
  //-- 启动时间 --//
  var m_RunningTime = 0;
  //-- 每步间隔时间 --//
  var m_GapTime = 0;
  //-- 上次寻路update的时间 --//
  var m_StepRes = null;
  function renderPath(){
    if(m_Path.length<2)
      return;
    context.strokeStyle='#00C';
    context.lineWidth=2;
    context.beginPath();
    var p0 = m_Path[0];
    for(var i=1;i<m_Path.length;i++){
      var p1 = m_Path[i];
      var pos_0 = m_GridMap.getNode(p0[0],p0[1]).pos;
      var pos_1 = m_GridMap.getNode(p1[0],p1[1]).pos;
      context.moveTo(pos_0.x,pos_0.y);
      context.lineTo(pos_1.x,pos_1.y);
      p0 = p1;
    }
    context.stroke();
    context.closePath();
  }
  var gapTime = 0;
  var obj = {
    init:function(opt){
      opt = opt || {}
      m_GridMap = opt.grid || null;
      //---- start & end ----//
      var start = opt.start || [-1,-1];
      var end = opt.end || [-1,-1];
      m_Start[0] = start[0];
      m_Start[1] = start[1];
      m_End[0] = end[0];
      m_End[1] = end[1];
      //---- make a SparseGraph ----//
      m_SparseGraph = new SparseGraph();
      var map2D = m_GridMap.getNodeMap2D();
      var nextIndex = 0;
      //-- add node --//
      for(var i =0;i<map2D.length;i++){
        for(var j=0;j<map2D[i].length;j++){
          var gnode = new GraphNode( nextIndex,
                                { 
                                  pos: map2D[i][j].pos,
                                  index2D: [i,j],
                                  width: m_GridMap.getNodeWidth()
                                });
          m_SparseGraph.addNode(gnode);
          if(!m_GridMap.isWalkableAt(i,j)){
            gnode.index = -1;
          }
          nextIndex++;
        }
      }
      //-- add edge --//
      var width = m_GridMap.getRows();
      var height = m_GridMap.getCols();
      for(var i=0;i<height;i++){
        for(var j=0;j<width;j++){
          //var gNode = m_GridMap.getNode(i,j);
          if(!m_GridMap.isWalkableAt(i,j)){
            continue;
          }
          //if(!gNode.walkable)
          var fromIndex = width*i+j;
          // get Neighbor
          for(var d=0;d<8;d++){
            var toIndex2D = getIndex2DInDirection(i,j,d);
            if( toIndex2D[0]>=0 && toIndex2D[0]<height &&
                toIndex2D[1]>=0 && toIndex2D[1]<width ){
              //-- 相邻节点能走？ --//
              if(m_GridMap.isWalkableAt(toIndex2D[0],toIndex2D[1])){
                var toIndex = width*toIndex2D[0]+toIndex2D[1];
                var cost = d<=3?1:1.41421356237309504880168872421;
                m_SparseGraph.addEdge(new Edge(fromIndex,toIndex,true,cost));
              }
            }
          };
        }
      }
      console.log( "Node:"+m_SparseGraph.numNodes() +
                  " Edges:" + m_SparseGraph.numEdges() );

    },
    setStartingPoint: function(row,col){
      m_Start[0] = row;
      m_Start[1] = col;
    },
    setEnddingPoint: function(row,col){
      m_End[0] = row;
      m_End[1] = col;
    },
    render: function(){
      var rows = m_GridMap.getRows();
      var cols = m_GridMap.getCols();
      var w = m_GridMap.getNodeWidth();
      //-- 画出来会卡 --//
      m_SparseGraph.render(false); 
      //-- 画起点 --//
      if(m_GridMap.isIndex2DAvailable(m_Start[0],m_Start[1]) && 
         m_GridMap.isWalkableAt(m_Start[0],m_Start[1]) ){
        context.fillStyle = "rgba(255,255,0,0.7)";
        context.fillRect( w*m_Start[1]+1, 
                          w*m_Start[0]+1, w-2,w-2);
      }
      //-- 画终点 --//
      if(m_GridMap.isIndex2DAvailable(m_End[0],m_End[1]) && 
         m_GridMap.isWalkableAt(m_End[0],m_End[1]) ){
        context.fillStyle = "rgba(255,0,0,0.7)";
        context.fillRect( w*m_End[1]+1, 
                          w*m_End[0]+1, w-2,w-2);
      }
      //-- test 画路径 --//
      
      if(m_RunningState == 2){
        renderPath();
      }
    },
    removeNode: function(row,col){
      var rows = m_GridMap.getRows();
      var cols = m_GridMap.getCols();
      console.assert(row>=0&&row<rows&&col>=0&&col<cols, 
          "二维节点坐标["+row+","+col+"] 越界");
      var index = cols * row + col;
      m_SparseGraph.removeNode(index);
    },
    setRunningState:function(state){
      m_RunningState = state;
    },
    setPath: function(path){
      m_Path = path;
    },
    setNode: function(row,col,nodeSetting){
      var rows = m_GridMap.getRows();
      var cols = m_GridMap.getCols();
      var w = m_GridMap.getNodeWidth();
      console.assert(row>=0&&row<rows&&col>=0&&col<cols, 
          "二维节点坐标["+row+","+col+"] 越界");
      if(row>=0&&row<rows&&col>=0&&col<cols){
        var index = cols * row + col;
        if(nodeSetting == 2){
          m_SparseGraph.removeNode(index);
        }else{
          var map2D = m_GridMap.getNodeMap2D();
          var gnode = new GraphNode( index,
                                    { 
                                      pos: map2D[row][col].pos,
                                      index2D: [row,col],
                                      width: w,
                                    });
          m_SparseGraph.addNode(gnode);
          for(var d=0;d<8;d++){
            var toIndex2D = getIndex2DInDirection(row,col,d);
            if( toIndex2D[0]>=0 && toIndex2D[0]<rows &&
                toIndex2D[1]>=0 && toIndex2D[1]<cols ){
              //-- 相邻节点能走？ --//
              if(m_GridMap.getNode(toIndex2D[0],toIndex2D[1]).isWalkable()){
                var toIndex = cols*toIndex2D[0]+toIndex2D[1];
                var cost = d<=3?1:1.41421356237309504880168872421;
                m_SparseGraph.addEdge(new Edge(index,toIndex,true,cost));
                m_SparseGraph.addEdge(new Edge(toIndex,index,true,cost));
              }
            }
          };
        }
      }
    },
    update: function(deltaTime){
      if(m_RunningState == 0){

      }else if(m_RunningState == 1){
        //Graph_SearchAStar.Next();
        gapTime+=deltaTime;
        if(gapTime >= 0.00){
          m_StepRes.next();
          gapTime = 0;
        }
        
      }
    },
    runFindPath: function(){
      var rows = m_GridMap.getRows();
      var cols = m_GridMap.getCols();
      var fromIndex = m_Start[0]*cols + m_Start[1];
      var toIndex = m_End[0]*cols + m_End[1];
      m_RunningState = 0;
      if( m_GridMap.isWalkableAt(m_Start[0],m_Start[1]) &&
          m_GridMap.isWalkableAt(m_End[0],m_End[1]) ){
        m_RunningState = 1;
        m_StepRes = m_SearchingMethod.runFindPath(fromIndex,toIndex,m_SparseGraph,this);
      }
    },
    setSearchMethod: function(flag){
      switch(flag){
        case 0:
          m_SearchingMethod = SearchAStar;
          break;
        case 1:
          m_SearchingMethod = SearchDFS;
          break;
        case 2:
          m_SearchingMethod = SearchBFS;
          break;
        case 3:
          m_SearchingMethod = SearchDijkstra;
          break;
        case 4:
          m_SearchingMethod = SearchDBFS;
          break;
      }
    },
    setHeuristic: function(flag){
        if(m_SearchingMethod == SearchAStar){
          switch(flag){
            case 0:
              m_SearchingMethod.setHeuristic(Heuristic.manhattan);
              break;
            case 1:
              m_SearchingMethod.setHeuristic(Heuristic.euclidean);
              break;
            case 2:
              m_SearchingMethod.setHeuristic(Heuristic.chebyshev);
              break;
            default: 
              break;
          }
        }
      }
  };
  return obj;
})();

/*
function PathFinder(){
  var m_Start = [-1,-1];
  var m_End = [-1,-1];

  var m_GridMap;
  //-- 抽象图 --//
  var m_SparseGraph;

  this.init = function(opt){
    opt = opt || {}
    m_GridMap = opt.grid || null;
    //---- make a SparseGraph ----//
    m_SparseGraph = new SparseGraph();
    var map2D = m_GridMap.getNodeMap2D();
    var nextIndex = 0;
    //-- add node --//
    for(var i =0;i<map2D.length;i++){
      for(var j=0;j<map2D[i].length;j++){
        var gnode = new GNode( nextIndex,
                              { 
                                pos: map2D[i][j].m_Pos,
                                index2D: [i,j],
                                width: m_GridMap.getNodeWidth()
                              });
        m_SparseGraph.addNode(gnode);
        nextIndex++;
      }
    }
    //-- add edge --//
    var width = m_GridMap.getRows();
    var height = m_GridMap.getCols();
    for(var i=0;i<height;i++){
      for(var j=0;j<width;j++){
        //var gNode = m_GridMap.getNode(i,j);
        if(!m_GridMap.getNode(i,j).isWalkable())
        //if(!gNode.walkable)
          continue;
        var fromIndex = width*i+j;
        for(var d=0;d<8;d++){
          var toIndex2D = getIndex2DInDirection(i,j,d);
          if( toIndex2D[0]>=0 && toIndex2D[0]<height &&
              toIndex2D[1]>=0 && toIndex2D[1]<width ){
            //-- 相邻节点能走？ --//
            if(m_GridMap.getNode(toIndex2D[0],toIndex2D[1]).isWalkable()){
              var toIndex = width*toIndex2D[0]+toIndex2D[1];
              var cost = d<=3?1:1.41421356237309504880168872421;
              m_SparseGraph.addEdge(new Edge(fromIndex,toIndex,true,cost));
            }
          }
        }
        
      }
    }
    console.log( "Node:"+m_SparseGraph.numNodes() +
                " Edges:" + m_SparseGraph.numEdges() );


  }
  this.setStartingPoint = function(row,col){
    m_Start[0] = row;
    m_Start[1] = col;
  }
  this.render = function(){
    //-- 画出来会卡 --//
    m_SparseGraph.render(false); 
  }
}
*/