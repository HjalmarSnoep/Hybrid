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
 
 V1.2.0 
---*/
 
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
