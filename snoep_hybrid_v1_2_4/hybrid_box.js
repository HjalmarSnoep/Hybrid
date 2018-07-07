 /*--
 SnoepGames: snoepHybrid - box
 V1.2.0 
---*/
 
  // a box is 
  Hybrid.createBox=_hybridCreateBox;
 function _hybridCreateBox(layer,x,y,w,h)
 {
  if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
  {
   Hybrid.debugmessage("createBox reports: not the right kind of object: "+layer.kind);
   return null;
  }
  var height_exception=false;
  if(h*Hybrid.f<1)
  {
	h=1/Hybrid.f;
	height_exception=true;
  }
  var o={};
  o.dynamic_element_counter=0; // they may be nested!
  
  o.id="box"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  //Hybrid.debugmessage("create new box: "+o.id);
  var html_string="<div id='"+o.id+"'></div>"
  //Hybrid.debugmessage("create new textbox: "+html_string);
  $(html_string).appendTo(layer.jquery);
  
  o.jquery=$("#"+o.id);
  o.jquery.css("z-index",layer.dynamic_element_counter);
  o.kind="hybridBox";
  // keep ref of w and h!
  o.w=w;
  o.h=h;
  o.x=x;
  o.y=y;
  var h1=toPx(h);
  if(height_exception)
	h1="1px";
  o.jquery.width(toPx(w)).height(h1)
   .css("left",toPx(x)).css("top",toPx(y));
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global element counter!
  return o; // return the object!
 }
 // a layer is just a box, but at 100% and connected to the stage!
Hybrid.createLayer=_hybridCreateLayer;
function _hybridCreateLayer(bx)
 {
  var o={};
  o.dynamic_element_counter=0;
  o.id="bx"+Hybrid.dynamic_element_counter;
  var html_string="<div id='"+o.id+"'></div>";
  $("#hybridStage").append(html_string);
  o.w=Hybrid.width;
  o.h=Hybrid.height;
  o.jquery=$("#"+o.id).css("z-index",Hybrid.dynamic_element_counter);
  o.kind="hybridBox";
  // set bx to cover whole page!
  _hybridSetDivScaledRect(o.jquery,0,0,Hybrid.width,Hybrid.height);
  Hybrid.dynamic_element_counter++;
  return o; // return the object!
 }
 
 Hybrid.setBevel=_hybridSetBoxInset;
 function _hybridSetBoxInset(o,size,c1,c2)
 {
	// supported from firefox 4, Safari 3.1 - 5.0, Chrome 4.0 - 9.0, Opera 10.5+
	var str="inset "+toPx(size)+" "+toPx(size)+" 0px 0px "+c1+",";
	str+=" inset "+toPx(-size)+" "+toPx(-size)+" 0px 0px "+c2+"";
	//Hybrid.debugmessage("created insetstring: "+str);
//	o.jquery=$("#"+o.id).css("-webkit-box-shadow:",str);
//	o.jquery=$("#"+o.id).css("-moz-box-shadow:",str);
//	o.jquery=$("#"+o.id).css("box-shadow: ",str);

//	As from jQuery 1.8+ you can simply use (crossbrowser)
	o.jquery.css({boxShadow: str});
 }
 
 
