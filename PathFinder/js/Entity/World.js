var World = (
  function(){
  //-- 变量 --//
  var m_Grid;
  var m_Start;
  var m_End;

  var obj = {
    //-- callback --//
    update: function(deltaTime){

    },
    render: function(){
      m_Grid.render();
      // m_PathFinder.render();
    },
    
    //-- OPT --//
    init: function(data){
      //m_GridRows, m_GridCols, m_GridNodeWidth, m_Matrix
      m_Grid = new GridMap();
      m_Grid.init(data.row, data.col, data.width, data.matrix);
      m_Start = data.start;
      m_End = data.end;
      // m_PathFinder = new PathFinder();
      // m_PathFinder.init({grid:m_Grid});
    },
    getGridMap: function(){
      return m_Grid;
    },
    createGraph: function(){
      var graph = new SparseGraph();
    },
    getStartingPoint: function(){
      return [m_Start[0],m_Start[1]];
    },
    getEnddingPoint: function(){
      return [m_End[0],m_End[1]];
    },
    setStartingPointAtPos: function(x,y){
      var col =  Math.floor(x / m_Grid.getNodeWidth());
      var row =  Math.floor(y / m_Grid.getNodeWidth());
      if(m_Grid.isWalkableAt(row,col)){
        m_Start[0] = Math.floor(row);
        m_Start[1] = Math.floor(col);
      }
    },
    setEnddingPointAtPos: function(x,y){
      var col =  Math.floor(x / m_Grid.getNodeWidth());
      var row =  Math.floor(y / m_Grid.getNodeWidth());
      if(m_Grid.isWalkableAt(row,col)){
        m_End[0] = Math.floor(row);
        m_End[1] = Math.floor(col);
      }
    },
    setBlockNodeAtPos: function(x,y){
      var col =  Math.floor(x / m_Grid.getNodeWidth());
      var row =  Math.floor(y / m_Grid.getNodeWidth());
      if(m_Grid.isWalkableAt(row,col)){
        m_Grid.setWalkableAt(row,col,false);
      }
    },
    setEmptyNodeAtPos: function(x,y){
      var col =  Math.floor(x / m_Grid.getNodeWidth());
      var row =  Math.floor(y / m_Grid.getNodeWidth());
      if(!m_Grid.isWalkableAt(row,col)){
        m_Grid.setWalkableAt(row,col,true);
      }
    },
    posToIndex2D: function(x,y){
      var col =  Math.floor(x / m_Grid.getNodeWidth());
      var row =  Math.floor(y / m_Grid.getNodeWidth());
      return [row,col];
    }
  }
  return obj;
})();