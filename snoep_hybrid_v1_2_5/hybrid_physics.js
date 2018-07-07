 /*--
 SnoepGames: snoepHybrid box2d world creator and handler
 // you should enter 
  <script src="../static/lib/Box2d.min.js"></script> <!--  box2d Physics lib needed for this game -->
  // get it from: https://github.com/hecht-software/box2dweb
  // into your game-page!
V1.2.0 
---*/
  
// unnamespace box2d for easier use.
var b2Vec2 = Box2D.Common.Math.b2Vec2
	, b2AABB = Box2D.Collision.b2AABB
	, b2BodyDef = Box2D.Dynamics.b2BodyDef
	, b2Body = Box2D.Dynamics.b2Body
	, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	, b2Fixture = Box2D.Dynamics.b2Fixture
	, b2World = Box2D.Dynamics.b2World
	, b2MassData = Box2D.Collision.Shapes.b2MassData
	, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	, b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
	, b2Shape = Box2D.Collision.Shapes.b2Shape
	, b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	, b2Joint = Box2D.Dynamics.Joints.b2Joint
	, b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
	, b2ContactListener = Box2D.Dynamics.b2ContactListener
	, b2Settings = Box2D.Common.b2Settings
	, b2Mat22 = Box2D.Common.Math.b2Mat22
	, b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef
	, b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
	, b2WorldManifold = Box2D.Collision.b2WorldManifold
	; 
  
  // standard settings for any box2D game, you may override ofcourse.
//  b2Settings.b2_maxTranslation = 2.0; // this is standard and quite high, shouldn't fiddle with it!
//  b2Settings.b2_maxRotation = 50.0;

Hybrid.physics={};  

Hybrid.physics.makeConvex=_hybridMakeConvex;

function _hybridcross(o, a, b) {
   return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}
function _hybridMakeConvex(p)
{
   p.sort(function(a, b) {
      return a.x == b.x ? a.y - b.y : a.x - b.x;
   });
   //Sort the points of P by x-coordinate (in case of a tie, sort by y-coordinate).

   //Initialize U and L as empty lists.
   // The lists will hold the vertices of upper and lower hulls respectively.

   var lower = [];
   for (var i = 0; i < p.length; i++) {
      while (lower.length >= 2 && _hybridcross(lower[lower.length - 2], lower[lower.length - 1], p[i]) <= 0) {
         lower.pop();
      }
      lower.push(p[i]);
   }

   var upper = [];
   for (var i = p.length - 1; i >= 0; i--) {
      while (upper.length >= 2 && _hybridcross(upper[upper.length - 2], upper[upper.length - 1], p[i]) <= 0) {
         upper.pop();
      }
      upper.push(p[i]);
   }

   upper.pop();
   lower.pop();
   return lower.concat(upper); // this is a convex hull!
}
Hybrid.physics.changePolygonDir=_hybridChangeClock;
function _hybridChangeClock(p)
{
	var p2=[];
	var i;
	for(i=p.length-1;i>=0;i--)
	{
		p2.push(p[i]);
	}
	return p2;
}

Hybrid.physics.isCounterClockwise=_hybridTestClock;
function _hybridTestClock(p)
{
	var signedArea = 0;
	var i;
	for(i=0;i<p.length;i++)
	{
		var x1 = p[i].x;
		var y1 = p[i].y;
		var x2 = p[(i+1)%p.length].x;
		var y2 = p[(i+1)%p.length].y;
		signedArea += (x1 * y2 - x2 * y1)
	}
	if(signedArea<0) return false;
	if(signedArea>0) return true; // positive means counterclockwise.
	return false;
//	return signedArea / 2;
}

Hybrid.physics.isConvex=_hybridTestConvex;
function _hybridTestConvex(s)
{
    if (s.length<4) return true;// a triangle is always convex!
   var  i,j,k;
   var flag = 0;
   var z;
   var n=s.length
   
   for (i=0;i<n;i++) 
   {
      j = (i + 1) % n;
      k = (i + 2) % n;
      z  = (s[j].x - s[i].x) * (s[k].y - s[j].y);
      z -= (s[j].y - s[i].y) * (s[k].x - s[j].x);
      if (z < 0)
         flag |= 1;
      else if (z > 0)
         flag |= 2;
      if (flag == 3)
         return(false);
   }
   if (flag != 0)
      return(true);
   else
      return(true);
}

