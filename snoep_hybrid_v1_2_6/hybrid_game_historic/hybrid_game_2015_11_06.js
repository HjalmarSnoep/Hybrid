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
	g.debug=false
	g.debugStats=["gameState"];
	g.results={started:false,ended:false,score:0,starttime:-1,endtime:-1,win:false,missions:[],lost:false}; // you didn't win or loose, we don't know ANYthing..
	switch(g.k)
	{
		case "scrolling":
			// display lists!
			g.other=[]; // is only there, to easily create things you don't have to concern yourself with, but we might just need, like more than one camera or whatever.
			//g.rend=[]; // render list, list of objects that are currently IN the viewport.
			g.playzone=[]; // list of current dynamic objects currently in game, they influence the gameplay.
							// where I filtered out the purely graphic stuff
			g.rend=[];  // list of current objects that intersect the viewport and need to be rendered.
						// conveniently put in the order of the layers.
			g.prt=[]; // list of particles, do not influence gameplay, but move with the world and are usually on top of everything.

			g.vp={x:0,y:0,w:Hybrid.width,h:Hybrid.height};
			g.minzoom=1;
			g.maxzoom=1;
			g.cam=_hybridGameCreateGameObject(g,null,{k:"cam",a:{x:0,y:0},zoom:1,smooth:0.9}); //a is actual position. x,y are target, smooth sets transition!
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
	var l,c,i,o,s,cs,x,y,lay;
	// move the camera towards it's target.
	var f1=g.cam.smooth;
	var f2=1-f1;

	// set the shift.
	g.world.x=g.world.x*f1+f2*(g.cam.x-g.vp.w/2);  
	g.world.y=g.world.y*f1+f2*(g.cam.y-g.vp.h/2);
	// check if objects are dissapearing from viewport
	// create a transformed vp to check objects against.
	// tvp is in the same coordinate space as REAL objects, so you can check it against REAL objects bounding boxes..
	g.tvp={x:g.world.x,y:g.world.y,w:g.vp.w,h:g.vp.h}; // transform the viewport
	//Hybrid.debugmessage("created g.tvp"+JSON.stringify(g.tvp));
	
	g.rend=[];// this is an empty array at the beginning, as we move through the objects, we will fill it.
	// calculate the playzone sectors for each layer
	for(l=0;l<g.lay.length;l++)
	{
		lay=g.lay[l];
		x=Math.floor(g.world.x/lay.sw);
		y=Math.floor(g.world.y/lay.sh);
		
		// calculate sectors that matter from worldpos
		lay.csec=_hybridGameCalculateSectorsAround(g,x,y,lay.smw,lay.smh);
		//Hybrid.debugmessage("csec: "+JSON.stringify(lay.csec));
		
		var minx=g.world.w+g.vp.w, // this is to check the min and max of the playzone!
		     maxx=-g.vp.w,
			 miny=g.world.h+g.vp.h,
			 maxy=-g.vp.h;
		// check all objects in current sectors for the need for creation in game.playzone and rend!
		for(c=0;c<g.lay[l].csec.length;c++) //
		{
			cs=g.lay[l].csec[c];
			s=g.lay[l].sec[cs.x][cs.y];
			if(minx>s.x) minx=s.x;
			if(miny>s.y) miny=s.y;
			if(maxx<(s.x+g.lay[l].sw)) maxx=(s.x+g.lay[l].sw);
			if(maxy<(s.y+g.lay[l].sh)) maxy=(s.y+g.lay[l].sh);
			for(i=s.o.length-1;i>=0;i--)
			{
				// any objects that are in the playzone AND dynamic, need to be created AND deleted from the list.
				// any objects that are just there as scenery will NOT be created in the playzone and therefore only
				// deleted from the list, if the enter the viewport.
				if(s.o[i].p!="graphic") // physics set to graphic, so put it in render...
				{
					g.playzone.push(s.o[i]); // it's in a relevant sector, so delete it..
					s.o.splice(i,1);
				}else
				{
					if(_hybridGameBoxIntersect(g.tvp,s.o[i].tbb))
					{
						g.rend.push(s.o[i]);
					}
				}
			}
		}
		// move all objects
		
		
		
		// check all playzone objects if the have left the relevant sectors.
		var playBox={x:minx,y:miny,w:maxx-minx,h:maxy-miny};
		for(i=g.playzone.length-1;i>=0;i--)
		{
			o=g.playzone[i];
			if(o.at==false) // if NOT always there, this is a flag, that will make objects sticky.
			if(!_hybridGameBoxIntersect(playBox,o.tbb))
			{
				// no longer in playzone.
				if(o.ld==true)
				{
					Hybrid.debugmessage("Object asked to be destroyed on leaving the playzone, it's not stored in level..");
				}else
				{
					// calc sector to park it in.
					x=Math.floor(o.x/g.lay[l].sw);
					y=Math.floor(o.y/g.lay[l].sh);
					s=g.lay[o.lay].sec[x][y]; // get the right layer to put it back in from the object.
					// it might have moved out of bounds all together, than we just LEAVE it!
					if(typeof(s)!="undefined")
					{
						// push it back to the sector it belongs
						s.o.push(o);
					}else
					{
						Hybrid.debugmessage("Hybrid.game.step: object moved out of game world, so no sector to park it in..");
					}
				}
				// the delete it from the dynamic objects.
				g.playzone.splice(i,1);
			}
		}
		// check which of the playzone items that are left need to be rendered as well!
		for(i=0;i<g.playzone.length;i++)
		{
			if(_hybridGameBoxIntersect(g.tvp,g.playzone[i].tbb))
			{
				g.rend.push(g.playzone[i]);
			}
		}
		
		// now render the display coordinates for each object;
		var at_present=false;
		for(i=0;i<g.rend.length;i++)
		{
			var p=_hybridCalcGameCoord(g,g.rend[i]);
			g.rend[i].vx=p.x;
			g.rend[i].vy=p.y;
			if(g.rend[i].at) at_present=true;
		}
		if(at_present)
		{
			// now if there were .at objects, WE need to sort on layer-number at least!
			g.rend.sort(_hybridGameSortonLayer);
		}
	}
	// check hitTests and callback if necessary
	// go through all objects and callback for a draw
};
function _hybridGameSortonLayer(a,b)
{
	if(a.lay>b.lay) return 1;
	if(a.lay<b.lay) return -1;
	return 0;
}

