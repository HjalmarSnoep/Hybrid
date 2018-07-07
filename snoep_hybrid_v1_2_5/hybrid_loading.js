 /*--
 SnoepGames: snoepHybrid loading
V1.2.0 
---*/
  
Hybrid.minloadtime=1000; // you can override this if you don't need loading!
Hybrid.autopreload=true; // this will always be true, unless you set it to false, if you do MANUALLY call this.
Hybrid.startPreload=_hybridDoPreload; // became a public function 
 
 
function _hybridDoPreload(){
 // this fills the data with information
 var i;
 Hybrid.progress_meter=0;
 Hybrid.preload_message="loading init\n"; // we start with the preload list empty!
 
 Hybrid.debugmessage("start Hybrid Preload");
 if(Hybrid.loadingProgressFunction!=null) Hybrid.loadingProgressFunction(0,true);
 
 // record the start time, to see if there is a timeout!
 Hybrid.preloadInitiationTime=new Date().getTime();


   Hybrid.images_preloaded=0;
   Hybrid.nr_of_image_files_to_preload=0;
  Hybrid.debugmessage("graphics_manifest: "+Hybrid.graphics_manifest);
  
   for(var all in Hybrid.graphics_manifest)
   {
		//Hybrid.debugmessage("graphics_manifest: "+all+" preload: "+Hybrid.graphics_manifest[all].preload);
		if(Hybrid.graphics_manifest[all].preload)
		{
			Hybrid.nr_of_image_files_to_preload++;
			//Hybrid.preload_message+="img: "+Hybrid.graphics_manifest[all].src+"\n";
		}
   }
	// now we know all about the images.
 
 // prepare how many audio files we actually have to preload!
 Hybrid.audio_preloaded=0;
 if(Hybrid.capabilities.audio_preload==true)
 {
   Hybrid.debugmessage("--preloading of audio supported!");
   Hybrid.audio_preloaded=0;
   Hybrid.nr_of_audio_files_to_preload=0;
 
   // now count all audo that is to be preloaded.
   
   // prepare the manifest with default values!
   for(i in Hybrid.audio_manifest)
   {
		Hybrid.audio_manifest[i].au={}; // create an au object, which will hold the actual audio!
		Hybrid.audio_manifest[i].loaded=false; // this is to have it work, even with a double event!  

		// if there is a audioContext, we HAVE to preload everything, including music!
		if(Hybrid.capabilities.audioContext==true)
		{
			 // have to preload ALL audio except music loops, they take a bit too long! 
			 if(Hybrid.audio_manifest[i].preload!=true)
			 {
				 Hybrid.audio_manifest[i].preload=true;   
				//Hybrid.preload_message+="AC switches preload to true: "+i+"\n";
			}
			 
		}
		// if there is NO audioContext and user forgets to set the preload attribute, default to true.
		// count undefined as true and set them!
		if(Hybrid.audio_manifest[i].preload===undefined)
		{
			Hybrid.preload_message+="preload auto switched to true: "+i+"\n";
			 Hybrid.audio_manifest[i].preload=true;
		}
		// if no src given, default to the key!
		if(Hybrid.audio_manifest[i].src===undefined) Hybrid.audio_manifest[i].src=i; 
		// if no volume given, default to 1
		if(Hybrid.audio_manifest[i].vol===undefined) Hybrid.audio_manifest[i].vol=1; 
   }
   // now count all that is to be preloaded.
   for(i in Hybrid.audio_manifest)
   {
		if(Hybrid.audio_manifest[i].preload)
		{
			Hybrid.nr_of_audio_files_to_preload++;
		}
   }
  }else
  {
	  // no support for preload, don't even try it!
		Hybrid.nr_of_audio_files_to_preload=0;
  }
  // now we have made the audio manifest a little bit better,
  // we preload the images, after these are done, the audio will be preloaded.
   Hybrid.debugmessage("starting preload of: "+Hybrid.nr_of_image_files_to_preload+", images");

	Hybrid.startLoop(_hybridLoadingLoop,100); // we update every 10th of a second !

   _hybridPreloadImages();
};


$.extend({
    getManyCss: function(urls, callback, nocache){
        if (typeof nocache=='undefined') nocache=false; // default don't refresh
        $.when(
            $.each(urls, function(i, url){
                if (nocache) url += '?_ts=' + new Date().getTime(); // refresh? 
                $.get(url, function(){
                    $('<link>', {rel:'stylesheet', type:'text/css', 'href':url}).appendTo('head');
                });
            })
        ).then(function(){
            if (typeof callback=='function') callback();
        });
    },
});

