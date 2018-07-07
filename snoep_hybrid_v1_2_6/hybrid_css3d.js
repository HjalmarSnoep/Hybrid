 /*--
 SnoepGames: snoepHybrid - layout
 V1.2.0 
---*/
 
 
 // example to do it with CSS only.. http://jsfiddle.net/2ub7xuvw/
 // this fails in IE.. Should have checked. There seems to be a work around with a translateZ, but that fails in Chrome.
 // http://lab.smashup.it/flip/ is  jquery plugin.
 // this is css only and works: http://davidwalsh.name/demo/css-flip.php
 
Hybrid.init3Dflipbox=_hybridInit3DFlipbox;
function _hybridInit3DFlipbox(obj, flipped)
{
	//Hybrid.debugmessage("Hybrid. init3Dflipbox");
/*

.flip-container {
	perspective: 1000;
	transform-style: preserve-3d;
}
*/

	// not using a container fixes the bug for IE! Yahoooo!


	// flipper: position: relative;

	obj.container.jquery.css("z-index","1"); // these might be hindering backface visibility!
	obj.side1.jquery.css("z-index","3"); // flip it the backside around to start!
	obj.side2.jquery.css("z-index","2"); // flip it the backside around to start!
	
	//Hybrid.debugmessage("sorry not implemented yet!")
	var persp=Hybrid.height;
	persp=500;
	obj.side1.jquery.css("perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-webkit-perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-ms-perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-moz-perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-o-perspective",persp+"px"); // this is default..
	
	obj.side2.jquery.css("perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-webkit-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-ms-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-moz-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-o-perspective",persp+"px"); // this is default..
	
	/*obj.side1.jquery.css("perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-webkit-perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-ms-perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-moz-perspective",persp+"px"); // this is default..
	obj.side1.jquery.css("-o-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-webkit-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-ms-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-moz-perspective",persp+"px"); // this is default..
	obj.side2.jquery.css("-o-perspective",persp+"px"); // this is default..*/

	obj.container.jquery.css("-webkit-transform-style","preserve-3d"); // this is default..
	obj.container.jquery.css("-ms-transform-style","preserve-3d"); // this is default..
	obj.container.jquery.css("transform-style","preserve-3d"); // this is default..
	
	obj.container.jquery.css("overflow","visible"); // this is default..
	// front
	//obj.side1.jquery.css("transform-origin","right center");
	//obj.side2.jquery.css("transform-origin","left center");
	
//	obj.container.jquery.css("-webkit-backface-visibility","hidden"); // hidden when flipped!
//	obj.container.jquery.css("-moz-backface-visibility","hidden");
//	obj.container.jquery.css("-o-backface-visibility","hidden");
//	obj.container.jquery.css("-ms-backface-visibility","hidden");
//	obj.container.jquery.css("backface-visibility","hidden");

	obj.side1.jquery.css("-webkit-transform-style","preserve-3d"); // this is default..
	obj.side1.jquery.css("-ms-transform-style","preserve-3d"); // this is default..
	obj.side1.jquery.css("transform-style","preserve-3d"); // this is default..

	obj.side2.jquery.css("-webkit-transform-style","preserve-3d"); // this is default..
	obj.side2.jquery.css("-ms-transform-style","preserve-3d"); // this is default..
	obj.side2.jquery.css("transform-style","preserve-3d"); // this is default..
	
	obj.side1.jquery.css("-webkit-backface-visibility","hidden"); // hidden when flipped!
	obj.side1.jquery.css("-moz-backface-visibility","hidden");
	obj.side1.jquery.css("-o-backface-visibility","hidden");
	obj.side1.jquery.css("-ms-backface-visibility","hidden");
	obj.side1.jquery.css("backface-visibility","hidden");
	
	obj.side2.jquery.css("-webkit-backface-visibility","hidden"); // hidden when flipped!
	obj.side2.jquery.css("-moz-backface-visibility","hidden");
	obj.side2.jquery.css("-ms-backface-visibility","hidden");
	obj.side2.jquery.css("-o-backface-visibility","hidden");
	obj.side2.jquery.css("backface-visibility","hidden");
	
	obj.side2.jquery.css("-webkit-transition","none"); // set animation style to none to prevent flipping..
	obj.side2.jquery.css("-moz-transition","none");
	obj.side2.jquery.css("-o-transition","none");
	obj.side2.jquery.css("transition","none");
	
	obj.side2.jquery.css("-webkit-transform","rotateY(180deg)"); // standard flipped, flipping container will unflip..
	obj.side2.jquery.css("ms-transform","rotateY(180deg)"); // standard flipped, flipping container will unflip..
	obj.side2.jquery.css("transform","rotateY(180deg)"); // standard flipped, flipping container will unflip..

	obj.side1.jquery.css("transform","rotateY( 0deg )"); // flip it the backside around to start!
	obj.side1.jquery.css("-ms-transform","rotateY( 0deg )"); // flip it the backside around to start!
	obj.side1.jquery.css("-webkit-transform","rotateY( 0deg )"); // f
	//obj.side1.jquery.css("transform-style","preserve-3d"); // this makes any children inherit the 3D stuff
	//obj.side2.jquery.css("transform-style","preserve-3d");


/*	obj.side1.jquery.css("-webkit-transition","none");
	obj.side1.jquery.css("-moz-transition","none");
	obj.side1.jquery.css("-o-transition","color 0 ease-in");
	obj.side1.jquery.css("transition","none");
	obj.side2.jquery.css("-webkit-transition","none");
	obj.side2.jquery.css("-moz-transition","none");
	obj.side2.jquery.css("-o-transition","color 0 ease-in");
	obj.side2.jquery.css("transition","none");*/

	//Hybrid.debugmessage("start flip box flipped: "+flipped);
	if(flipped!=true)
	{
		obj.flipped=false; // this will be flipped and executed!
	}else
	{
		obj.flipped=false; // this will be flipped and executed!
		_hybridFlipBoxCss3D(obj); // flip it will also flip the value!
	}
	//_hybridFlipBoxCss3D(obj); // flip back to set position
	
	// we would need a sleep time here.
	// after that, set that they cannot turn around any more, without animation.
	var length="0.4s";
	obj.side1.jquery.css("-webkit-transition","-webkit-transform "+length); // set animation style!
	obj.side1.jquery.css("-moz-transition","-moz-transform "+length);
	obj.side1.jquery.css("-o-transition","-o-transform "+length);
	obj.side1.jquery.css("transition","transform "+length);
	obj.side2.jquery.css("-webkit-transition","-webkit-transform "+length); // set animation style!
	obj.side2.jquery.css("-moz-transition","-moz-transform "+length);
	obj.side2.jquery.css("-o-transition","-o-transform "+length);
	obj.side2.jquery.css("transition","transform "+length);
//	obj.side2.jquery.css("-webkit-transition","-webkit-transform "+length); // set animation style!
//	obj.side2.jquery.css("-moz-transition","-moz-transform "+length);
//	obj.side2.jquery.css("-o-transition","-o-transform "+length);
//	obj.side2.jquery.css("transition","transform "+length);
	// remove the z-indices, cause they are bothering!
}