Hybrid.game.setObjectProp=_hybridGameSetObjectProp;
function _hybridGameSetObjectProp(o,io)
{
	_hybridOverrideObjectPropsWith(o,io);
	if(typeof(io.x)!="undefined" || typeof(io.y)!="undefined" || typeof(io.r)!="undefined" || typeof(io.s)!="undefined")
	{
		// we need to update the tbb!
		_hybridGameObjectUpdateTBB(o);
	}
};
// we need to check the delete/set sector as well..
function _hybridGameSetObjectPos(o,io)
{
	_hybridOverrideObjectPropsWith(o,io);
	if(typeof(io.x)!="undefined" || typeof(io.y)!="undefined" || typeof(io.r)!="undefined" || typeof(io.s)!="undefined")
	{
		// we need to update the tbb!
		_hybridGameObjectUpdateTBB(o);
	}
};

function _hybridGameBoxIntersect(a,b)
{    
  if((a.x+a.w)<b.x) return false;
  if((a.y+a.h)<b.y) return false;
  if((b.x+b.w)<a.x) return false;
  if((b.y+b.h)<a.y) return false;
  return true;
}

Hybrid.game.objectHitTestBox=_hybridGameObjectHitTestBox;
function _hybridGameObjectHitTestBox(a,b)
{
  var ta={x:a.x+a.hs.x,y:a.y+a.hs.y,w:a.hs.w,h:a.hs.h}; // transform the hitboxes
  var tb={x:b.x+b.hs.x,y:b.y+b.hs.y,w:b.hs.w,h:b.hs.h};
  return _hybridGameBoxIntersect(ta,tb); // and do standardised test.
}

// user creation and destruction of objects.