// this is used to load the webfonts and fire a callback when they are loaded!
// the issue is NOT solved, alas!
/*$.extend({
    getCss: function(urls, callback, nocache){
        if (typeof nocache=='undefined') nocache=false; // default don't refresh
        $.when.apply($,
            $.map(urls, function(url){
                if (nocache) url += '?_ts=' + new Date().getTime(); // refresh? 
                return $.get(url, function(){                    
                    $('<link>', {rel:'stylesheet', type:'text/css', 'href':url}).appendTo('head');                    
                });
            })
        ).then(function(){
            if (typeof callback=='function') callback();
        });
    },
});

// preloading of all webfonts in Hybrid.font_manifest (objects!)
// tested in Safari, Chrome, Firefox, Opera, IE7, IE8, IE9:
function _hybridPreloadFonts(callback)
{
	//<link rel="stylesheet" href="">
	var fonts=Hybrid.font_manifest;
	var cssfiles=[];
	for(var i = 0;i<fonts.length;i++) 
	{
		cssfiles.push(Hybrid.font_path+fonts[i].font+'/font.css');
	}
//	console.log("loading "+JSON.stringify(cssfiles));
	//
	$.getManyCss(cssfiles, callback); // add true if you want to add no cache!

	// this will load it, but it doesn't wait for the resource to actually load, callback is fired anyway!
	
	// possible solutions..
// http://stackoverflow.com/questions/4383226/using-jquery-to-know-when-font-face-fonts-are-loaded
// with callback.
// http://stackoverflow.com/questions/3498647/jquery-loading-css-on-demand-callback-if-done
	
};*/
function _hybridPreloadFonts(callback)
{
	callback(); // look at solution above.. Best way I've found: just add in regular stylesheet with an @import.. That seems to work and is flexible.
	// tested with google fonts, architects daughter turns out to be a google font as well.
}

Hybrid.loadImagesFromManifest==_hybridDynamicLoadFromManifest;
Hybrid.dynamicImageLoadCallback=null;
function _hybridDynamicLoadFromManifest(callback){
	Hybrid.dynamicLoadCallback=callback;
	Hybrid.debugmessage("attempting dynamic load.");
	Hybrid.preload_message+="attempting dynamic load.\n";

	var i;
	if(Hybrid.loadingProgressFunction!=null) Hybrid.loadingProgressFunction(0,true);
	// record the start time, to see if there is a timeout!
	Hybrid.preloadInitiationTime=new Date().getTime();

	Hybrid.image_daisychainlist=[];
	// now push all images that are to be preloaded.
	for(var all in Hybrid.graphics_manifest)
	{
		if(Hybrid.graphics_manifest[all].preload==true && Hybrid.graphics_manifest[all].loaded==false)
		{
			Hybrid.debugmessage("graphics_manifest: "+all+" unloaded");
		}
    }
//   Hybrid.debugmessage("starting preload of: "+Hybrid.nr_of_image_files_to_preload+", images");
//   _hybridPreloadImages();
};

