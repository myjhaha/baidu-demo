function Matrix(){
  this._11 = 0.0;
  this._12 = 0.0;
  this._13 = 0.0;

  this._21 = 0.0;
  this._22 = 0.0;
  this._23 = 0.0;

  this._31 = 0.0;
  this._32 = 0.0;
  this._33 = 0.0;
}
function C2DMatrix(){
  var m_Matrix = new Matrix();
  function matrixMultiply(mIn){ 
    var mat_temp = new Matrix();
    //first row
    mat_temp._11 = (m_Matrix._11*mIn._11) + (m_Matrix._12*mIn._21) + (m_Matrix._13*mIn._31);
    mat_temp._12 = (m_Matrix._11*mIn._12) + (m_Matrix._12*mIn._22) + (m_Matrix._13*mIn._32);
    mat_temp._13 = (m_Matrix._11*mIn._13) + (m_Matrix._12*mIn._23) + (m_Matrix._13*mIn._33);
    //second
    mat_temp._21 = (m_Matrix._21*mIn._11) + (m_Matrix._22*mIn._21) + (m_Matrix._23*mIn._31);
    mat_temp._22 = (m_Matrix._21*mIn._12) + (m_Matrix._22*mIn._22) + (m_Matrix._23*mIn._32);
    mat_temp._23 = (m_Matrix._21*mIn._13) + (m_Matrix._22*mIn._23) + (m_Matrix._23*mIn._33);
    //third
    mat_temp._31 = (m_Matrix._31*mIn._11) + (m_Matrix._32*mIn._21) + (m_Matrix._33*mIn._31);
    mat_temp._32 = (m_Matrix._31*mIn._12) + (m_Matrix._32*mIn._22) + (m_Matrix._33*mIn._32);
    mat_temp._33 = (m_Matrix._31*mIn._13) + (m_Matrix._32*mIn._23) + (m_Matrix._33*mIn._33);
    m_Matrix = mat_temp;
  }

  this._11 = function( val){m_Matrix._11 = val;}
  this._12 = function( val){m_Matrix._12 = val;}
  this._13 = function( val){m_Matrix._13 = val;}

  this._21 = function( val){m_Matrix._21 = val;}
  this._22 = function( val){m_Matrix._22 = val;}
  this._23 = function( val){m_Matrix._23 = val;}

  this._31 = function( val){m_Matrix._31 = val;}
  this._32 = function( val){m_Matrix._32 = val;}
  this._33 = function( val){m_Matrix._33 = val;}

  this.identity = function(){
    m_Matrix._11 = 1; m_Matrix._12 = 0; m_Matrix._13 = 0;
    m_Matrix._21 = 0; m_Matrix._22 = 1; m_Matrix._23 = 0;
    m_Matrix._31 = 0; m_Matrix._32 = 0; m_Matrix._33 = 1;
  };
  this.translate = function(x,y){
    var m = new Matrix();
    m._11 = 1; m._12 = 0; m._13 = 0;
    m._21 = 0; m._22 = 1; m._23 = 0;
    m._31 = x; m._32 = y; m._33 = 1;
    matrixMultiply(m);
  };
  this.scale = function(xScale, yScale){
    var m = new Matrix();
    m._11 = xScale; m._12 = 0;      m._13 = 0;
    m._21 = 0;      m._22 = yScale; m._23 = 0;
    m._31 = 0,      m._32 = 0;      m._33 = 1;
    matrixMultiply(m);
  };
  this.rotate = function(rot){
    var m = new Matrix();
    var _sin = Math.sin(rot);
    var _cos = Math.cos(rot);
    m._11 = _cos;   m._12 = _sin; m._13 = 0;
    m._21 = -_sin;  m._22 = _cos; m._23 = 0;
    m._31 = 0;      m._32 = 0;    m._33 = 1;
    matrixMultiply(m);
  };
  this.rotateByVector2D = function(fwd,side){  // what ????????
    var mat = new Matrix();
    var _sin = Math.sin(rot);
    var _cos = Math.cos(rot);
    mat._11 = fwd.x;  mat._12 = fwd.y; mat._13 = 0;
    mat._21 = side.x; mat._22 = side.y; mat._23 = 0;
    mat._31 = 0; mat._32 = 0;mat._33 = 1;
    matrixMultiply(mat);
  };
  // params is a pointer
  this.transformVector2Ds = function(vVector2d){
    for (var i=0; i<vVector2d.length; ++i) {
      var tempX = (m_Matrix._11*vVector2d[i].x) + (m_Matrix._21*vVector2d[i].y) + (m_Matrix._31);
      var tempY = (m_Matrix._12*vVector2d[i].x) + (m_Matrix._22*vVector2d[i].y) + (m_Matrix._32);
      vPoint[i].x = tempX;
      vPoint[i].y = tempY;
    }
    return vVector2d;
  };
  // params is a pointer
  this.transformVector2D = function(vector2d){
    var tempX = (m_Matrix._11*vector2d.x) + (m_Matrix._21*vector2d.y) + (m_Matrix._31);
    var tempY = (m_Matrix._12*vector2d.x) + (m_Matrix._22*vector2d.y) + (m_Matrix._32);
    vector2d.x = tempX;
    vector2d.y = tempY;
    return vector2d;
  };
  this.toString = function(){
    return ("[ "+m_Matrix._11.toFixed(2)+" "+m_Matrix._12.toFixed(2)+" "+m_Matrix._13.toFixed(2)+"\n  "+
                 m_Matrix._21.toFixed(2)+" "+m_Matrix._22.toFixed(2)+" "+m_Matrix._23.toFixed(2)+"\n  "+
                 m_Matrix._31.toFixed(2)+" "+m_Matrix._32.toFixed(2)+" "+m_Matrix._33.toFixed(2)+ " ]" ) ;
  }
}