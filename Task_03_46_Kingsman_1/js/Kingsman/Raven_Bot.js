var RavenBot = jClass(MovingEntity, {
  init:function(world,
                vPos,
                rotation,
                vVelocity,
                mass,
                max_speed,
                max_force,
                max_turn_rate,
                scale){
    this.base(vPos,               // posistion
              scale,              // radius
              vVelocity,          // velocity
              max_speed,          // max speed
              new Vector2D(Math.sin(rotation),-Math.cos(rotation)),  // heading
              new Vector2D(scale,scale),  // scale
              mass,                 // mass
              max_turn_rate,         // max turn rate
              max_force   );            // max force
    this.m_pSteeringBehavior = new RavenBotSteeringBehavior(World,this);
    
  }
});