function _hybridGameDrawDebugShape(g,ctx,o)
{	// first draw the bounding box hitshape in relation to the ref point!
	var p=_hybridCalcGameCoord(g,o);
	// now draw the bbouning box to show the ref..
	
	// draw the hit size!
	var minx=p.x+o.hs.x; // the hit shape is given in relation to the ref x,y
	var miny=p.y+o.hs.y;
	ctx.fillStyle="rgba(255,0,0,0.3)";
	if(o.hit)
		ctx.fillStyle="rgba(128,0,0,0.5)";
	ctx.fillRect(minx,miny,o.hs.w,o.hs.h);
	ctx.strokeStyle="rgba(255,0,0,1)";
	ctx.strokeRect(minx,miny,o.hs.w,o.hs.h);
};

function _hybridGameDrawDebugBoundingBox(g,ctx,o)
{	// first draw the bounding box hitshape in relation to the ref point!
	var p=_hybridCalcGameCoord(g,o);
	// now draw the bbouning box to show the ref..
	var minx=p.x+o.bb.x; // the hit shape is given in relation to the ref x,y
	var miny=p.y+o.bb.y;
	var maxx=minx+o.bb.w;
	var maxy=miny+o.bb.h;

	// show the bounding box.
	ctx.strokeRect(minx,miny,o.bb.w,o.bb.h);
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
		ctx.fillText(str,maxx,maxy);
	}
	
