 /*--
 SnoepGames: snoepHybrid - canvas
 
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
 
function _hybridIsCanvasSupported(){
 return !!document.createElement('canvas').getContext;
};

Hybrid.createCanvas=_hybridCreateCanvas;
function _hybridCreateCanvas(layer,x,y,w,h,optimize){
  if(typeof(optimize)==="undefined") optimize=true; // standard ON!
  var o={};
  o.id="canv"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  var html_string="<canvas id='"+o.id+"'></canvas>"
  $(html_string).appendTo(layer.jquery);
  
  o.jquery=$("#"+o.id);
  o.jquery.css("z-index",layer.dynamic_element_counter).css({left: toPx(x), top: toPx(y)});
  o.kind="hybridCanvas";
  
  // setup canvas for use
  o.canvas=$("#"+o.id)[0];
  o.w=w;
  o.h=h;
  o.start_w=w;
  o.start_h=h;
  if(optimize)
  {
	var real_w=w*Hybrid.f;
	var real_y=h*Hybrid.f;
	real_w=Math.round(real_w);
	real_y=Math.round(real_y);
  	o.canvas.width = real_w; 
	o.canvas.height = real_y; 
	  // now we have to scale the context to display correctly!
	 var ctx=o.canvas.getContext('2d');
	 ctx.scale(Hybrid.f,Hybrid.f);
  }else
  {
	  o.canvas.width = w; 
	  o.canvas.height = h; 
  }
  o.jquery.width(toPx(w))
    .height(toPx(h));
  o.context = o.canvas.getContext('2d'); 
  
  _jQueryAddition_MakeUnselectable(o.jquery); // make canvas unselectable as a default, else you get the copy thing on iPad and you can't cancel that..
  
  
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global counter.
  return o; // return the object!
};

Hybrid.skewContext=_hybridSkewContext;
function _hybridSkewContext(hcv,xy,angle)
{
	var ctx=hcv.context;
	if(xy=="x")
	{
		ctx.setTransform(1, Math.tan(angle*Hybrid.TO_RADIANS), 0, 1, 0, 0);
	}else
	{
		ctx.setTransform(1, 0 ,Math.tan(angle*Hybrid.TO_RADIANS) , 1, 0, 0);
	}
};
Hybrid.createHiddenCanvas=_hybridCreateHiddenCanvas;
function _hybridCreateHiddenCanvas(x,y,w,h){
  var o={};
  o.id="canv"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  o.kind="hybridCanvas"; 
  // setup canvas for use
  o.canvas = document.createElement('canvas');
  o.w=w;
  o.h=h;
  o.canvas.width = w; 
  o.canvas.height = h; 
  o.context = o.canvas.getContext('2d'); 
  Hybrid.dynamic_element_counter++; // also increase the global counter.
  return o; // return the object!
};

// sprite functions!

// that's all nice, but you'll need to support it in Flash too, use a canvas!
//Hybrid.setBoxGradient=_hybridCSSGra;

Hybrid.showCleanSpriteSheet=_hybridCleanSpriteSheet;
function _hybridCleanSpriteSheet(a)
{
	var i,j;
	var str="a=[";
	for(i=0;i<a.length;i++)
	{
		str+="[";
		for(j=0;j<a[i].length;j++)
		{
			str+=Math.round(a[i][j]*100)/100; // max 2 cijfers achter de komma.
			str+=",";
		}
		str = str.substring(0, str.length - 1);
		str+="],"
	}
	str = str.substring(0, str.length - 1);
	str+="];";
	Hybrid.debugmessage(str);
}


// this is an attempt to fix a bug in chrome and ipad now, it's a bit slow though..
Hybrid.cleanCanvasAcc=_hybridCleanCanvasAcc;
function _hybridCleanCanvasAcc(o)
{
	// convert to data string and put it back, this clear accumulation buffer.
	/* basic image manipulation!!
	var output =  ctx.getImageData(0, 0, game.w, game.h);
    var outputData = output.data;
    var pixel = 0;
	var px,py;
    for (var y = 0; y < h; ++y) {
        for (var x = 0; x < w; ++x) {
				px=x+550*Math.sin(x/190*Math.sin(x/35)+y/200*Math.sin(y/37))+350*Math.sin(x/160*Math.sin(x/350)+y/20*Math.sin(y/370));
				py=y+550*Math.cos(y/200*Math.sin(y/33)+x/170*Math.sin(x/32));
                outputData[pixel]   = outputData[pixel]+2*Math.sin((px*py)/2000);
                outputData[++pixel] = outputData[pixel]+2*Math.sin((px*py)/2000);
                outputData[++pixel] = outputData[pixel]+2*Math.sin((py*py)/2000);
                outputData[++pixel] = outputData[pixel];
                ++pixel;
        }
    }
    ctx.putImageData(output, 0, 0);      */
	
