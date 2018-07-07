 /*--
 SnoepGames: snoepHybrid - sprite (css)
 V1.2.0 
---*/
 
// a uses box as a given, but changes kind!
Hybrid.createCssSprite=_hybridcreateCssSprite;
function _hybridcreateCssSprite(layer,ss,item,x,y,f,sx,sy)
{
   if(typeof(f)==="undefined") f=0;
   if(typeof(sx)==="undefined") sx=1;
   if(typeof(sy)==="undefined") sy=sx;
   if(typeof(layer)==="undefined") 
   {
	   Hybrid.debugmessage("No layer specified, createCssSprite..: "+layer.kind);
	   return null;
   }else
   {	
   for(all in layer)
	   Hybrid.debugmessage("layer["+all+"]="+layer[all]);
   }
  if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
  {
   Hybrid.debugmessage("createCssSprite reports: not the right kind of object: "+layer.kind);
   return null;
  }
  var img=Hybrid.graphics_manifest[ss];
  var s=img.ss[item][f];
  var o=Hybrid.createBox(layer,x-s[5]*sx,y-s[6]*sy,s[2]*sx,s[3]*sy);
  o.dynamic_element_counter=0; // they may be nested!
  o.id="sprite"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  
//  Hybrid.setBoxColor(o,"#fff"); // white background for debugging!
  // now create the box inside the box, we'll use to hold the spritesheet.
  o.ss=Hybrid.createBox(o,0,0,img.w*sx,img.h*sy);
  Hybrid.setBoxImage(o.ss,ss);
//  Hybrid.setBoxColor(o.ss,"#000");
  Hybrid.debugmessage("s: "+s);
  Hybrid.moveBox(o.ss,-(s[0]*sx),-(s[1]*sy));

  o.kind="hybridCssSprite"; // hiJack it!
  // keep ref of x and y!
  o.x=x;
  o.y=y;
  
  return o; // return the object!
 }
 
