var Vehicle = jClass(MovingEntity, {
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
    this.m_pSteeringBehavior = new SteeringBehavior(World,this);
    this.m_vForce = new Vector2D(0,0);
  },

  update:function(deltaTime){
    var steeringForce = this.m_pSteeringBehavior.calculate();
    var acceleration = steeringForce.divWithAssign(this.m_dMass);
    //console.log(deltaTime);
    //var v_dx = acceleration.x * deltaTime;
    //var v_dy = acceleration.y * deltaTime;
    this.m_vForce.x = steeringForce.x;
    this.m_vForce.y = steeringForce.y;
    this.m_vVelocity.x += acceleration.x * deltaTime;
    this.m_vVelocity.y += acceleration.y * deltaTime;
    this.m_vVelocity.truncate(this.m_dMaxSpeed);
    this.m_vPosition.x += (this.m_vVelocity.x*deltaTime);
    this.m_vPosition.y += (this.m_vVelocity.y*deltaTime);
    if (this.m_vVelocity.getLength() > this.m_dMaxSpeed*0.1){    
      this.m_vHeading = Vec2DNormalize(this.m_vVelocity);
      this.m_vSide = this.m_vHeading.perp();
    }
  },
  render: function(){
      var p = this.getPos();
      var x = p.x; // this.m_dBoundingRadius / 2;
      var y = p.y;
      context.fillStyle = "rgba(255,255,0,0.6)";
      context.beginPath();
      context.arc(x,y,this.getBRadius(),0,Math.PI*2,true);  
      context.closePath();
      context.fill();

      context.strokeStyle = "#f0f";
      context.lineWidth=1;
      context.moveTo(this.getPos().x,this.getPos().y);
      context.lineTo( this.getPos().x +this.m_vHeading.x*20 ,
                        this.getPos().y +this.m_vHeading.y*20  );
      
      context.stroke();
      //console.log(p);
  },
  getSteering: function(){
    return this.m_pSteeringBehavior;
  }

});