//	var id=o.context.createImageData(o.w, o.h); // it's a pointer..
//	// now just put it back...
//	o.context.clearRect ( 0,0 ,o.w , o.h ); // so this doesn't do anything.
//	o.context.putImageData(id,o.w,o.h); returns a clear canvas.. damn!

// we need to physically create a NEW canvas, paint on that and return it.	
	
	//var id=o.context.createImageData(o.w, o.h); 
	// create a temporary invisible canvas to copy on to and from!!!
	
	// create a temp layer
/*	var temp=Hybrid.createLayer();
	var temp_canvas=Hybrid.createCanvas(temp,0,0 ,o.w , o.h ); // now we have new and clean data!
	temp_canvas.context.drawImage(o.canvas, 0, 0);
	Hybrid.clearCanvas(o);
	o.context.drawImage(temp_canvas.canvas, 0, 0); // somehow, drawing this back doesn't work, we need to isolate this problem..
	// NOW remember to remove the extra layer!!!
	Hybrid.removeElement(temp);*/
	
	// let's try the same thing, but without the hybrid.
/*	var canvas2 = document.createElement('canvas');
	canvas2.width = o.w;
	canvas2.height = o.h
	var context2 = canvas2.getContext('2d');
	context2.drawImage(o.canvas, 0, 0); // we copy the canvas onto this!
	
	// create something on the canvas
		context2.beginPath();
		context2.moveTo(0,0);
		context2.lineTo(o.w,o.h); // o.w might be faulty!
		context2.stroke();
	//render the buffered canvas onto the original canvas element
	Hybrid.clearCanvas(o);
	o.context.drawImage(canvas2, 0, 0);*/
	
	// my last approach, the data url
	// it works but does not clear up the issue..
	/*
	var temp=o.canvas.toDataURL();  
	Hybrid.clearCanvas(o);
	// now to draw temp back!
	var img = new Image;
	img.onload = function(){
	  o.context.drawImage(img,0,0); // Or at whatever offset you like
	};
	img.src = temp;*/
	Hybrid.debugmessage("no way found of clearing acc buffer. Use integerpixel rectangles to avoid accum-buildup.");
		
}

Hybrid.drawRoundedRect=_hybridRRH; // rounded rect helper function!
function _hybridRRH(ctx,x, y, w, h, radius)
{
//  Hybrid.debugmessage("Rounded rect, type: "+typeof(radius));
  if(typeof(radius)=="number")
  {
	// expand with the same value.
	var temp=radius;
	radius=[temp,temp,temp,temp];// four times the same corner width!
  }
 // Hybrid.debugmessage("Rounded rect, radiusses: "+radius);
  var r = x + w;
  var b = y + h;
  ctx.beginPath();
  ctx.moveTo(x+radius[0], y);
  ctx.lineTo(r-radius[1], y);
  if(radius[1]!=0)
	ctx.quadraticCurveTo(r, y, r, y+radius[1]);
  ctx.lineTo(r, y+h-radius[2]);
  if(radius[2]!=0)
	ctx.quadraticCurveTo(r, b, r-radius[2], b);
  ctx.lineTo(x+radius[3], b);
  if(radius[3]!=0)
	ctx.quadraticCurveTo(x, b, x, b-radius[3]);
  ctx.lineTo(x, y+radius[0]);
  if(radius[0]!=0)
	ctx.quadraticCurveTo(x, y, x+radius[0], y);
//  context.stroke();
//you do the stroking!
}


Hybrid.createPattern=_hybridCreatePattern;

