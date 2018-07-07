 /*--
 SnoepGames: snoepHybrid - game
 
 HTML5 GAME LIB
 by Hjalmar Snoep
 http://www.snoepgames.nl 
 
 Copyright (c)  2014 Hjalmar Snoep, Snoepgames.  
 http://www.snoep.at
 http://www.makinggames.org/nl/user/hjalmarsnoep
 http://www.youtube.com/user/hjalmarsnoep
 All rights reserved.
 
 V1.2.0 
---*/
// initial values!
Hybrid.game={};
Hybrid.game.init=true; // it's loaded

// GAME FUNCTIONS
Hybrid.game.createGame=_hybridCreateGame;
function _hybridCreateGame(k)
{
	var g={};
	g.kind="HybridGame";
	g.k=k;
	g.state="created";
	g.counter=0; // state counter
	g.debug=false;
	g.results={started:false,ended:false,score:0,starttime:-1,endtime:-1,win:false,missions:[],lost:false}; // you didn't win or loose, we don't know ANYthing..
	switch(g.k)
	{
		case "scrolling":
			// display lists!
			g.other=[];
			g.back=[];   // list of current background objects
			g.stat=[];   // list of current static objects currently in game, typically level and walls or tiles! 
			g.dyn=[];    // list of current dynamic objects currently in game, they influence the gameplay.
			g.prt=[]; // list of particles, do not influence gameplay, but move with the world and are usually on top of everything.

			g.vp={x:0,y:0,w:Hybrid.width,h:Hybrid.height};
			g.minzoom=1;
			g.maxzoom=1;
			g.cam=_hybridGameCreateGameObject(g.other,{k:"cam",a:{x:0,y:0},zoom:1,smooth:0.8}); //a is actual position. x,y are target, smooth sets transition!
			g.world={x:0,y:0,w:Hybrid.width*2,h:Hybrid.height*2}; // world, will be of a certain size and will hold 4 sectors, which will hold static and dynamic objects, to enter the game
			g.lay=[]; // layers for background or foreground objects AND level objects!
			//Hybrid.game.createGameLayer(g); // create FIRST LAYER, which will contain the game..
			
		break;
		default:
			Hybrid.showWarning("Hybrid.game.createGame, don't know how to create a game of kind: "+g.kind);
		break;
	}
	return g; // return the game object.
};
Hybrid.game.initLevel=_hybridInitLevel;
function _hybridInitLevel(g) 
{
	// user may have changed things like the vp, and level size.
	// so set up everything according to that.
	// create sectors accordingly.
	
};

Hybrid.game.step=_hybridGameStep;
function _hybridGameStep(g) 
{
	var l;
	// move the camera towards it's target.
	var f1=g.cam.smooth;
	var f2=1-f1;
	g.world.x=g.world.x*f1+f2*(g.cam.x-g.vp.w/2);  
	g.world.y=g.world.y*f1+f2*(g.cam.y-g.vp.h/2);
	// we might need to reset the world after this..
	// the camera is ALWAYS in a possible location!
//	if(g.world.x<0) g.world.x=0;
//	if(g.world.y<0) g.world.y=0;
//	if(g.world.x>g.world.w) g.world.x=g.world.w;
//	if(g.world.y>g.world.h) g.world.y=g.world.h;
	
	
	// set the viewport.
	// check if objects are dissapearing from viewport
	// check if objects are destroyed
	// move all objects
	// check hitTests and callback if necessary
	// go through all objects and callback for a draw
};

