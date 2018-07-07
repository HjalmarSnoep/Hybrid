 /*--
 SnoepGames: snoepHybrid youtube
V1.2.0 
---*/
 
Hybrid.current_Youtube=null;
Hybrid.youtubePopup=_hybridYoutubePopup;

function _hybridYoutubePopup(layer,x,y,w,h,id)
{
  if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
  {
   debugmessage("createYoutube reports: not the right kind of object to attach to: "+layer.kind);
   return null;
  }
  var o={};
  Hybrid.debugmessage("create Youtube Iframe");
  o.id="hybridIframe"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  o.kind="hybridIframe";
  o.label=id;
  o.container=Hybrid.createBox(layer,x,y,w+5,h+5); // this is needed to position it..
  Hybrid.setBoxColor(o.container,"rgba(0,0,0,0.8)");
  o.jquery=o.container.jquery; // must have this to be able to hide it.
  o.container.jquery.html("<a href='javascript:closeCurrentYoutube()'><img src='../static/img/generic_close.png' width='"+toPx(24)+"' height='"+toPx(24)+"'></a>");  
  // create a button with a standard callback!
  
  o.video=Hybrid.createBox(o.container,0,24,w+5,h-24); // this is needed to position it..
  var html="";
  html='<iframe width="' + toPx(w) + '" height="' +  toPx(h-24) + '" src="//www.youtube.com/embed/' + id + '?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>';
  o.video.jquery.html(html);
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global element counter!
  // create a box with a cross!
  Hybrid.current_Youtube=o;
  return o; // return the object!
 }
 function closeCurrentYoutube()
 {
	Hybrid.debugmessage("closeCurrentYoutube");
	if(Hybrid.current_Youtube!=null)
	{
		Hybrid.removeElement(Hybrid.current_Youtube);
		Hybrid.current_Youtube=null;
	}
 }
 
 // keep url and stuff 
Hybrid.youtube={};
Hybrid.youtube.initialised=false;
Hybrid.youtube.initcallback=null;
 
Hybrid.createYoutubePlayer=_hybridCreateYoutubePlayer;
function _hybridCreateYoutubePlayer(l,x,y,w,h,src,callback)
{
	if(Hybrid.youtube.initialised)
	{
		//Hybrid.debugmessage("Hybrid.youtube.initialised==true");
		var o={};
		o.parent=l;
		o.box=Hybrid.createBox(l,x,y,w,h);
		o.box2=Hybrid.createBox(o.box,0,0,w,h); // this box will be replaced by the youtube player!
		o.kind="youtube_player";
		o.box_id=o.box2.id;
		Hybrid.debugmessage("box id set"+o.box_id);
		o.s=-1;
		o.jquery=o.box.jquery; // this causes it to destroy right..
		// create a hybrid div 
		var eventsObject={
				'onReady': onPlayerReadyAutoPlay, // this is default..
				'onStateChange': callback
			  };
		//Hybrid.debugmessage("eventsObject: "+JSON.stringify(eventsObject)); // this won't be stringyfied, because JSON doesn't stringify functions??
		var w=Math.round(w*Hybrid.f);
		var h=Math.round(h*Hybrid.f);
		var playerVars={'rel': 0,'controls':0,'modestbranding':1,'showinfo':0};
		var initObject={
			  x:  0,
			  y: 0,
			  width:  w,
			  height: h,
			  playerVars: playerVars,
			  videoId: src,
			  events: eventsObject
			}
		Hybrid.debugmessage(JSON.stringify(initObject));
		Hybrid.debugmessage("placing player in box with id: "+o.box_id); // this won't be stringyfied, because JSON doesn't stringify functions??
		
		 player = new YT.Player(o.box_id, initObject);
		o.player=player;
		// no controls, so we set the volume.
		//player.setVolume(100); // this appears not to be a function.
		return o;
	}else
	{
		Hybrid.showWarning("Before playing a video, please wait for the player api script to be initialised.");
	}

}
// autoplay video
function onPlayerReadyAutoPlay(event) 
{
    event.target.playVideo();
}
Hybrid.clearYoutube=_hybridClearYoutube;
 function _hybridClearYoutube(o)
 {
	//Hybrid.debugmessage("clearYoutube"+o.player);
	if(typeof(o.player.stopVideo)!=="undefined")
	{
		o.player.stopVideo();
		if(typeof(o.player.clearVideo)!=="undefined") o.player.clearVideo();
		// is deprecated if as3 player :(
		o.player.destroy(); // removes the iframe!
	}
	Hybrid.removeElement(o.box); // remove the box as well!
}
 
Hybrid.initYoutubeApi=_hybridinitYoutubeApi;
function _hybridinitYoutubeApi(callback)
{
	if (!Hybrid.youtube.initialised) 
	{
		Hybrid.youtube.initcallback=callback;
		Hybrid.debugmessage("youtube script needs to be loaded first.");
		// see https://developers.google.com/youtube/iframe_api_reference
		 var tag = document.createElement('script');
		 tag.src = "https://www.youtube.com/iframe_api";
		 var firstScriptTag = document.getElementsByTagName('script')[0];
		 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//		var html='<script id="youtube_player_api" src="http://www.youtube.com/player_api"></script>'; // add this script to the page (at runtime!)
//		Hybrid.youtube.initcallback=callback;
//		$( "body" ).append(html);
	}else
	{
		Hybrid.debugmessage("youtube script exists");
		callback();
	}
}
function onYouTubeIframeAPIReady()
{
	Hybrid.debugmessage("Youtube is ready for use!");
	Hybrid.youtube.initialised=true;
	if(Hybrid.youtube.initcallback!=null)
	{
		Hybrid.debugmessage("call callback");
		Hybrid.youtube.initcallback();
	}
}