function _hybridPreloadImages(){
	//Hybrid.debugmessage("-preloading images");
	_hybridCheckGraphicsManifest(); // check integrity of manifest!
	
	Hybrid.indexedPreload=[];
	for(var all in Hybrid.graphics_manifest)
    {
		if(Hybrid.graphics_manifest[all].preload)
		{
			Hybrid.indexedPreload.push(all);
		}
    }
	_hybridPreloadNextImage();
};
function _hybridPreloadNextImage()
{
	if(Hybrid.indexedPreload.length==0)
	{
	 // we are done preloading images.
	 Hybrid.debugmessage("--all images preloaded.");
	_hybridPreloadSounds(true); // with callback, this is the normal loop!
	}else
	{
		var i=Hybrid.indexedPreload.shift(); // gets the first image!
		Hybrid.currentImageIndex=i;
		Hybrid.debugmessage("--initiating preload of: "+i);
	  //Hybrid.debugmessage("preloading images");
	  // take an image from the stack and preload it!
	//  for(var i in Hybrid.graphics_manifest){
		if(Hybrid.graphics_manifest[i].preload){
			Hybrid.graphics_manifest[i].img= new Image(); // we DON't Use jquery, it's broken for loading images and this works fine cross browser.
			Hybrid.graphics_manifest[i].img.onerror=_hybridImagePreloadFailed;
			if(Hybrid.graphics_manifest[i].src.substr(0,5)=="data:")
			{
				Hybrid.debugmessage("direct dataurl found in image manifest!");
				Hybrid.graphics_manifest[i].img.src=Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			}else
			{
				Hybrid.graphics_manifest[i].img.src=Hybrid.img_src_path+Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			}
			Hybrid.currentLoadingUrl=Hybrid.img_src_path+Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			Hybrid.preload_message+="opening img "+Hybrid.currentLoadingUrl+"\n";
			Hybrid.graphics_manifest[i].img.alt=Hybrid.currentLoadingUrl;
			Hybrid.graphics_manifest[i].img.onload=_hybridPreloadNextImage;
		}
		// daisy chaining means we minimise the amount of requests at the same time!
	}
 };
 Hybrid.addToManifest=_hybridAddToManifest;
 function _hybridAddToManifest(o,i,sk,cb)
 {
	// checks if this item is allready IN the manifest, if so, it does NOTHING!
	
	if(typeof(Hybrid.graphics_manifest[i])!=="undefined")
	{	
		Hybrid.debugmessage("addToManifest reports: Version of "+i+" is allready in manifest, callback called");
		cb();
		return;
	}
 
	Hybrid.debugmessage("Hybrid.addToManifest "+i+" <-"+o);
	// add and object to the manifest as
	Hybrid.graphics_manifest[i]=o;
	// also start loading this image if required
	if(Hybrid.graphics_manifest[i].preload)
	{
		Hybrid.graphics_manifest[i].img= new Image(); // we DON't Use jquery, it's broken for loading images and this works fine cross browser.
		Hybrid.graphics_manifest[i].img.onerror=_hybridImagePreloadFailed;
		if(sk=="dataURL")
		{
			Hybrid.graphics_manifest[i].img.src=Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			Hybrid.currentImageIndex="data-url:"+i; // keep a ref tot the img, to use with canvas.
		}else
		{
			Hybrid.graphics_manifest[i].img.src=Hybrid.img_src_path+Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			Hybrid.graphics_manifest[i].img.alt=Hybrid.img_src_path+Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			Hybrid.currentLoadingUrl=Hybrid.img_src_path+Hybrid.graphics_manifest[i].src; // keep a ref tot the img, to use with canvas.
			Hybrid.currentImageIndex="extra file: "+i;
		}
		if(typeof(cb)!=="undefined")Hybrid.graphics_manifest[i].img.onload=cb
	}
 }
 Hybrid.checkAllImagesLoaded=_hybridCheckAllImagesLoaded;
 function _hybridCheckAllImagesLoaded()
 {
	var i=0;
	for(i=0;i<Hybrid.graphics_manifest.length;i++)
	{
		if(Hybrid.graphics_manifest[i].preload)
		{
			if(_hybridIsImageOk(i)==false)
			{
				return false;
			}
		}
	}
	return true;
 }
 // this function determines if a natural image is complete or not!
 function _hybridIsImageOk(i) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!Hybrid.graphics_manifest[i].img.complete) {
        return false;
    }
    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.
    if (typeof Hybrid.graphics_manifest[i].img.naturalWidth !== "undefined" && Hybrid.graphics_manifest[i].img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}
 

