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