function _hybridCreatePattern(ctx,img_nr,direction)
{
   var bw,bh;
   var px,py;
   var rx,ry;
   var image;
   if(typeof(Hybrid.graphics_manifest[img_nr])==="undefined")
   {
		Hybrid.debugmessage("WARNING createPattern: '"+img_nr+"' not in image manifest");
		return;
   }
   var pat = ctx.createPattern(Hybrid.graphics_manifest[img_nr].img, direction);
   return pat;
}

Hybrid.drawSprite=_hybridDrawBitmapSprite;

function _hybridDrawBitmapSprite(hbc,img_nr,label,x,y,f,r,sx,sy)
{
	var ctx;
	if(typeof(hbc.kind)!=="undefined")
	{
		// assume a canvas.
		ctx=hbc.context;
	}else
	{
		ctx=hbc; // assume it IS a ctx! (Common mistake and sometimes just handy!)
	}
//	Hybrid.debugmessage("_hybridDrawBitmapSprite"+hbc+","+img_nr+","+label+","+x+","+y+","+f+","+r+","+sx+","+sy)
	//Hybrid.debugmessage("_hybridDrawBitmapSprite img_nr: "+img_nr);
	//Hybrid.debugmessage("_hybridDrawBitmapSprite label: "+label);
	//Hybrid.debugmessage("_hybridDrawBitmapSprite x: "+x);
	//Hybrid.debugmessage("_hybridDrawBitmapSprite y: "+y);
	//Hybrid.debugmessage("_hybridDrawBitmapSprite f: "+f);

   if(r===undefined) r=0;
   if(sx===undefined) sx=1;
   if(sy===undefined) sy=sx;
   if(f===undefined) f=0;
   if(x===undefined) x=0;
   if(y===undefined) y=0;
   var bw,bh;
   var px,py;
   var rx,ry;
   var image;
   if(label===undefined)
   {
		Hybrid.debugmessage("WARNING: drawBitmapSprite: '"+img_nr+"' no label given");
		return;
   }
   if(typeof(Hybrid.graphics_manifest[img_nr])==="undefined")
   {
		Hybrid.debugmessage("WARNING: '"+img_nr+"' not in image manifest");
		return;
   }
   if(!Hybrid.graphics_manifest[img_nr].kind=="sprite")
   {
		Hybrid.debugmessage("WARNING: "+img_nr+" not a sprite");
		return;
   }else
   {
    // get the numbers from the graphics_manifest and ss data for the sprite!!
	if(typeof(Hybrid.graphics_manifest[img_nr].ss[label])==="undefined")
	{
		Hybrid.debugmessage("WARNING: label "+label+" not a known frame for sprite "+img_nr);
		return;
	}
	if(typeof(Hybrid.graphics_manifest[img_nr].ss[label][f])==="undefined")
	{
		Hybrid.debugmessage("WARNING: frame "+f+" not a known frame for sprite "+img_nr+","+label);
		return;
	}
    px=Hybrid.graphics_manifest[img_nr].ss[label][f][0];
    py=Hybrid.graphics_manifest[img_nr].ss[label][f][1];
    bw=Hybrid.graphics_manifest[img_nr].ss[label][f][2];
    bh=Hybrid.graphics_manifest[img_nr].ss[label][f][3];
	// 4 is in easel.js a listing of the sheet!
	if(typeof(Hybrid.graphics_manifest[img_nr].ss[label][f][5])!=="undefined")
	    rx=Hybrid.graphics_manifest[img_nr].ss[label][f][5];
	else 
	    rx=bw/2;
	if(typeof(Hybrid.graphics_manifest[img_nr].ss[label][f][6])!=="undefined")
	    ry=Hybrid.graphics_manifest[img_nr].ss[label][f][6];
	else 
	    ry=bh/2;
    image=Hybrid.graphics_manifest[img_nr].img;
   }
   // before we screw with it up
   ctx.save(); 
   // move to the middle of where we want to draw our image
   // scale the HyBridCanvas.context;
   ctx.translate(x, y);
   // scale it
   ctx.scale(sx, sy);
   // rotate around that point, converting our 
   // angle from degrees to radians 
   ctx.rotate(r * Hybrid.TO_RADIANS);
   // draw it up and to the left by half the width
   // and height of the image 
   //image,sx,sy,sw,sh,dx,dy,dw,dh) source dest!
   
   // for IE && firefox we need to check if it's source region  inside the bounds of the canvas????
   // http://stackoverflow.com/questions/19338032/canvas-indexsizeerror-index-or-size-is-negative-or-greater-than-the-allowed-a
   // http://stackoverflow.com/questions/19338032/canvas-indexsizeerror-index-or-size-is-negative-or-greater-than-the-allowed-a
   ctx.drawImage(image, px,py,bw,bh,-rx,-ry,bw,bh);
   // and restore the co-ords to how they were when we began
   ctx.restore(); 
}