Hybrid.setBoxCursor=_hybridSetBoxCursor;
function _hybridSetBoxCursor(o,cursor)
{
  o.jquery.css( 'cursor', cursor );
  // can be:
  /*
	// see http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
	alias
	all-scroll
	auto
	cell
	context-menu
	col-resize
	copy
	crosshair
	default
	e-resize
	ew-resize
	grab
	grabbing
	help
	move
	n-resize
	ne-resize
	nesw-resize
	ns-resize
	nw-resize
	nwse-resize
	no-drop
	none
	not-allowed
	pointer
	progress
	row-resize
	s-resize
	se-resize
	sw-resize
	text
	url(smiley.gif),url(myBall.cur),auto
	vertical-text
	w-resize
	wait
	zoom-in
	zoom-out
	initial
  */
  
};
Hybrid.setBoxAlpha=_hybridSetBoxAlpha;
function _hybridSetBoxAlpha(o,a){
  /* IE 8 */
	o.jquery=$("#"+o.id).css("-ms-filter","progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.floor(a*100)+")");
	  /* IE 5-7 */
	o.jquery=$("#"+o.id).css("filter","alpha(opacity="+Math.floor(a*100)+");");
  /* Netscape */
	o.jquery=$("#"+o.id).css("-moz-opacity",a);
  /* Safari 1.x */
	o.jquery=$("#"+o.id).css("-khtml-opacity",a);
  /* Good browsers */
	o.jquery=$("#"+o.id).css("opacity",a);
};
 
 
 Hybrid.setBoxScrollable=_hybridSetBoxScrollable;
 function _hybridSetBoxScrollable(box,x,y)
  {
	if(box.kind!="hybridLayer" && box.kind!="hybridBox" && box.kind!="hybridTextBox")
	{
	   Hybrid.debugmessage("setBoxScrollable reports: not the right kind of object: "+box.kind);
	   return null;
	} 
	if(x)
	{
		box.jquery.css("overflow-x","scroll");
		box.jquery.css("-webkit-overflow-scrolling","touch");
		//_jQueryAddition_MakeSelectable(box.jquery); // this might have the averrechtse effect!

		//box.jquery.css("-ms-overflow-style","none");  /* Hides the scrollbar. */
		//box.jquery.css("-ms-scroll-chaining","none");  /* Prevents Metro from swiping to the next tab or app. */
		//box.jquery.css("-ms-scroll-snap-type","mandatory"); /* Forces a snap scroll behavior on element. */
		//box.jquery.css("-ms-scroll-snap-points-x","snapInterval(0%, 100%)");  /* Defines the y and x intervals to snap to when scrolling. So this is nextpage! */
  	}
	else
		box.jquery.css("overflow-x","hidden");
	if(y)
	{
		box.jquery.css("overflow-y","scroll");
		box.jquery.css("-webkit-overflow-scrolling","touch");
		//_jQueryAddition_MakeSelectable(box.jquery);
		//box.jquery.css("-ms-overflow-style","none");  /* Hides the scrollbar. */
		//box.jquery.css("-ms-scroll-chaining","none");  /* Prevents Metro from swiping to the next tab or app. */
		//box.jquery.css("-ms-scroll-snap-type","mandatory"); /* Forces a snap scroll behavior on element. */
		//box.jquery.css("-ms-scroll-snap-points-x","snapInterval(0%, 100%)");  /* Defines the y and x intervals to snap to when scrolling. So this is nextpage! */

	}
	else
		box.jquery.css("overflow-y","hidden");
 }

Hybrid.scrollBox=_hybridScrollBox;
Hybrid.setScrollPosition=_hybridScrollBox;
function _hybridScrollBox(box,x,y)
 {
  if(box.kind!="hybridLayer" && box.kind!="hybridBox" && box.kind!="hybridTextBox" && box.kind!="hybridCanvas")
  {
   Hybrid.debugmessage("scrollBox  reports: not the right kind of object: "+box.kind);
   return null;
  }
   Hybrid.debugmessage("scrollBox to "+x+","+y);
 // box.jquery.scrollLeft(toPx(x));
  box.jquery.animate({ scrollTop: toPx(y) }, "slow");
 }
Hybrid.getScrollPosition=_hybridGetScrollBox;
function _hybridGetScrollBox(box)
 {
  if(box.kind!="hybridLayer" && box.kind!="hybridBox" && box.kind!="hybridTextBox" && box.kind!="hybridCanvas")
  {
   Hybrid.debugmessage("scrollBox  reports: not the right kind of object: "+box.kind);
   return null;
  }
  var o={x:box.jquery.scrollLeft()/Hybrid.f, y:box.jquery.scrollTop()/Hybrid.f};
  return o;
 }
 
 
 
 // jquery helper functions

 Hybrid.moveBox=_hybridMB;
function _hybridMB(box,x,y)
 {
  if(box.kind!="hybridLayer" && box.kind!="hybridBox" && box.kind!="hybridTextBox" && box.kind!="hybridCanvas" && box.kind!="hybridSpriteButton")
  {
   Hybrid.debugmessage("moveBox  reports: not the right kind of object: "+box.kind);
   return null;
  }
  box.jquery.css("left",toPx(x));
  box.jquery.css("top",toPx(y))
  box.x=x;
  box.y=y;
 }
 
 
Hybrid.getBoxContentHeight=_hybridGetBoxContentHeight;
function _hybridGetBoxContentHeight(o)
{
	// this is NOT working so it seems..
	 var h=o.jquery.height();
    o.jquery.height("auto"); // if you don't put it on auto, you get just the height back that you specified!..
    var v=o.jquery[0].scrollHeight;
    o.jquery.height(h);
    return v*Hybrid.f;
}
 Hybrid.getBoxContentWidth=_hybridGetBoxContentWidth;
 function _hybridGetBoxContentWidth(o)
{
	// this is NOT working so it seems..
    var h=o.jquery.width();
    o.jquery.width("auto"); // if you don't put it on auto, you get just the width back  back that you specified!..
    var v = o.jquery[0].scrollWidth;
    o.jquery.width(h);
    return v*Hybrid.f;
}
 
 Hybrid.sizeBox=_hybridSizeBox;