// user creation and destruction of objects.
Hybrid.game.resizeGame=_hybridresizeGame
function _hybridresizeGame(g) 
{
	var l;
	for(l=0;l<g.lay.length;l++)
	{
		var zoom=g.lay[l].z;
		// create sectors as big as the actual viewport size 
		var w=Math.floor(zoom*g.world.w/g.vp.w)+1, h=Math.floor(zoom*g.world.h/g.vp.h)+1;
		g.lay[l].sec=[];
		for(x=0;x<w;x++) 
		{
			g.lay[l].sec[x]=[];
			for(y=0;y<w;y++) 
			{
				g.lay[l].sec[x][y]={x:w*x,y:h*y,w:w,h:h};
				// divy up the level into ALL sectors.
			}
		}
		g.lay[l].csec=[{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}]; // current sectors will always be 4 of them
		// calculate current sectors from camera 
	}
};
// debug draw 
Hybrid.game.debugDraw=_hybridGameDebugDraw;
function _hybridGameDebugDraw(g,debcanv)
{
	var i,l,ctx=debcanv.context;
	var w=Hybrid.width, h=Hybrid.height;
	Hybrid.clearCanvas(debcanv);
	

	// display active sectors for each layer!
	for(l=0;l<g.lay.length;l++)
	{
		if(g.lay.debug!=false)
		{
			// show the sectors
			var c;
			ctx.strokeStyle="rgba(128,0,0,0.5)";
			for(c=0;c<4;c++) //g.lay[l].csec.length
			{
				var cs=g.lay[l].csec[c];
				var s=g.lay[l].sec[cs.x,cs.y];
				ctx.strokeRect(s.x,s.y,s.w,s.h);
			}
		}
	}

	// show the world boundaries!
	var p=_hybridCalcGameCoord(g,{x:0,y:0});
	ctx.strokeStyle="#fff";
	ctx.strokeRect(p.x,p.y,g.world.w-1,g.world.h-1);
	
	ctx.textAlign="left";
	ctx.lineWidth=1;
	ctx.strokeStyle="#ccffcc";
	var o={};
	var count=0
	for(i=g.dyn.length-1;i>=0;i--)
	{
		_hybridGameDrawDebugBox(g,ctx,g.dyn[i]);
		count++;
	}
	ctx.strokeStyle="#ffcccc";
	for(i=g.stat.length-1;i>=0;i--)
	{
		_hybridGameDrawDebugBox(g,ctx,g.stat[i]);
		count++;
	}
	ctx.strokeStyle="#ccccff";
	for(i=g.back.length-1;i>=0;i--)
	{
		_hybridGameDrawDebugBox(g,ctx,g.back[i]);
		count++;
	}
	
	// show the viewport
	ctx.beginPath()
	ctx.rect(0, 0, w, h);
	ctx.rect(g.vp.x, g.vp.y,g.vp.w,g.vp.h);
	ctx.fillStyle="rgba(0,0,128,0.5)";
	ctx.strokeStyle="#008";
	ctx.fill("evenodd");
	ctx.stroke();
	
	// draw a little cross for the camera
	ctx.beginPath()
	ctx.strokeStyle="#0f0";
	var p=_hybridCalcGameCoord(g,g.cam);
	ctx.arc(p.x,p.y,5,0,Hybrid.PI2);
	ctx.closePath();
	ctx.moveTo(p.x-10,p.y-10);
	ctx.lineTo(p.x+10,p.y+10);
	ctx.moveTo(p.x+10,p.y-10);
	ctx.lineTo(p.x-10,p.y+10);
	ctx.stroke();
	
	ctx.fillStyle="#ddd";
	ctx.textAlign="right";
	ctx.fillText("gameState: "+g.state,w-10,10);
	ctx.fillText("Layers: "+g.lay.length,w-10,20);
	ctx.fillText("Objects: "+count,w-10,30);
	ctx.fillText("Camera: "+Math.floor(g.cam.x)+","+Math.floor(g.cam.y),w-10,40);
};
function _hybridCalcGameCoord(g,o)
{
	var p={};
	p.x=o.x+g.vp.x-g.world.x;
	p.y=o.y+g.vp.y-g.world.y;
	return p;
}
function _hybridGameDrawDebugBox(g,ctx,o)
{	// first draw the bounding box hitshape in relation to the ref point!
	var p=_hybridCalcGameCoord(g,o);
	// now draw the bbouning box to show the ref..
	var minx=p.x+o.bb.minx; // the hit shape is given in relation to the ref x,y
	var miny=p.y+o.bb.miny;
	var maxx=p.x+o.bb.maxx;
	var maxy=p.y+o.bb.maxy;
	
	// show the bounding box.
	ctx.strokeStyle="rgba(128,128,0,0.3)";
	ctx.strokeRect(minx,miny,o.bb.maxx-o.bb.minx,o.bb.maxy-o.bb.miny);
	ctx.beginPath();
		ctx.moveTo(p.x,p.y)
		ctx.lineTo(minx,miny);
		ctx.moveTo(p.x,p.y)
		ctx.lineTo(maxx,miny);
		ctx.moveTo(p.x,p.y)
		ctx.lineTo(maxx,maxy);
		ctx.moveTo(p.x,p.y)
		ctx.lineTo(minx,maxy);
	ctx.stroke();

	// draw the hit size!
	minx=p.x+o.hs.x; // the hit shape is given in relation to the ref x,y
	miny=p.y+o.hs.y;
	ctx.fillStyle="rgba(255,0,0,0.3)";
	if(o.hit)
		ctx.fillStyle="rgba(128,0,0,0.5)";
	ctx.fillRect(minx,miny,o.hs.w,o.hs.h);
	ctx.strokeStyle="rgba(255,0,0,1)";
	ctx.strokeRect(minx,miny,o.hs.w,o.hs.h);

	
	ctx.font="12px Verdana";
	ctx.fillStyle="#fff";
	var str=o.k;
	if(typeof(o.id)!=="undefined")
	{
		str+=" "+o.id;
	}
	ctx.fillText(str,minx+5,miny+12);
	if(typeof(o.state)!=="undefined")
	{
		str=o.state;
		if(typeof(o.f)!=="undefined") str+=" "+Math.floor(o.f);
		ctx.fillText(str,o.x,p.y);
	}
}
// user creation and destruction of objects.
Hybrid.game.initWorld=_hybridInitWorld;
function _hybridInitWorld(g,io) 
{
	// user may have changed things like the vp, and level size.
	// so set up everything according to that.
	// create sectors accordingly.
	var o={};
	o.x=0;
	o.y=0;
	o.w=Hybrid.width;
	o.h=Hybrid.height;
	_hybridOverrideObjectPropsWith(o,io);
	return o;
};
function _hybridOverrideObjectPropsWith(o,io)
{
	for(var a in io)
	{
		o[a]=io[a];
	}
//	for(var a in io) 
//	{
//		Hybrid.debugmessage(a+" was "+o[a]+" becomes "+io[a]);
//		o[a]=io[a];// overide anything in init_object
//	}
}
Hybrid.game.createLayer=_hybridcreateGameLayer;
function _hybridcreateGameLayer(g,io)
{
	var o={};
	o.sw=g.vp.w; // sector width usually same as viewport. * minzoom! In a tile based world, this is a lot less.
	o.sh=g.vp.h; // sector height
	o.sec=[];    // this is the level divided in blocks of sector_width by sector_height.
	o.z=1;       // zoomfactor of layer, how fast does it MOVE.
	o.obj=[];  // inactive game objects, that will be divided up into the sectors 
	o.has_tiles= false; // setting this to true will create a tilegrid that may contain inactive and active bits.
	g.lay.push(o);
	return o;
};