Hybrid.flipBoxCss3D=_hybridFlipBoxCss3D;
function _hybridFlipBoxCss3D(obj)
{
	obj.flipped=!obj.flipped;
	if(obj.flipped)
	{
		//obj.container.jquery.css("transform","rotateY( -180deg )"); // flip it the backside around to start!
		//obj.container.jquery.css("-ms-transform","rotateY( -180deg )"); // flip it the backside around to start!
		//obj.container.jquery.css("-webkit-transform","rotateY( -180deg )"); // flip it the backside around to start!
		obj.side2.jquery.css("-webkit-transform","rotateY(0deg)"); // standard flipped, flipping container will unflip..
		obj.side2.jquery.css("ms-transform","rotateY(0deg)"); // standard flipped, flipping container will unflip..
		obj.side2.jquery.css("transform","rotateY(0deg)"); // standard flipped, flipping container will unflip..

		obj.side1.jquery.css("transform","rotateY( 180deg )"); // flip it the backside around to start!
		obj.side1.jquery.css("-ms-transform","rotateY( 180deg )"); // flip it the backside around to start!
		obj.side1.jquery.css("-webkit-transform","rotateY( 180deg )"); // f
	}else
	{
		//obj.container.jquery.css("transform","rotateY( 0deg )"); // flip it the backside around to start!
		//obj.container.jquery.css("-ms-transform","rotateY( -0deg )"); // flip it the backside around to start!
		//obj.container.jquery.css("-webkit-transform","rotateY( -0deg )"); // flip it the backside around to start!
		obj.side2.jquery.css("-webkit-transform","rotateY(180deg)"); // standard flipped, flipping container will unflip..
		obj.side2.jquery.css("ms-transform","rotateY(180deg)"); // standard flipped, flipping container will unflip..
		obj.side2.jquery.css("transform","rotateY(180deg)"); // standard flipped, flipping container will unflip..

		obj.side1.jquery.css("transform","rotateY( 0deg )"); // flip it the backside around to start!
		obj.side1.jquery.css("-ms-transform","rotateY( 0deg )"); // flip it the backside around to start!
		obj.side1.jquery.css("-webkit-transform","rotateY( 0deg )"); // f

		//obj.side1.jquery.css("transform","translateZ(0px)");
		//obj.side2.jquery.css("transform","translateZ(-200px)");
//		obj.side1.jquery.css("transform","translateX( 0% ) rotateY( 0deg )"); // flip it the backside around to start!
//		obj.side2.jquery.css("transform","translateX( 100% ) rotateY( 180deg )"); // flip it the backside around to start!
	}
}