function _hybridSizeBox(box,w,h)
 {
  if(box.kind=="hybridWebview")
  {
	// guide him to special resize webview function.
	_hybridresizeWebView(box,w,h);
	return;
  }
  if(box.kind!="hybridLayer" && box.kind!="hybridBox" && box.kind!="hybridCanvas")
  {
   Hybrid.debugmessage("sizeBox reports: not the right kind of object: "+box.kind);
   return null;
  }
  //Hybrid.debugmessage("size box content before size:"+box.jquery.html());
  if(typeof(w)!=="undefined")
  {
	box.w=w;
	 box.jquery.width(toPx(w));
  }
  if(typeof(h)!=="undefined")
  {  box.h=h;
	box.jquery.width(toPx(w)).height(toPx(h));
   }
  //Hybrid.debugmessage("size box content after size:"+box.jquery.html());
  }
 function _hybridSetDivScaledRect(jQueryElement,x,y,w,h)
 {
  jQueryElement.width(toPx(w))
   .height(toPx(h))
   .css("left",toPx(x))
   .css("top",toPx(y));
 }
   
 // box and bx manipulation functions!
 // set a standardised shadow!
 Hybrid.setBoxShadow=_hybridSetBoxShadow;
 function _hybridSetBoxShadow(bx,offset_x,offset_y,blur,cs)
 {
	if(typeof(cs)==="undefined") cs=rgba(0, 0, 0, 0.30);
	if(typeof(blur)==="undefined") blur=5;
	if(typeof(offset_x)==="undefined") offset_x=7;
	if(typeof(offset_y)==="undefined") offset_y=7;
	var str=toPx(offset_x)+" "+toPx(offset_y)+" "+toPx(blur)+" "+cs;
   Hybrid.debugmessage("setBoxShadow string: "+str);
  if(bx.kind=="hybridBox" || bx.kind=="hybridCanvas")
  {
	 	bx.jquery.css({boxShadow: str});
  
  // bx.jquery.css("-webkit-box-shadow","7px 7px 5px rgba(0, 0, 0, 0.30)")
//				.css("-moz-box-shadow","7px 7px 5px rgba(50, 50, 50, 0.30)")
//				.css("box-shadow","7px 7px 5px rgba(50, 50, 50, 0.30)");				
  }
  else
  {
   Hybrid.debugmessage("WARNING: setBoxShadow reports: not the right kind of object: "+bx.kind);
  }
 }
 // set a standardised shadow!
 
  Hybrid.setBoxImagePath=_hybridBoxBackgroundImagePath;
 function _hybridBoxBackgroundImagePath(layer,src)
 {
  if(layer.kind=="hybridLayer" || layer.kind=="hybridBox" )
  {
   var html_string="<img src='"+src+"' width='100%' height='100%'>";
   //Hybrid.debugmessage("set background of "+layer.id+" to "+src);
   layer.jquery.html(html_string);
  }
  else
  {
   Hybrid.debugmessage("WARNING: setBoxImagePath reports: not the right kind of object: "+layer.kind);
  }
 }

 
 Hybrid.setBoxImage=_hybridBoxBackgroundImage;
 function _hybridBoxBackgroundImage(layer,index)
 {
   var src=Hybrid.img_src_path+Hybrid.graphics_manifest[index].src;
  if(layer.kind=="hybridLayer" || layer.kind=="hybridBox" )
  {
   var html_string="<img src='"+src+"' width='100%' height='100%'>";
   //Hybrid.debugmessage("set background of "+layer.id+" to "+src);
   layer.jquery.html(html_string);
  }
  else
  {
   Hybrid.debugmessage("WARNING: set Box Image reports: not the right kind of object: "+layer.kind);
  }
 }
 
 
 Hybrid.setBoxRounded=_hybridSetBoxRounded;
 function _hybridSetBoxRounded(bx,px){
  
	if(typeof(px)=="number")
	{
	   bx.jquery.css("-moz-border-radius",toPx(px))
					.css("-webkit-border-radius",toPx(px))
					.css("border-radius",toPx(px));				
	}else
	{
		//Hybrid.debugmessage("rounding box with "+typeof(px));
		//Hybrid.debugmessage("box rounded with different settings for different corners: "+px);
		bx.jquery.css("-moz-border-radius-topleft",toPx(px[0]))
						.css("-webkit-border-top-left-radius",toPx(px[0]))
						.css("border-top-left-radius",toPx(px[0]));				
						
		   bx.jquery.css("-moz-border-radius-topright",toPx(px[1]))
						.css("-webkit-border-top-right-radius",toPx(px[1]))
						.css("border-top-right-radius",toPx(px[1]));				
						
		   bx.jquery.css("-moz-border-radius-bottomright",toPx(px[2]))
						.css("-webkit-border-bottom-right-radius",toPx(px[2]))
						.css("border-bottom-right-radius",toPx(px[2]));				
						
		   bx.jquery.css("-moz-border-radius-bottomleft",toPx(px[3]))
						.css("-webkit-border-bottom-left-radius",toPx(px[3]))
						.css("border-bottom-left-radius",toPx(px[3]));				
						
	}
  
 };