Hybrid.physics.destroyWorld=_hybridDeleteBox2DWorld;
function _hybridDeleteBox2DWorld(w)
{
	// loop through ALL bodies and set them to null.
	w=null; // make sure it CAN be deleted.
}	
Hybrid.physics.createWorld=_hybridcreateBox2DWorld
 function _hybridcreateBox2DWorld()
 {
		var w = new b2World(
			  new b2Vec2(0, 15)    //gravity
			  ,  true                 //allow sleep
	);
	var listener = new Box2D.Dynamics.b2ContactListener;
	w.SetContactListener(listener);
	listener.BeginContact = function (contact){_hybridBeginContact(contact);}
	listener.EndContact = function (contact){_hybridEndContact(contact);}
	//listener.PreSolve = function(contact, oldManifold) {_hybridPreSolveContact(contact,oldManifold);}
	listener.PostSolve = function(contact, impulse) {_hybridPostSolveContact(contact,impulse);}
	return w;
 };
 Hybrid.physics.contactFunction=null;

  Hybrid.physics.destroyBody=_hybridDestroyBody;
 function _hybridDestroyBody(b)
 {
	Hybrid.physics.destroyList.push(b);
 }
 
Hybrid.physics.setPosition=_hybridSetPosition;
function _hybridSetPosition(b,x,y)
{
	// should only be used on kinematic bodies.
	// see what the difference in position is.
	var p=b.bod.GetPosition();
	var dx=x-p.x;
	var dy=y-p.y;
	var l=Math.sqrt(dx*dx+dy*dy);
	if(l>=800)
	{
		dx=800*dx/l;
		dy=800*dy/l;
	}
	b.bod.SetAwake(true);
	b.bod.SetLinearVelocity({x:dx,y:dy});      
	
}
Hybrid.physics.checkCollisionType=_hybridCheckCollisionType;
function _hybridCheckCollisionType(a,b,stra,strb)
{
	var c={};
	c.contact=false;
//	Hybrid.debugmessage("_hybridCheckCollisionType" +a.kind+"=="+stra+" "+b.kind+"=="+strb);
	if(a.kind==stra && b.kind==strb)
	{
		c.contact=true;
		c.a=a.bod.GetUserData();
		c.b=b.bod.GetUserData();
		return c;
	}
//	Hybrid.debugmessage("_hybridCheckCollisionType" +b.kind+"=="+stra+" "+a.kind+"=="+strb);
	if(b.kind==stra && a.kind==strb)
	{
		c.contact=true;
		c.b=a.bod.GetUserData();
		c.a=b.bod.GetUserData();
		return c;
	}
	return c;
}
 
 Hybrid.physics.actualiseCoords=_hybridActualiseCoords;
 function _hybridActualiseCoords(o)
 {
//	Hybrid.physics.contactFunction=cb;
	var p=o.bod.GetPosition();
	o.x=p.x;
	o.y=p.y;
	o.a=o.bod.GetAngle()*Hybrid.TO_DEG;
 }
 
 Hybrid.physics.setContactCallback=_hybridSetContactCallback;
 function _hybridSetContactCallback(cb)
 {
	Hybrid.physics.contactFunction=cb;
 };
