 /*--
 SnoepGames: snoepHybrid - math
 
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

 /*-------------------------------------------------------------------------------------
 // Math constants
 ----------------------------------------------------------------------------------------*/
Hybrid.Math={};
Hybrid.Math.TO_RADIANS=Hybrid.TO_RADIANS = Math.PI/180;  // these are SO helpfull, we put them in the Hybrid, but a more logical place would be inside Math!
Hybrid.Math.TO_DEG=Hybrid.TO_DEG = 180/Math.PI; 
Hybrid.Math.PI2=Hybrid.PI2 = Math.PI*2; 
 /*-------------------------------------------------------------------------------------
 // GENERIC AND HELPER TYPE FUNCTIONS
 ----------------------------------------------------------------------------------------*/
// cheap, seeded, random number generation!
Hybrid.random_seed=14;
Hybrid.random_nrs_asked=0;
 
 Hybrid.Math.sign=_hybrid_sign;
 function _hybrid_sign(a)
 {
	if(a<0) return -1;
	if(a>0) return 1;
	return 0;
 }

// a function to deep copy any object! 
 Hybrid.Math.cloneObject=_hybridCloneObject;
 function _hybridCloneObject(destination, source) 
 {
    for (var property in source) {
         if (typeof source[property] === "object" && source[property] !== null && destination[property]) { 
            clone(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
}; 
 
 Hybrid.Math.checkNestedExistence=_hybridCheckNested;
 function _hybridCheckNested(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

 
 Hybrid.sort_shuffle=_hybrid_hussle;
  function _hybrid_hussle(a,b)
 {
	if(Math.random()<0.5) return-1;
	else return 1;
 }
 
Hybrid.localToGlobal=_hybridLocalToGlobal;
function _hybridLocalToGlobal(ax,x,y)
{
	//Local to Global
	//x2 = x2'cosθ - y2'sinθ + x1
	//y2 = x2'sinθ + y2'cosθ + y1

	var p={};
	if(typeof(ax.sx)==="undefined")
	{
		if(typeof(ax.s)!=="undefined")
		{
			ax.sx=ax.s;
			ax.sy=ax.s;
		}else
		{
			ax.sx=1;
			ax.sy=1;
		}
	}
	var r=ax.r*Hybrid.TO_RADIANS;
	p.x=ax.x+ax.sx*( x*Math.cos(r) - y*Math.sin(r) );
	p.y=ax.y+ax.sy*( x*Math.sin(r) + y*Math.cos(r) );
	return p;
};
 
Hybrid.globalToLocal=_hybridGlobalToLocal;
function _hybridGlobalToLocal(ax,x,y)
{
	// this one needs work, also we need to address: which one is local to Global and Global To Local
	//Local to Global
	//x2 = x2'cosθ - y2'sinθ + x1
	//y2 = x2'sinθ + y2'cosθ + y1

	var p={};
	if(typeof(ax.sx)==="undefined")
	{
		if(typeof(ax.s)!=="undefined")
		{
			ax.sx=ax.s;
			ax.sy=ax.s;
		}else
		{
			ax.sx=1;
			ax.sy=1;
		}
	}
	var r=ax.r*Hybrid.TO_RADIANS;
	p.x=ax.x+ax.sx*( x*Math.cos(r) - y*Math.sin(r) );
	p.y=ax.y+ax.sy*( x*Math.sin(r) + y*Math.cos(r) );
	return p;
};
Hybrid.seededRandomInt=_hybridSeededRandomInt;
function _hybridSeededRandomInt(){
	var r1=(Hybrid.random_seed+197)%2048+(Hybrid.random_nrs_asked); // primes and powers of two
	var r2=(Hybrid.random_seed+709)%1024+Math.floor(Hybrid.random_nrs_asked/2+15*Math.cos(r1));;
	var r3=(Hybrid.random_seed+2239)%512+Math.floor(Hybrid.random_nrs_asked/2+15*Math.sin(r2));
	var rand=(r1+r2+r3)%1000;
	Hybrid.random_seed+=(rand+r3)%(r1+r2);
	Hybrid.random_seed+=r3+r2;
	Hybrid.random_nrs_asked++;
	if(Hybrid.random_nrs_asked>15000) Hybrid.random_nrs_asked=0;
	return rand;
};
Hybrid.seedRandomInt=_hybridSeedRandomInt;
function _hybridSeedRandomInt(nr){
	Hybrid.random_seed=Math.floor(nr);
	Hybrid.random_nrs_asked=Math.floor(nr);
 	//debugmessage("seed random:"+Hybrid.random_seed);
 };
 Hybrid.stringToNumber=_hybridStringToNumber;
function _hybridStringToNumber(str){
	str=str.toLowerCase();
	str=str.replace(/[^a-z]/gi,'');// only alpha!
	var nr=0;
	var i;
	for(i=0;i<str.length;i+=3)
	{
		Hybrid.debugmessage(str.charAt(i)+"->"+str.charCodeAt(i));
		nr+=(str.charCodeAt(i)-96)*i; // a == 97
	}
 	return nr;
 };
 
 
//http://gamedev.stackexchange.com/questions/79765/how-do-i-convert-from-the-global-coordinate-space-to-a-local-space
//Global to Local
//x2' = (x2-x1)cosθ + (y2-y1)sinθ
//y2' = -(x2-x1)sinθ + (y2-y1)cosθ

// generalised PIP algorithm
Hybrid.Math.pointInPolygon=_hybridPointInPolygon;
function _hybridPointInPolygon(cp,pgn,tr,rt)
{
	var p={}; // we create a NEW point, to leave the cp unbothererd.
//	console.log("_hybridPointInPolygon"+p+","+pgn+","+tr+","+rt);
	// the pgn might be rotated and translated, in which case right now, we rotate and translate the point!
	p.x=cp.x;
	p.y=cp.y;
	if(typeof(tr)!=="undefined") 
	{
		p.x=p.x-tr.x; // translate back first.!
		p.y=p.y-tr.y;
	}
	if(typeof(rt)!=="undefined") 
	{
		var r=-rt*Hybrid.TO_RADIANS; // rotate back!
		var s = Math.sin(r);   
		var c = Math.cos(r);  
		p.x = p.x * c - p.y * s;   
		p.y = p.x * s + p.y * c; 
	}
	var i, j, c = false;
	for (i = 0, j = pgn.length-1; i < pgn.length; j = i++)
	{
		if ( ((pgn[i].y>p.y) != (pgn[j].y>p.y)) &&
		 (p.x < (pgn[j].x-pgn[i].x) * (p.y-pgn[i].y) / (pgn[j].y-pgn[i].y) + pgn[i].x) )
		{
		   c = !c;
		}
	  }
//  	console.log("_hybridPointInPolygon returning"+c);

	return c;
};

Hybrid.Math.pointInOval=_hybridPointInOval;
function _hybridPointInOval(cp,c,sc,rt)
{
	var p={};
	p.x=cp.x;
	p.y=cp.y;
	var sx=1;
	var sy=1;
	
	if(typeof(sc)!=="undefined") 
	{
		p.x=p.x-c.x; // translate back!
		p.y=p.y-c.y;
		p.x=cp.x/sc.x;
		p.y=cp.y/sc.y;
		if(typeof(rt)!=="undefined") 
		{
			var r=-rt*Hybrid.TO_RADIANS; // rotate back!
			var ss = Math.sin(r);   
			var cs = Math.cos(r);  
			var v={};
			v.x=p.x;
			v.y=p.y;
			p.x = v.x * cs - v.y * ss;   
			p.y = v.x * ss + v.y * cs; 
		}
		p.x=p.x+c.x; // translate back!
		p.y=p.y+c.y;
	}
	var dx=cp.x-c.x;
	var dy=cp.y-c.y;
	var l=Math.sqrt(dx*dx+dy*dy);
	if(l<=c.r)	return true;
	else return false;
};

Hybrid.Math.pointInBox=_hybridPointInBox;
function _hybridPointInBox(cp,bx,rt)
{
	//Hybrid.debugmessage("_hybridPointInBox"+JSON.stringify(cp)+","+JSON.stringify(bx)+","+rt);
	// the bx might be rotated and translated, in which case right now, we rotate and translate the point!
	var p={};
	p.x=cp.x-bx.x-bx.w/2;
	p.y=cp.y-bx.y-bx.h/2;
	if(typeof(rt)!=="undefined") 
	{
		var r=-rt*Hybrid.TO_RADIANS; // rotate back!
		var s = Math.sin(r);   
		var c = Math.cos(r);  
		var v={};
		v.x = p.x * c - p.y * s;   
		v.y = p.x * s + p.y * c; 
		p.x=v.x+bx.x+bx.w/2;
		p.y=v.y+bx.y+bx.h/2;
	}
	if(p.x>=bx.x && p.x<=(bx.x+bx.w) && p.y>=bx.y && p.y<=(bx.y+bx.h)) return true;
	return false;
};
 