// box - COLOR
Hybrid.setBoxColor=_hybridSetBoxBackgroundColor;
function _hybridSetBoxBackgroundColor(layer,colorString)
{
 if(layer.kind=="hybridLayer" || layer.kind=="hybridBox" || layer.kind=="hybridTextBox"  || layer.kind=="hybridTextInput" )
  {
   layer.jquery.css("background-color",colorString);
  }
  else
  {
    Hybrid.debugmessage("WARNING: set Box Color reports: not the right kind of object: "+layer.kind);
  }
 }
// box - COLOR
function hcthx(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
Hybrid.rgbToHex=_hybridrgbToHex;
function _hybridrgbToHex(r, g, b) {
    return "#" + hcthx(r) + hcthx(g) + hcthx(b);
}


Hybrid.setBoxHairlineBorder=_hybridSetBoxHairBorder;
function _hybridSetBoxHairBorder(layer,c,which)
{
	if(typeof(which)!=="undefined")
	{
		if(which.indexOf("t")!==-1)
			layer.jquery.css("border-top","1px solid "+c);
		if(which.indexOf("b")!==-1)
			layer.jquery.css("border-bottom","1px solid "+c);
		if(which.indexOf("r")!==-1)
			layer.jquery.css("border-right","1px solid "+c);
		if(which.indexOf("l")!==-1)
			layer.jquery.css("border-left","1px solid "+c);
	}else
	{
		layer.jquery.css("border","1px solid "+c);
	}
}

Hybrid.setBoxBorderStyle=_hybridSetBoxBorderStyle;
function _hybridSetBoxBorderStyle(layer,c)
{
	layer.jquery.css("border-style",c);
	// valid for c is:
	// dotted: Defines a dotted border
	// dashed: Defines a dashed border
	// solid: Defines a solid border
	// double: Defines two borders. The width of the two borders are the same as the border-width value
	// groove: Defines a 3D grooved border. The effect depends on the border-color value
	// ridge: Defines a 3D ridged border. The effect depends on the border-color value
	//	inset: Defines a 3D inset border. The effect depends on the border-color value
	//	outset: Defines a 3D outset border. The effect depends on the border-color value
}

Hybrid.emptyBox=_hybridEmptyBox;
function _hybridEmptyBox(layer)
{
	if(layer.kind=="hybridLayer" || layer.kind=="hybridBox" || layer.kind=="hybridTextBox"  || layer.kind=="hybridTextInput" )
	{
		layer.jquery.html("");
	}
}


Hybrid.scaleBox=_hybridscalebox;
function _hybridscalebox(layer,x,y)
{
	if(layer.kind=="hybridLayer" || layer.kind=="hybridBox" || layer.kind=="hybridTextBox"  || layer.kind=="hybridTextInput" )
	{
		layer.jquery.css("transform-origin","0px 0px"); /* Standard syntax */
		layer.jquery.css("-ms-transform-origin","0px 0px"); /*  IE 9 */
		layer.jquery.css("-webkit-transform-origin","0px 0px"); /* Safari & Chrome*/
		layer.jquery.css("-ms-transform","scale("+x+","+y+")"); /* IE 9 */
		layer.jquery.css("-webkit-transform","scale("+x+","+y+")");  /* Safari & Chrome */
		layer.jquery.css("transform","scale("+x+","+y+")"); /* Standard syntax */
		layer.jquery.css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+x+",M12=0,M21=0,M22="+y+",SizingMethod='auto expand')"); /* IE6 and 7 */ 
	}
}


