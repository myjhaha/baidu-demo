/**
 *  一些重要的常量
 */
var Heuristic = {
  manhattan: function(dx, dy) {
      return dx + dy;
  },
  euclidean: function(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
  },
  chebyshev: function(dx, dy) {
      return Math.max(dx, dy);
  }
};
var DiagonalMovement = {
    Always: 0,
    Never: 1,
    IfAtMostOneObstacle: 2,
    OnlyWhenNoObstacles: 3
};
var Direction = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  UPPER_RIGHT: 4,
  BUTTOM_RIGHT: 5,
  BUTTOM_LEFT: 6,
  UPPER_LEFT: 7
};

