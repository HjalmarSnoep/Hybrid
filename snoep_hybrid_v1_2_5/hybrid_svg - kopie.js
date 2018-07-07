 /*--
 SnoepGames: snoepHybrid - SVG
 
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

// this is now mainly targeted at adding edited svg's to the manifest and converting them to PNG for compatibility

Hybrid.svg={};
Hybrid.svg.count_images=0;
Hybrid.svg.loading=[];

Hybrid.svg.addToManifestAsPNGBeforePreload=_hybridSVGaddToManifestAsPNGBeforePreload;
function _hybridSVGaddToManifestAsPNGBeforePreload(svg,w,h,new_name)
{
	Hybrid.autopreload=false; // turn of auto preloading, we have to do some stuff!
	Hybrid.svg.count_images++;
	
	var c = document.createElement('canvas');
	c.id = 'canv';
	c.width=w;
	c.height=h;
	var img = new Image();
	img.alt=Hybrid.svg.loading.length;
	img.onload = Hybrid.svg.imgLoaded;
	img.src = "data:image/svg+xml;utf8,"+svg; // this will start the a-synchronous function of onload!
	Hybrid.svg.loading.push({c:c,img:img,name:new_name,w:w,h:h}); // store it all for when it is loaded
};
Hybrid.svg.imgLoaded=_hybridSVGLoaded;
function _hybridSVGLoaded() 
{
	
	var nr=parseFloat(this.alt);
	var o=Hybrid.svg.loading[nr];
	var c=o.c;
	var ctx=c.getContext("2d");
//	ctx.save();
//	ctx.scale(0.8,0.8); // that ought to get them smaller a bit
	ctx.drawImage(this, 0, 0); // this contains the loaded image
//	ctx.restore();
	var png_img=c.toDataURL("image/png");
	Hybrid.debugmessage("Hybrid.svg.imgLoaded "+o.name);
	Hybrid.graphics_manifest[o.name]={src:png_img,w:o.w,h:o.h,preload: true}; 
//	Hybrid.svg.loading[nr]=null; // free the memory we used!
	Hybrid.svg.count_images--;
	if(Hybrid.svg.count_images==0)
	{
		Hybrid.startPreload(); //we call this manually now or nothing will happen, we shut down autopreloading.
	}
};

Hybrid.createSVG =_hybridCreateSVG;
function _hybridCreateSVG(layer,x,y,w,h)
{
  var o={};
  o.id="svg"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  var html_string='<svg version="1.1" width="'+toPx(w)+'" height="'+toPx(h)+'"></svg>';
  $(html_string).appendTo(layer.jquery);
  
  o.jquery=$("#"+o.id);
  o.jquery.css("z-index",layer.dynamic_element_counter).css({left: toPx(x), top: toPx(y)});
  o.kind="hybridSVG";
  
  // setup svg for use
  o.svg=$("#"+o.id)[0];
  o.w=w;
  o.h=h;
  o.jquery.width(toPx(w))
    .height(toPx(h));
  
  _jQueryAddition_MakeUnselectable(o.jquery); // make canvas unselectable as a default, else you get the copy thing on iPad and you can't cancel that..
  
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global counter.
  return o; // return the object!
};

Hybrid.createSVGCircle=_hybridCreateSVGCircle;
function _hybridCreateSVGCircle(svg,x,y,r,fill)
{
	var svgns = "http://www.w3.org/2000/svg";
	var svgDocument = evt.target.ownerDocument;
	var shape = svgDocument.createElementNS(svgns, "circle");
	shape.setAttributeNS(null, "cx", 25);
	shape.setAttributeNS(null, "cy", 25);
	shape.setAttributeNS(null, "r",  20);
	shape.setAttributeNS(null, "fill", "green"); 
}