Hybrid.insertHTML=_hybridinserthtml;
function _hybridinserthtml(layer,html)
{
	if(layer.kind=="hybridLayer" || layer.kind=="hybridBox")
	{
		layer.jquery.html(html);
	}
}


Hybrid.setBoxGradient=_hybridSetBoxGradient;
function _hybridSetBoxGradient(layer,dir,color_stops)
{
 if(layer.kind=="hybridLayer" || layer.kind=="hybridBox" || layer.kind=="hybridTextBox"  || layer.kind=="hybridTextInput" )
  {
	layer.jquery.css("background",Hybrid.rgbToHex(color_stops[0].r,color_stops[0].g,color_stops[0].b)); // first color_stop, fallback for old browsers!
	
	var from,from2,from3,to,deg,kind;
	switch(dir)
	{
		case "vertical": // top to bottom
			kind="linear";
			from="top";
			from2="left top, left bottom";
			to="to bottom";
		break;
		case "horizontal": // left to right
			kind="linear";
			from="left";
			from2="left top, right top";
			to="to right";
		break;
		case "diagonal1": //top left, bottom right
			kind="linear";
			from="-45deg";
			from2="left top, right bottom";
			to="135deg";
		break;
		case "diagonal2": // bottom left, top right
			kind="linear";
			from="45deg";
			from2="left bottom, right top";
			to="45deg";
		break;
		case "radial": // bottom left, top right
			kind="radial";
			from="center, ellipse cover"; // Chrome, safari 4+
			from2="center center";
			to="ellipse at center";
		break;
	}
 
	var i; // used http://www.colorzilla.com/gradient-editor/ as a template!
	
	var str="-moz-"+kind+"-gradient("+from+", ";
	for(i=0;i<color_stops.length;i++)
	{
		str+="rgba("+color_stops[i].r+","+color_stops[i].g+","+color_stops[i].b+","+color_stops[i].a+") "+color_stops[i].p+"%,";
	}
	str=str.substr(0,str.length-1); // erase last comma!
	str+=")";
	layer.jquery.css("background",str); // for FF3.6
		str="-webkit-gradient("+kind+", "+from2+", ";
	for(i=0;i<color_stops.length;i++)
	{
		str+="color-stop("+color_stops[i].p+"%,rgba("+color_stops[i].r+","+color_stops[i].g+","+color_stops[i].b+","+color_stops[i].a+")),";
	}
	str=str.substr(0,str.length-1); // erase last comma!
	str+=")";
	layer.jquery.css("background",str); // /* Chrome,Safari4+ */
	
	str="-webkit-"+kind+"-gradient("+from+", ";
	for(i=0;i<color_stops.length;i++)
	{
		str+="rgba("+color_stops[i].r+","+color_stops[i].g+","+color_stops[i].b+","+color_stops[i].a+") "+color_stops[i].p+"%,";
	}
	str=str.substr(0,str.length-1); // erase last comma!
	str+=")";
	layer.jquery.css("background",str); // /* Chrome10+,Safari5.1+ */
	
	str=" -o-"+kind+"-gradient("+from+", ";
	for(i=0;i<color_stops.length;i++)
	{
		str+="rgba("+color_stops[i].r+","+color_stops[i].g+","+color_stops[i].b+","+color_stops[i].a+") "+color_stops[i].p+"%,";
	}
	str=str.substr(0,str.length-1); // erase last comma!
	str+=")";
	layer.jquery.css("background",str); // /* Opera 11.10+ */
	
	str=" -ms-"+kind+"-gradient("+from+", ";
	for(i=0;i<color_stops.length;i++)
	{
		str+="rgba("+color_stops[i].r+","+color_stops[i].g+","+color_stops[i].b+","+color_stops[i].a+") "+color_stops[i].p+"%,";
	}
	str=str.substr(0,str.length-1); // erase last comma!
	str+=")";
	layer.jquery.css("background",str);  /* IE10+ */
		str=" "+kind+"-gradient("+to+", ";
	for(i=0;i<color_stops.length;i++)
	{
		str+="rgba("+color_stops[i].r+","+color_stops[i].g+","+color_stops[i].b+","+color_stops[i].a+") "+color_stops[i].p+"%,";
	}
	str=str.substr(0,str.length-1); // erase last comma!
	str+=")";
	layer.jquery.css("background",str);   /* W3C */
	
  }
  else
  {
    Hybrid.debugmessage("WARNING: set Box Gradient reports: not the right kind of object: "+layer.kind);
  }
 }

 