// -------------------------------------------
// Pre loading sound!
// -------------------------------------------

 function _hybridPreloadSounds(setCallback){
	Hybrid.debugmessage("-preloading sounds");
	var i;
	if(Hybrid.nr_of_audio_files_to_preload==0)
	{
		Hybrid.debugmessage("--no sound to preload");
		//_hybridDonePreloading(); called by loop!
	}else
	{
		if (Hybrid.capabilities.audiotype === 'ogg') {
			for(i in Hybrid.audio_manifest)
			{
				if(Hybrid.audio_manifest[i].preload)
				{
					if(Hybrid.capabilities.audioContext)
					{
						Hybrid.currentLoadingUrl="snd_ogg/"+Hybrid.audio_manifest[i].src+".ogg"; // keep a ref tot the img, to use with canvas.
						console.log("sound file "+Hybrid.currentLoadingUrl);
						_hybridLoadAudioIntoContext(i,"snd_ogg/"+Hybrid.audio_manifest[i].src+".ogg",setCallback); 
						Hybrid.preload_message+="opening snd ac "+Hybrid.currentLoadingUrl+"\n";
					}else
					{
						Hybrid.currentLoadingUrl="snd_ogg/"+Hybrid.audio_manifest[i].src+".ogg"; // keep a ref tot the img, to use with canvas.
						console.log("sound file "+Hybrid.currentLoadingUrl);
						Hybrid.audio_manifest[i].au  = _hybridLoadAudioTag("snd_ogg/"+Hybrid.audio_manifest[i].src+".ogg",setCallback); 
						Hybrid.preload_message+="opening snd "+Hybrid.currentLoadingUrl+"\n";
					}
				}
			}
		}
		if (Hybrid.capabilities.audiotype === 'mp3')
		{ 
			for(i in Hybrid.audio_manifest)
			{
				Hybrid.debugmessage("we'll preload mp3 "+i);
				if(Hybrid.audio_manifest[i].preload)
				{
					if(Hybrid.capabilities.audioContext)
					{
						Hybrid.currentLoadingUrl="snd_mp3/"+Hybrid.audio_manifest[i].src+".mp3"; // keep a ref tot the img, to use with canvas.
						console.log("sound file "+Hybrid.currentLoadingUrl);
						_hybridLoadAudioIntoContext(i,"snd_mp3/"+Hybrid.audio_manifest[i].src+".mp3",setCallback);
						Hybrid.preload_message+="opening snd ac"+Hybrid.currentLoadingUrl+"\n";
					}else
					{
						Hybrid.currentLoadingUrl="snd_mp3/"+Hybrid.audio_manifest[i].src+".mp3"; // keep a ref tot the img, to use with canvas.
						console.log("sound file "+Hybrid.currentLoadingUrl);
						Hybrid.audio_manifest[i].au = _hybridLoadAudioTag("snd_mp3/"+Hybrid.audio_manifest[i].src+".mp3",setCallback);
						Hybrid.preload_message+="opening snd "+Hybrid.currentLoadingUrl+"\n";
					}      
				}
			}
		}
	}
};
 
 // private function to shut everything off.
function _hybridDonePreloading(){
	Hybrid.debugmessage("--done preloading has been called!");
	Hybrid.preload_message+="done preloading\n";

	if(Hybrid.stopLoop()) // if there is still a loop to stop!!
	{
		// this will be done ONLY once!
		Hybrid.debugmessage("--Done Preloading");
		if(Hybrid.initPageFunction) Hybrid.initPageFunction();
		else Hybrid.debugmessage("'initPageFunction' not Defined");
	}
};
// -------------------------------------------
// Loading loop and feedback.
// -------------------------------------------
 function _hybridLoadingLoop(){
  Hybrid.loading_time=new Date().getTime()-Hybrid.preloadInitiationTime;
  Hybrid.debugmessage("--loading time: "+ Hybrid.loading_time);
  
  // allow for empty manifests, 0/0 is undefined :)
  var img_factor;
  if(Hybrid.nr_of_image_files_to_preload==0) 
	img_factor=1; 
  else
	img_factor=(Hybrid.nr_of_image_files_to_preload-Hybrid.indexedPreload.length)/Hybrid.nr_of_image_files_to_preload;
  
  var audio_factor;
  if(Hybrid.nr_of_audio_files_to_preload==0)
	audio_factor=1; // allow for empty manifests, 0/0 is undefined :)
  else
	audio_factor=Hybrid.audio_preloaded/Hybrid.nr_of_audio_files_to_preload; 
    
  Hybrid.debugmessage("---img_factor: "+img_factor+" = "+(Hybrid.nr_of_image_files_to_preload-Hybrid.indexedPreload.length)+"/"+Hybrid.nr_of_image_files_to_preload);
  Hybrid.debugmessage("---audio_factor: "+audio_factor+" = "+Hybrid.audio_preloaded+"/"+Hybrid.nr_of_audio_files_to_preload);
  
  var loading_percentage=(img_factor+audio_factor)/2; // the generation sweep will start after loading!
  // show what is going on!
  // low pass it so things don't stop happening..
  Hybrid.progress_meter=Hybrid.progress_meter*0.5+0.5*loading_percentage;
  if(Hybrid.loadingProgressFunction!=null) Hybrid.loadingProgressFunction(Hybrid.progress_meter,false);
  
//  if(Hybrid.loading_time>15000)
//  {
//   //debugmessage("preloading more than 5 seconds, probably stuck, try to force a start!");
//     loading_percentage=1;
//  }
  if(loading_percentage>=1 && Hybrid.loading_time>Hybrid.minloadtime) // must preload for at least one second!
  {
	Hybrid.debugmessage("loading_percentage: "+loading_percentage);
	_hybridDonePreloading();
  }
 };