function _hybridPreSolveContact(contact,oldManifold)
{
	var a=contact.GetFixtureA().GetBody().GetUserData();
	var b=contact.GetFixtureB().GetBody().GetUserData();
	//world_man=contact.GetWorldManifold( oldManifold );
	if(oldManifold.m_pointCount>0)
	{
		var point={};
		var p1=a.bod.GetPosition();
		var p2=b.bod.GetPosition();
		point.x=(p1.x+p2.x)/2+oldManifold.m_points[0].m_localPoint.x;
		point.x=(p1.y+p2.y)/2+oldManifold.m_points[0].m_localPoint.y;
		Hybrid.physics.contactFunction("point_of_impact",a,b,null,point);
	}
    //if ((filterB.categoryBits == OBJECT1_CATEGORY_BITS) && (filterA.categoryBits == OBJECT2_CATEGORY_BITS))
    //{
     //   b2Vec2 normal = contact->GetManifold()->localNormal;
	//}
}
Hybrid.physics.significantImpulse=400;
function _hybridPostSolveContact(contact,impulse)
{
	if (impulse.normalImpulses[0] < Hybrid.physics.significantImpulse) return; // playing with thresholds
	// it's an impulse that matters.
//	Hybrid.debugmessage("significant impulse generated"+ impulse.normalImpulses[0]);
	var a=contact.GetFixtureA().GetBody().GetUserData();
	var b=contact.GetFixtureB().GetBody().GetUserData();
	if(Hybrid.physics.contactFunction!=null)
	{
		Hybrid.physics.contactFunction("impulse",a,b,impulse.normalImpulses[0]);
	}
	
}
 function _hybridBeginContact(contact) 
 {
	var a=contact.GetFixtureA().GetBody().GetUserData();
	var b=contact.GetFixtureB().GetBody().GetUserData();
	if(Hybrid.physics.contactFunction!=null)
	{
		Hybrid.physics.contactFunction("begin",a,b);
	}
 };
 function _hybridEndContact(contact) 
 {
	var a=contact.GetFixtureA().GetBody().GetUserData();
	var b=contact.GetFixtureB().GetBody().GetUserData();
	if(Hybrid.physics.contactFunction!=null)
	{
		Hybrid.physics.contactFunction("end",a,b);
	}
 };
 
 Hybrid.physics.createObject=_hybridCreateShapeInWorld;
 // world,shape,static/dynamic,x,y,a,kind..
 function _hybridCreateShapeInWorld(w,d,o)
{
	// create fixture
	var fixDef = new b2FixtureDef;
	fixDef.density = 1;
	fixDef.friction = 0.3;
	fixDef.restitution = 0.5;
				
	// create a body
	var bodyDef = new b2BodyDef;
	switch(d)
	{
		case "dynamic":
			bodyDef.type = b2Body.b2_dynamicBody;
		break;
		case "kinematic":
			bodyDef.type = b2Body.b2_kinematicBody;
		break;
		case "static":
			bodyDef.type = b2Body.b2_staticBody;
		break;
	}
    
	// positions the center of the object (not upper left!)
	bodyDef.position.x = o.x; 
	bodyDef.position.y = o.y; 
	if(o.s.indexOf("|")!=-1)
	{
		var dim=o.s.split("|");
		switch(dim[0])
		{
			case "block":
			case "box":
			case "square":
				fixDef.shape = new b2PolygonShape();
				var wid=parseFloat(dim[1])/2;
				var hei=parseFloat(dim[2])/2;
				//Hybrid.debugmessage("create Physics box: "+wid+","+hei);
				fixDef.shape.SetAsBox(wid,hei);
			break;
			case "circle":
				var r=parseFloat(dim[1]);
				fixDef.shape = new b2CircleShape(r);
			break;
		}
	}else
	{
		// it's a polygon, defined in s, s is an array with x,y, objects.
		//set each vertex of polygon in an array
		fixDef.shape = new b2PolygonShape;
		var points = [];
		for (var i = 0; i < o.s.length; i++) {
			var vec = new b2Vec2();
			vec.Set(o.s[i].x, o.s[i].y);
			points[i] = vec;
		}
		fixDef.shape.SetAsArray(points, points.length);
	}
	o.bod = w.CreateBody( bodyDef );
	o.bod.SetAngle(o.a*Hybrid.TO_RADIANS);
	o.fix = o.bod.CreateFixture(fixDef);
	o.w = w; // keep ref to world for destroying!
	o.bod.SetUserData(o);  // points back to itself, so you can always find it on contact!
	 // return o;// this isn't necessary anymore..
}
Hybrid.physics.addSpeed=_hybridAddVelocity;
function _hybridAddVelocity(o,dx,dy)
{
	var b = o.bod;
	var v = b.GetLinearVelocity();
	v.x+=dx;
	v.y+=dy;
	//set the new velocity
	b.SetLinearVelocity(v);
}
Hybrid.physics.setSpeed=_hybridSetVelocity;
function _hybridSetVelocity(o,dx,dy)
{
	var b = o.bod;
	b.SetLinearVelocity(new b2Vec2(dx, dy));
}

Hybrid.physics.setDebugCanvas=_hybridDebugWorldToCanvas
function _hybridDebugWorldToCanvas(w,hbc)
{
	Hybrid.debugmessage("connecting world" +w+" to canvas"+hbc);
	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(hbc.context);
	var ctx=hbc.context;
	ctx.fillRect(0,0,100,100); // test it!
	debugDraw.SetDrawScale(1);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	w.SetDebugDraw(debugDraw);
}


Hybrid.physics.changeTypeList=[]; // to be able to switch between dynamic and static type!
Hybrid.physics.destroyList=[]; // to be able to destroy bodies whenever.

Hybrid.physics.step=_hybridUpdateWorld;
function _hybridUpdateWorld(w)
{
	if(w==null) return; // this might happen after destroyWorld.
   w.Step(
			1 / 60   //frame-rate
			,  10       //velocity iterations
			,  10       //position iterations
		);
		
	w.DrawDebugData();
	w.ClearForces();
			   
    // now we destroy all that needs to be destroyed
    var i;
    for(i=0;i<Hybrid.physics.destroyList.length;i++)
    {
		Hybrid.physics.destroyList[i].w.DestroyBody( Hybrid.physics.destroyList[i].bod );
		Hybrid.physics.destroyList[i]=null;
    }
	Hybrid.physics.destroyList=[]; // all destroyed, so clear list
	
   /* for(i=0;i<Hybrid.physics.changeTypeList.length;i++)
	{
		// create a new body to be able to set the type again.
		var p=Hybrid.physics.changeTypeList[i].bod.GetPosition();
		var a=Hybrid.physics.changeTypeList[i].bod.GetAngle();
		var t=createPolygonInWorld(physics.world, Hybrid.physics.changeTypeList[i].s,"dynamic",p.x,p.y);
		t.bod.SetAngle(a);
		//Hybrid.physics.dynamic_list.push(t);
		
		w.DestroyBody( Hybrid.physics.changeTypeList[i].bod );
		Hybrid.physics.changeTypeList[i]=null;
	}*/
	Hybrid.physics.changeTypeList=[]; // all types changed
}; // update()
 