

function GraphNode(index,extraInfo){
  this.index = index;
  this.opened = false;
  this.closed = false;
  this.parent = null;
  this.g = 0;
  this.f = 0;
  this.extraInfo = extraInfo;
}
GraphNode.prototype.setIndex = function(i){
  this.index = i;
}
GraphNode.prototype.getIndex = function(){
  return this.index;
}
function Edge(from,to,passable,cost ){
  this.from = from;
  this.to = to;
  this.passable = passable;
  this.cost = cost;
}

function SparseGraph(){
  //-- 私有函数 --//
  var m_NextIndex = 0;

  var m_Nodes = [];
  var m_Edges = [];
  this.cleanNodeState = function(){
    m_Nodes.map(function(e){
      e.opened = false;
      e.closed = false;
      e.parent = null;
      e.g = 99999999;
      e.h = 99999999;
      e.f = 99999999;
    });
  },
  this.addNode = function(node){
    console.assert(node.index >= 0, "位置["+node.index+"]非法");
    if(node.index < m_Nodes.length ){
      if(m_Nodes[node.index].index != -1)
            console.warn("位置["+node.index+"]的节点已存在");
      m_Nodes[node.index] = node;
    }else if(node.index == m_Nodes.length){
      m_Nodes.push(node);
      m_Edges.push([]);
    }else{
      console.error("位置["+node.index+"]非法");
      throw new Error("位置["+node.index+"]非法");
    }
    
    return m_NextIndex++;
  }
  this.removeNode = function(nodeIndex){
    console.assert(nodeIndex<m_Nodes.length && nodeIndex>=0, 
        "节点下标"+nodeIndex+"越界非法");
    if( m_Nodes[nodeIndex].index == -1) 
      return;
    m_Nodes[nodeIndex].index = -1;
    for (var i = m_Edges[nodeIndex].length - 1; i >= 0; i--) {
      var edge = m_Edges[nodeIndex][i];
      var to = m_Edges[nodeIndex][i].to;
      for(var j = m_Edges[to].length - 1; j >= 0; j--){
        var edge2 = m_Edges[to][j];
        var to2 = m_Edges[to][j].to;
        if(to2 == nodeIndex){
          m_Edges[to].splice(j,1);
          break;
        }
      }
    };
    m_Edges[nodeIndex].splice(0,m_Edges[nodeIndex].length);
  };
  this.addEdge = function(e){
    if(e.from < 0 || e.from >= m_Nodes.length)return ;
    var flag = true;
    m_Edges[e.from].map(function(ee){
      if(ee.to == e.to){
        // 如果已经存在，则更新这条边
        ee.passable = e.passable;
        ee.cost = e.cost;
        flag = false;
      }
    });
    if(flag){
      m_Edges[e.from].push(e);
    }
  };

  this.removeEdge = function(from,to){
    if(from>0 && from<m_Nodes.length && to>0 && to<m_Nodes.length)
      m_Edges[e.from].splice(to,1);
  };
  this.removeAllEdges = function(){
    m_Edges.map(function(e){
      e.splice(0,e.length);
    })
  };
  this.numNodes = function(){
    return m_Nodes.length;
  };
  this.numEdges = function(){
    var sum = 0;
    for (var i = m_Edges.length - 1; i >= 0; i--) {
      sum += (m_Edges[i].length);
    };
    return sum;
  };
  this.getNode = function(index){
    if(index>=0&&index<m_Nodes.length)
      return m_Nodes[index];
    else
      return null;
  };
  this.getNeighbours = function(index){
    if(index instanceof GraphNode)
      index = index.index;
    if(index<0 || index >= m_Nodes.length)
      return null;
    var res = [];
    m_Edges[index].map(function(e){
      res.push(m_Nodes[e.to]);
    });
    return res;
  };
  this.render = function(showEdge){
    var showEdge = showEdge || false;
    //-- 画节点 --//
    for (var i = m_Nodes.length - 1; i >= 0; i--) {
      if(m_Nodes[i].index == -1 )
        continue;
      //-- open close
      if(m_Nodes[i].opened == false && m_Nodes[i].closed == false){
        
      }else if(m_Nodes[i].opened == true && m_Nodes[i].closed == false){
        context.fillStyle = "rgba(0,255,128,0.4)";
        var w = m_Nodes[i].extraInfo.width;
        context.fillRect( (w)*m_Nodes[i].extraInfo.index2D[1]+1, 
                        (w)*m_Nodes[i].extraInfo.index2D[0]+1, w-2,w-2);
      } else if(m_Nodes[i].opened == false && m_Nodes[i].closed == true){
        context.fillStyle = "rgba(255,128,0,0.4)";
        var w = m_Nodes[i].extraInfo.width;
        context.fillRect( (w)*m_Nodes[i].extraInfo.index2D[1]+1, 
                        (w)*m_Nodes[i].extraInfo.index2D[0]+1, w-2,w-2);
      }
      var pos_0 = m_Nodes[i].extraInfo.pos;
      context.fillStyle = "#00f";
      // var n = (m_Nodes[i].g).toFixed(1);
      // context.fillText(
      //           (n >= 99999999? "NaN": n) ,
      //           pos_0.x-10,pos_0.y-5);
      //-- parent
      if( m_Nodes[i].parent !== null){
        var pNode = m_Nodes[i].parent;
        context.strokeStyle='#C6C';
        context.lineWidth=1;
        context.beginPath();
        //var pos_0 = m_Nodes[i].extraInfo.pos;
        var pos_1 = pNode.extraInfo.pos;
        context.moveTo(pos_0.x,pos_0.y);
        context.lineTo(pos_1.x,pos_1.y);
        context.stroke();
        context.closePath();
      }
      // 为每个节点画一个点
      context.fillStyle = "rgba(0,0,0,0.80)";
      context.fillRect( m_Nodes[i].extraInfo.pos.x, 
                m_Nodes[i].extraInfo.pos.y,1,1);

    };
    //-- 画边 --//
    // for (var i = m_Edges.length - 1; i >= 0; i--) {
    //   m_Edges[i].map(function(e){
    //     context.strokeStyle = "rgba(0,128,255,0.1)";;
    //     context.lineWidth=1;
    //     context.beginPath();
    //     context.moveTo(m_Nodes[e.from].extraInfo.pos.x,m_Nodes[e.from].extraInfo.pos.y);
    //     context.lineTo( m_Nodes[e.to].extraInfo.pos.x,m_Nodes[e.to].extraInfo.pos.y ); 
    //     context.closePath();
    //     context.fill(); 
    //     context.stroke();
    //   });
    // };
  }

}