Hybrid.game.createObject=_hybridGameCreateGameObject;
function _hybridGameCreateGameObject(a,io)
{
	var o={x:0,y:0,dx:0,dy:0,k:"unknown",kind:"HybridGameObject",bb:{minx:-20,maxx:20,miny:-20,maxy:20},hs:{k:"rect",x:-10,y:-10,w:20,h:20}};
	_hybridOverrideObjectPropsWith(o,io);
	// if w and h set, make a default bb and hs!
	if(io.w)
	{
		o.bb.minx=-io.w/1.5;
		o.bb.maxx=io.w/1.5;
		o.hs.x=-io.w/2;
		o.hs.w=io.w;
	}
	if(io.h)
	{
		o.bb.miny=-io.h/1.5;
		o.bb.maxy=io.h/1.5;
		o.hs.y=-io.h/2;
		o.hs.h=io.h;
	}
	
	a.push(o); // set directly to dynamic objects of layer, this should be done a little bit more intelligently, but ok.
	return o;
};
// user control of public objects.
Hybrid.game.setObjectState=_hybridSetObjectState;
function _hybridSetObjectState(o,s)
{
	o.state=s;
};
Hybrid.game.setState=_hybridSetGameState;
function _hybridSetGameState(g,s)
{
	g.state=s;
};
Hybrid.game.setViewport=_hybridSetGameViewport;
function _hybridSetGameViewport(g,o)
{
	_hybridOverrideObjectPropsWith(g.vp,o);
};
Hybrid.game.setWorld=_hybridSetGameWorld;
function _hybridSetGameWorld(g,o)
{
	_hybridOverrideObjectPropsWith(g.world,o);
};
Hybrid.game.setCamera=_hybridSetGameCamera;
function _hybridSetGameCamera(g,o)
{
	// we set the g.cam.x and y as target, the actual position is in cam.a
	if(g.kind!="HybridGame") Hybrid.throwError("Hybrid.game.setCamera first arg is not a game: "+g.kind);
	_hybridOverrideObjectPropsWith(g.cam,o);
	// clamp the target to a possible location!
	if(g.cam.x>(g.world.w-g.vp.w/2)) g.cam.x=(g.world.w-g.vp.w/2); // then we don't have to do that check later in the stepping!
	if(g.cam.y>(g.world.h-g.vp.h/2)) g.cam.y=(g.world.h-g.vp.h/2);
	if(g.cam.x<g.vp.w/2) g.cam.x=g.vp.w/2;
	if(g.cam.y<g.vp.h/2) g.cam.y=g.vp.h/2;
	
};

 