Hybrid.clearCanvas=_hybridClearCanvas;
function _hybridClearCanvas(hbc)
{
	//Hybrid.debugmessage("clear Canvas: "+hbc.canvas.width+"x"+hbc.canvas.height+" f:"+Hybrid.f);
	// this goes wrong on a sized canvas?
	hbc.context.clearRect(0,0,hbc.w, hbc.h); 
	hbc.context.clearRect(0,0,hbc.start_w, hbc.start_h);  // this just in case the canvas is scaled afterwards!

}

Hybrid.drawImage=_hybridDrawImage;
function _hybridDrawImage(hbc,img_nr,x,y,r,s)
{
	Hybrid.debugmessage("_hybridDrawImage: "+hbc+","+img_nr+","+x+","+y+","+r+","+s);
	if(r===undefined) r=0;
	if(s===undefined) s=1;
	if(x===undefined) x=0;
	if(y===undefined) y=0;
	var bw,bh;
	var sw,sh;
	var image;
	if(typeof(Hybrid.graphics_manifest[img_nr])==="undefined")
	{
			Hybrid.debugmessage("WARNING: drawImage '"+img_nr+"' not in image manifest");
			return;
	}
    image=Hybrid.graphics_manifest[img_nr].img;
    // get the numbers from the graphics_manifest and ss data for the blocksprite!!
    bw=Hybrid.graphics_manifest[img_nr].w;
    bh=Hybrid.graphics_manifest[img_nr].h;
	// before we screw with it
	hbc.context.save(); 
	// move to the middle of where we want to draw our image
	// scale the hybrid canvas (hbc) context;
	hbc.context.translate(x, y);
	// scale it
	hbc.context.scale(s, s);
	// rotate around that point, converting our 
	// angle from degrees to radians 
	hbc.context.rotate(r * Hybrid.TO_RADIANS);
    // draw it up and to the left by half the width
    // and height of the image 
    //image,sx,sy,sw,sh,dx,dy,dw,dh) source dest!
	bw=Math.floor(bw);
	bh=Math.floor(bh);
	bh=Math.floor(bh);
	Hybrid.debugmessage("_hybridDrawImage2: "+hbc+","+img_nr+","+bw+","+bh);
	hbc.context.drawImage(image, 0,0,bw,bh,-bw/2,-bh/2,bw,bh);
	
	// if this gives you a JavaScript Failed to execute 'drawImage'
	// there is nothing wrong with your canvas, you just should preload your images. It's a wrong error message!
	
	// and restore the co-ords to how they were when we began
	hbc.context.restore(); 	
}
Hybrid.canvasToImageManifest=_hybridCanvasToImageManifest;
function _hybridCanvasToImageManifest(hbc,label)
{
	// check if exists if exists, replcae!
	if(typeof(Hybrid.graphics_manifest[label])==="undefined")
	{
		Hybrid.graphics_manifest[label]={};
		Hybrid.debugmessage("canvasToImageManifest created:"+Hybrid.graphics_manifest[label]);
		Hybrid.graphics_manifest[label].preload=true; 
		Hybrid.graphics_manifest[label].w=hbc.canvas.width; 
		Hybrid.graphics_manifest[label].h=hbc.canvas.height; 
		Hybrid.graphics_manifest[label].img=new Image();
		Hybrid.debugmessage("canvasToImageManifest canvas is: "+hbc.canvas);
		Hybrid.graphics_manifest[label].img.src=hbc.canvas.toDataURL();
		Hybrid.debugmessage("saved a new image to manifest:"+label);
	}else
	{
		Hybrid.debugmessage("canvasToImageManifest existing label :"+label+" replacing!");

	}
}

