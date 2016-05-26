
var MinDouble = 0.0000000000001;

var Clockwise = {
  anticlockwise:-1,
  clockwise:1
};

var BehaviorType = {
    none               : 0x00000,
    seek               : 0x00002,
    follow_path        : 0x00004,
    arrive             : 0x00008,
    wander             : 0x00010,
    separation         : 0x00040,
    wall_avoidance     : 0x00200,
  };

var Deceleration = {
  fast: 3,
  normal: 2,
  slow: 1
};

var Prm = {
  //hehavior weight
  SeekWeight :         10   ,
  FleeWeight :          0.1 ,
  ArriveWeight :        10  ,
  FollowWeight :        10 ,
  PursuitWeight :       0.1 ,
  OffsetPursuitWeight : 0.1 ,
  InterposeWeight :     0.1 ,

  //
  WaypointSeekDistSq :  10 ,

  // bot param
  BotMass :             1 ,
  BotBeginRotation:     3.14159265358979323846,
  BotMaxSpeed:        200 ,
  BotMaxForce :       4000 ,
  BoxMaxTurnRate :      0.4,
  BotBeginVelocity :   new Vector2D(100,0) ,
  BotBeginHeading  :   new Vector2D(1,0) ,
  BotScale :            10 


}
var SysParam = {
  canvasWidth: 600,
  canvasHeight: 800
}