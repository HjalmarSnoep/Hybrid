/**
 SnoepGames: snoepHybrid - @math
 
 HTML5 GAME LIB
 by Hjalmar Snoep
 http://www.snoepgames.nl 
 
 Copyright (c)  2014 Hjalmar Snoep, Snoepgames.  
 http://www.snoep.at
 http://www.makinggames.org/nl/user/hjalmarsnoep
 http://www.youtube.com/user/hjalmarsnoep
 All rights reserved.
 
 V1.2.5 
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

 
 Hybrid.Math.sign=_hybrid_sign;
 function _hybrid_sign(a)
 {
	if(a<0) return -1;
	if(a>0) return 1;
	return 0;
 }

// a function to deep copy any object, if it's NOT cyclic
Hybrid.Math.cloneObject=_hybridCloneObject;
function _hybridCloneObject(d,s){
   d=JSON.parse(JSON.stringify(s));
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
};

 
 Hybrid.sort_shuffle=_hybrid_hussle;
 function _hybrid_hussle(a,b)
 {
	if(Math.random()<0.5) return-1;
	else return 1;
 };
 
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


 /*-------------------------------------------------------------------------------------
 // Seeded random int generation
 ----------------------------------------------------------------------------------------*/
/**
 * Seeded random int generation can help in Level generation.
 * This function might be a bit more nicely dispersed, it tends to favour small numbers right now.
 * also 'loops' at 15000 numbers.
 * 
 * @param {string} none
 * 
 * @return {int} a random int between 1 and 1000
 */
Hybrid.random_seed=14;
Hybrid.random_nrs_asked=0;
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
/**
 * Seeded random int generation can help in Level generation.
 * This function sets the seed, therefore determining the numbers generated by seededRandomInt
 * 
 * 
 * @param {int} the seed
 * 
 * @return {none} 
 */
Hybrid.seedRandomInt=_hybridSeedRandomInt;
function _hybridSeedRandomInt(nr){
	Hybrid.random_seed=Math.floor(nr);
	Hybrid.random_nrs_asked=Math.floor(nr);
 	//debugmessage("seed random:"+Hybrid.random_seed);
 };
  
 // end Seeded random int generation

/**
 * Calculate a not per se unique integer from a given string, to sumcheck highscores and stuff.
 * a php version of this algorithm is guaranteed to come up with the same number, even though
 * it looks a bit unpredictable. This way requests are harder to tamper with.
 * 
 * @param {string} the string to be converted
 * 
 * @return {int} the resulting number 
 */
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
 
 /*-------------------------------------------------------------------------------------
 // Vector math
 ----------------------------------------------------------------------------------------*/

/**
 * Calculate the cross product of the two points.
 * 
 * @param {Object} p point object with x and y coordinates
 * @param {Object} q point object with x and y coordinates
 * 
 * @return the cross product result as a float
 */
 Hybrid.crossProduct=_hybridCrossProduct;
function _hybridCrossProduct(p, q) {
	return p.x * q.y - p.y * q.x;
};

/**
 * Subtract the second point from the first.
 * 
 * @param {Object} p point object with x and y coordinates
 * @param {Object} q point object with x and y coordinates
 * 
 * @return the subtraction result as a point object
 */ 
 Hybrid.subtractPoints=_hybridSubtractPoints;
function _hybridSubtractPoints(p, q) {
	var result = {};
	result.x = p.x - q.x;
	result.y = p.y - q.y;

	return result;
};

/**
 * See if the points are equal.
 *
 * @param {Object} p point object with x and y coordinates
 * @param {Object} q point object with x and y coordinates
 *
 * @return if the points are equal
 */
 Hybrid.equalPoints=_hybridEqualPoints;
function _hybridEqualPoints(p, q) {
	return (p.x == q.x) && (p.y == q.y)
};

/**
 * calculate a ReflectionVector given a wall normal, if you hit the wall, that's another matter.
 *
 * @param {Object} p particle game object with dx, dy coordinates
 * @param {Object} w wall normal point object with x and y coordinates (! normalised!)
 *
 * @return changes part and returns false on no bounce, true on bounce.
 */