// now as an extra precaution:
	// show the transformed bounding box, to show that it's updating correctly.
	ctx.strokeStyle="rgba(0,128,128,0.5)";
	p=_hybridCalcGameCoord(g,o.tbb);
	ctx.strokeRect(p.x,p.y,o.tbb.w,o.tbb.h);
	
};
// debug draw 
Hybrid.game.debugDraw=_hybridGameDebugDraw;
function _hybridGameDebugDraw(g,debcanv)
{
	var i,l,ctx=debcanv.context;
	var w=Hybrid.width, h=Hybrid.height;
	Hybrid.clearCanvas(debcanv);
	

	// display current sectors for each layer!
	for(l=0;l<g.lay.length;l++)
	{
		// show the sectors
		var c;
		for(c=0;c<g.lay[l].csec.length;c++) 
		{
			var cs=g.lay[l].csec[c];
			var s=g.lay[l].sec[cs.x][cs.y];
			var p=_hybridCalcGameCoord(g,s);
			ctx.strokeStyle="rgba(255,255,0,0.5)";
			ctx.strokeRect(p.x,p.y,g.lay[l].sw,g.lay[l].sh);
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
	var count_physics=0
	var count_render=0
	ctx.strokeStyle="#ffcccc";
	for(i=g.playzone.length-1;i>=0;i--)
	{
		if(g.playzone[i].dd && g.playzone[i].p!="graphic") // drawdebug
			_hybridGameDrawDebugShape(g,ctx,g.playzone[i]);
		count_physics++;
	}
	ctx.strokeStyle="#fff";
	for(i=g.rend.length-1;i>=0;i--)
	{
		if(g.rend[i].dd) // drawdebug
			_hybridGameDrawDebugBoundingBox(g,ctx,g.rend[i]);
		count_render++;
	}
	
	// show the viewport
	ctx.beginPath()
	ctx.rect(0, 0, w, h);
	ctx.rect(g.vp.x, g.vp.y,g.vp.w,g.vp.h);
	ctx.fillStyle="rgba(0,0,128,0.2)";
	ctx.strokeStyle="#008";
	ctx.fill("evenodd");
	ctx.stroke();
	
	// show the transformed viewport as an object.
	//Hybrid.debugmessage("transforming g.tvp"+JSON.stringify(g.tvp));
	//var p=_hybridCalcGameCoord(g,g.tvp);
	//ctx.strokeStyle="rgba(128,128,0,0.7)";
	//ctx.strokeRect(p.x,p.y,g.tvp.w,g.tvp.h);
	
	
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
	var y=10;
	for(i=0;i<rp.game.debugStats.length;i++)
	{
		var s=rp.game.debugStats[i];
		switch(s.toLowerCase())
		{
			case "gamestate":
				ctx.fillText(s+": "+g.state,w-10,y+=10);
			break;
			case "layers":
				ctx.fillText(s+": "+g.lay.length,w-10,y+=10);
			break;
			case "objects":
				ctx.fillText(s+": "+count_physics+"/"+count_render,w-10,y+=10);
			break;
			case "viewport":
				ctx.fillText(s+": "+g.vp.x+","+g.vp.y+" "+g.vp.w+"x"+g.vp.h,w-10,y+=10);
			break;
			case "camera":
				ctx.fillText(s+": "+g.cam.x+","+g.cam.y,w-10,y+=10);
			break;
			case "world":
				ctx.fillText(s+": "+g.world.w+"x"+g.world.h,w-10,y+=10);
			break;
			default:
				ctx.fillText(s+": finding id of dynamic object not implemented yet, sorry",w-10,y+=10);
		}
	}
};
function _hybridCalcGameCoord(g,o)
{
	var p={};
	p.x=o.x+g.vp.x-g.world.x;
	p.y=o.y+g.vp.y-g.world.y;
	return p;
};

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
	o.nr=g.lay.length; // this holds the Number in the array, the id, if you will.
	o.kind="HybridGameLayer";
	o.sw=Math.floor(g.vp.w/2); // sector width usually same as viewport. * minzoom! In a tile based world, this is a lot less.
	o.sh=Math.floor(g.vp.h/2); // sector height
	o.sec=[];    // needs to be a minimum of four sectors.
	o.z=1;       // zoomfactor of layer, how fast does it MOVE.
	o.obj=[];  // inactive game objects, that will be divided up into the sectors 
	o.has_tiles= false; // setting this to true will create a tilegrid that may contain inactive and active bits.
	
	_hybridOverrideObjectPropsWith(o,io); // if user specified anything, like zoom or sector width, that's ok too.
	
	// now we know everything, create the sectors
	var zoom=o.z;
	// create sectors as big as the actual sector size, as many as it takes.
	o.smw=Math.floor(zoom*g.world.w/o.sw)+1; // we need to keep these to calculate the sectors around...
	o.smh=Math.floor(zoom*g.world.h/o.sh)+1;
	o.sec=[];
	for(x=0;x<o.smw;x++) 
	{
		o.sec[x]=[];
		for(y=0;y<o.smh;y++) 
		{
			// it gets the actual x and y and an (initially empty) array of objects.
			o.sec[x][y]={x:o.sw*x,y:o.sh*y,o:[]}; // sw and sh are defined in layer, we don't need to redefine them.
			// divy up the level into ALL sectors.
		}
	}
	
	// calculate current sectors from camera (world.x,world.y, world MUST be created first.)
	var x=Math.floor(g.world.x/o.sw);
	var y=Math.floor(g.world.y/o.sh);
	o.csec=_hybridGameCalculateSectorsAround(g,x,y,o.smw,o.smh); // likely target, we start with world.x=0, world.y=0;
	
	g.lay.push(o);
	return o;
};

function _hybridGameCalculateSectorsAround(g,tx,ty,smw,smh)
{
	// four sectors around the camera
	var x,y,px,py;
	var ar=[];
	for(x=-1;x<4;x++)
	{
		px=tx+x;
		if(px>=0 && px<smw)
		{
			for(y=-1;y<4;y++)
			{
				py=ty+y;
				if(py>=0 && py<smh)
				{
					ar.push({x:px,y:py});
				}
			}
		}
	}
	return ar;
	//ar for 0,0 is =[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1},
	//			      {x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:2,y:-1},
//			     	  {x:-1,y:2},{x:0,y:2},{x:1,y:2},{x:2,y:2},
//			      	  {x:-1,y:0},{x:-1,y:1},{x:2,y:1},{x:2,y:0}];  	

}

Hybrid.game.createObject=_hybridGameCreateGameObject;
function _hybridGameCreateGameObject(g,a,io)
{
	var o={x:0,y:0,dx:0,dy:0,f:0,a:"unknown",at:false,ld:false,dd:true,r:0,dr:0,p:"static",k:"unknown",kind:"HybridGameObject",bb:{x:-15,y:-15,w:30,h:30},hs:{k:"rect",x:-10,y:-10,w:20,h:20}};

	_hybridOverrideObjectPropsWith(o,io);
	// if w and h set, make a default bb and hs!
	if(io.w)
	{
		o.hs.x=-io.w/2;
		o.hs.w=io.w;
		o.bb.x=o.hs.x-5;
		o.bb.w=o.hs.w+10;
	}
	if(io.h)
	{
		o.hs.y=-io.h/2;
		o.hs.h=io.h;
		o.bb.y=o.hs.y-5;
		o.bb.h=o.hs.h+10;
	}
	// we need the TRANSFORMED bounding box to check it against the Viewport!
	_hybridGameObjectUpdateTBB(o); // so the o.tbb is a realworld object again!
	
	// we have a correct game object, only where to store it?
	if(typeof(a)!="undefined" && a!=null)
	{
		if(typeof(a.kind)=="undefined")
		{
			Hybrid.throwError("Hybrid.game.createObject: You are trying to add a gameObject to something else than a gameLayer, why? "+a.kind+ " just use null in stead of a gameLayer");
			// we need to add it directly to one of the game arrays.
			// we need to set one more flag, because these type of objects are usually hero's and stuff.
			// things that will NOT move out of the viewport anyway, or we might need to keep track of even if they do.
			// there is a flag for that, it is at (always there!)
	//		o.at=true;
	//		a.push(o); // set directly to dynamic objects of layer, this should be done a little bit more intelligently, but ok.
		}else
		{
			if(a.kind!="HybridGameLayer") Hybrid.showWarning("Hybrid.game.createObject: Sorry, but you can only add to arrays or gameLayers this is.. "+a.kind+"?");
			var lay=a; // it's a layer!
			
			if(o.bb.w>lay.sw)
			{
				o.at=true; // must be always there in this model, sorry.
			}
			if(o.bb.h>lay.sh)
			{
				o.at=true; // must be always there in this model, sorry.
			}
	
			if(o.at)
			{
				// this is an always there object, so we need to put it in the playzone directly.
				//just to be precise, we add the layer number AND secx and secy
				o.lay=lay.nr; // to be able to place it back in the correct layer once it leaves playzone or render zone, 
				// we can then ORDER the render buffer by layer number and we'll have to..
				var x=Math.floor(o.x/lay.sw);
				var y=Math.floor(o.y/lay.sh);
				o.secx=x; // register what sector it will belong to
				o.secy=y;
				g.playzone.push(o);
				
				if(typeof(lay.sec[x][y])=="undefined")  Hybrid.showWarning("Hybrid.game.createObject: Object seems to be out of bounds.."+o.k+","+o.id);
				//lay.sec[x][y].o.push(o); // put the object in the sector..
			}else
			{
				// ok, so we're all right.
				// we have to find the exact sector to add this object to
				var x=Math.floor(o.x/lay.sw);
				var y=Math.floor(o.y/lay.sh);
				if(typeof(lay.sec[x][y])=="undefined")  Hybrid.showWarning("Hybrid.game.createObject: Object seems to be out of bounds.."+o.k+","+o.id);
				o.secx=x; // register what sector it will belong to
				o.secy=y;
				o.lay=lay.nr; // to be able to place it back in the correct layer once it leaves playzone or render zone, 
							   // to be able to find it's layer and NOT create a cyclical object, which cannot by serialized.
				lay.sec[x][y].o.push(o); // put the object in the sector..
			}
		}
	}
	return o;
};

function _hybridGameObjectUpdateTBB(o)
{
	// tbb = transformed bounding box, it will update when an object is placed, rotated, or scaled
	o.tbb={}; // so the o.tbb is a realworld object again!
	o.tbb.x=o.x+o.bb.x;
	o.tbb.y=o.y+o.bb.y;
	o.tbb.w=o.bb.w;
	o.tbb.h=o.bb.h;
}
// user control of public objects.
Hybrid.game.setObjectState=_hybridSetObjectState;
function _hybridSetObjectState(o,s,c)
{
	o.state=s;
	if(typeof(c)!="undefined") o.sc=c; // state counter.
	else o.sc=0;
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

 