Hybrid.canvasToCanvas=_hybridCanvasToCanvas;
function _hybridCanvasToCanvas(hbc,hbc_source,x,y,r,s)
{
	if(r===undefined) r=0;
	if(s===undefined) s=1;
	if(x===undefined) x=0;
	if(y===undefined) y=0;
	var bw,bh;
	var sw,sh;
	var image;
	if(hbc_source.kind!=="hybridCanvas")
	{
			Hybrid.debugmessage("WARNING: canvasToCanvas '"+hbc_source.id+"' not a valid canvas");
			return;
	}
    image=hbc_source.canvas;
    // get the numbers from the canvas
    bw=hbc_source.w;
    bh=hbc_source.h;
	// before we screw with it
	hbc.context.save(); 
	// move to the middle of where we want to draw our image
	// scale the hybrid canvas (hbc) context;
	hbc.context.translate(x, y);
	// scale it
	hbc.context.scale(s, s);
	// rotate around that point, converting our 
	// angle from degrees to radians 
	hbc.context.rotate(r * Hybrid.TO_RADIANS);
    // draw it up and to the left by half the width
    // and height of the image 
    //image,sx,sy,sw,sh,dx,dy,dw,dh) source dest!
	hbc.context.drawImage(image,0,0,bw,bh,-bw/2,-bh/2,bw,bh);
	// and restore the co-ords to how they were when we began
	hbc.context.restore(); 	
}

Hybrid.drawBlockSprite=_hybridDrawBitmapBlockSprite;

function _hybridDrawBitmapBlockSprite(hbc,img_nr,x,y,f,r,sx,sy)
{
   if(r===undefined) r=0;
   if(sx===undefined) sx=1;
   if(sy===undefined) sy=sx;
   if(f===undefined) f=0;
   if(x===undefined) x=0;
   if(y===undefined) y=0;
   var bw,bh;
   var sw,sh;
   var image;
   if(typeof(Hybrid.graphics_manifest[img_nr])==="undefined")
   {
		Hybrid.debugmessage("WARNING: '"+img_nr+"' not in image manifest");
		return;
   }
   if(!Hybrid.graphics_manifest[img_nr].kind=="blocksprite")
   {
		Hybrid.debugmessage("WARNING: "+img_nr+" not a blocksprite");
		return;
   }else
   {
    // get the numbers from the graphics_manifest and ss data for the blocksprite!!
    bw=Hybrid.graphics_manifest[img_nr].ss.bw;
    bh=Hybrid.graphics_manifest[img_nr].ss.bh;
    sw=Hybrid.graphics_manifest[img_nr].ss.sw;
    sh=Hybrid.graphics_manifest[img_nr].ss.sh;
    image=Hybrid.graphics_manifest[img_nr].img;
   }
   // before we screw with it
   hbc.context.save(); 
   // move to the middle of where we want to draw our image
   // scale the hybrid canvas (hbc) context;
   hbc.context.translate(x, y);
   // scale it
   hbc.context.scale(sx, sy);
   // rotate around that point, converting our 
   // angle from degrees to radians 
   hbc.context.rotate(r * Hybrid.TO_RADIANS);
   // draw it up and to the left by half the width
   // and height of the image 
   //image,sx,sy,sw,sh,dx,dy,dw,dh) source dest!
   var px=(f%sw)*bw;
   var py=Math.floor(f/sw)*bh;
   hbc.context.drawImage(image, px,py,bw,bh,-bw/2,-bh/2,bw,bh);
   // and restore the co-ords to how they were when we began
   hbc.context.restore(); 
}
// end canvas sprite


// filters.
function _hybridFilterBlur( ctx, top_x, top_y, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;
	var context = ctx;
	var imageData;
	
	imageData = context.getImageData( top_x, top_y, width, height );
	var pixels = imageData.data;
	
	// for a blur, what we would do, is overlay the picture a number of times..
//	context.putImageData( imageData, top_x, top_y );
}