function _hybridCalculateReflectionVector(p,w)
{
	var p=new Object();
	p.dx=1;
	p.dy=0;
	//len=p.dx*p.dx+p.dy*p.dy; // drops out!
	a=w.x*w.x+w.y*w.y;
	//Hybrid.debugmessage("a="+a);
	if(a!=0)
	{
		b=2*(w.x*p.dx+w.y*p.dy);
		//Hybrid.debugmessage("b="+b);
		c=0;// p.dx*p.dx+p.dy*p.dy-len; // =0
		a1=(-b+Math.sqrt(b*b-4*a*c))/(2*a);
		a2=(-b-Math.sqrt(b*b-4*a*c))/(2*a);
		l=0;
		if(a1>0)l=a1;
		if(a2>0)l=a2;
		p.dx=p.dx+l*w.x;
		p.dy=p.dy+l*w.y;
		if(l==0)
		{
			p.dx=0;
			p.dy=0;
			// cannot be bounced! The normal should face the other way !
			// if you have a double facing wall, you should try again.
			return false;
		}
		//Hybrid.debugmessage(p.dx+","+p.dy);
		p.dx=p.dx;
		p.dy=p.dy;
	}else
	{
		// no p, no wall normal.. something is off, no reflection needed.
		//Hybrid.debugmessage("a==0");
		// don't do ANYTHING to particle.
		return false;
	}
	return true; // it worked
};


/**
 * Find the length of a vector by it's endpoint, when beginning is in o
 *
 * @param {float} x of vectorendpoint
 * @param {float} y of vectorendpoint
 *
 * @return (float) length
 */
 Hybrid.Math.vectorLength=_hybridVectorLength;
function _hybridVectorLength(x,y)
{
	return Math.sqrt(x*x+y*y);
}
/**
 * Find the speed of a particle, by treating it as a vector
 *
 * @param {object} particle {x:-:y:-,dx:-,dy:-}
 *
 * @return (float) speed calculated from dx/dy
 */
 Hybrid.Math.speedOfParticle=_hybridSpeedOfParticle;
function _hybridSpeedOfParticle(a)
{
	return _hybridVectorLength(a.dx,a.dy);
}
/**
 * Find the distance between two points by calculating the vector and using _hybridVectorLength
 *
 * @param {object} point {x:-:y:-}
 * @param {object} point {x:-:y:-}
 *
 * @return (float) distance between points
 */
 Hybrid.Math.distanceBetweenPoints=_hybridDistanceBetweenPoints;
function _hybridDistanceBetweenPoints(a,b)
{
	var dx=a.x-b.x;
	var dy=a.y-b.y;
	return _hybridVectorLength(dx,dy);
}
 
 
 /*-------------------------------------------------------------------------------------
 // Hit test helpers
 ----------------------------------------------------------------------------------------*/
 //http://gamedev.stackexchange.com/questions/79765/how-do-i-convert-from-the-global-coordinate-space-to-a-local-space
//Global to Local
//x2' = (x2-x1)cosθ + (y2-y1)sinθ
//y2' = -(x2-x1)sinθ + (y2-y1)cosθ

/**
 * Find if a given point is IN a polygon, with a generalised PIP algorithm
 * the check point will be rotated and translated first, and checked against an unrotated polygon.
 * any polygon will do, even concave and self-intersecting: even-odd rule applies.
 *
 * @param {object} checkpoint {x:-:y:-}
 * @param [array] array of points making up a closed polygon path [{x:-:y:-},{x:-:y:-}]
 * @param {object} current translation of the polygon {x:-:y:-}
 * @param {float} currnt rotation of the polygon first
 *
 * @return (float) distance between points
 */

Hybrid.Math.pointInPolygon=_hybridPointInPolygon;
function _hybridPointInPolygon(cp,pgn,tr,rt)
{
	var p={}; // we create a NEW point, to leave the cp unbothererd.
	// the pgn (polygon) might be rotated and translated, in which case right now, we rotate and translate the point!
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
 