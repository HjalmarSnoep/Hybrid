 /*--
 SnoepGames: snoepHybrid - audio
 
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
// initial values!
Hybrid.switches.sound = true;  // this will be set on user agent, that sucks, but that's just how it is right now.
Hybrid.switches.music = true;  // if we have a small sound on first touch, it is no longer necessary to distinguish between sound and music. 
Hybrid.audio_preloaded = 0; // progress counters!
Hybrid.nr_of_audio_files_to_preload = 0; // total of audio files to be preloaded, not always the whole manifest!

//Hybrid.audio_manifest['init_sound']={preload: true};// this is contained in the library itself it's a default.

function _hybridSwitchSound(value)
{
 if(value==false)
  {
	var all;
	for(all in Hybrid.audio_manifest)
	{
		// if loop is true it's probably music!
		if(Hybrid.audio_manifest[all].loop!=true)
		{
			Hybrid.stopSound(all);
		}
	}
  }
  Hybrid.setSwitch("sound",value);
  _hybridHideContextMenu(); // if you selected this option from this menu, it dissapears to show you the right context next time!
  // we need to also mute all sounds playing now if you selected that
}
function _hybridSwitchMusic(value)
{
  if(value==false)
  {
	Hybrid.debugmessage("muting all audio loops marked as music");
	var all;
	for(all in Hybrid.audio_manifest)
	{
		// if loop is true it's probably music!
		if(Hybrid.audio_manifest[all].music==true) // special thing, set by startmusicloop!
		{
			if(Hybrid.audio_manifest[all].started)
			{
				// keep the loop for restoring!
				Hybrid.muted_music_loop=all;
			}
			Hybrid.debugmessage(all+" loop? "+Hybrid.audio_manifest[all].loop);
			Hybrid.stopMusicLoop(all);
		}
	}
  }
  // now we set the switch, other wise, we can't stop them!
   Hybrid.setSwitch("music",value);
  _hybridHideContextMenu(); // if you selected this option from this menu, it dissapears to show you the right context next time!

  if(value==true)
  {
	Hybrid.debugmessage("restoring all audio loops marked as music");
	if(typeof(Hybrid.muted_music_loop)!=="undefined" && Hybrid.muted_music_loop!="")
	{
		Hybrid.startMusicLoop(Hybrid.muted_music_loop);
		Hybrid.muted_music_loop="";// clear it!
	}

	// restore the loop after setting the switch!!
	Hybrid.debugmessage("Audio Loop Keeper:"+Hybrid.audioLoopKeeper);
  }
  
}
// This function is private and called in hybrid_init in the _hybridGetCapabilities sweep!
function _hybridTestForAudioSupport(){

  // here we test for audio object creation support!!!
  var a = document.createElement('audio');
  // prefer mp3, but allow ogg for some!
  // assume the best situation and then eliminate
  Hybrid.capabilities.sound=true;
//  Hybrid.capabilities.sound_active=false; // this is for iPads and the like.
  Hybrid.capabilities.audio_preload=true;
  Hybrid.capabilities.music=true;
  Hybrid.switches.sound=true; // these can be overridden by a user, or for debugging!
  Hybrid.switches.music=true; // these can be overridden by a user, or for debugging!

  // try to fill it automatically!
  var ogg = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
  if (ogg) Hybrid.capabilities.audiotype='ogg';
  // but prefer mp3, more support!
  Hybrid.debugmessage("audio checks browser:"+Hybrid.platform.browser+" so (Hybrid.platform.browser!='firefox') :"+(Hybrid.platform.browser!="firefox") );
  if(Hybrid.platform.browser!="firefox") // sorry firefox, but you suck at mp3, it is still necessary because of a bug in the NEW version (31.0!
  {
    
	  var mp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	  if (mp3) Hybrid.capabilities.audiotype='mp3';
	  else
	  {
	   Hybrid.capabilities.audiotype="";
	  }
  }else
  {
  	Hybrid.debugmessage("no you can't play mp3 firefox!");
  }
  // now we test for full on webaudio support in all possibly available flavours
  // see article:http://chimera.labs.oreilly.com/books/1234000001552/ch01.html#s01_2
  // this also includes future implementations!
  var contextClass = (window.AudioContext ||  window.webkitAudioContext ||  window.mozAudioContext ||  window.oAudioContext ||  window.msAudioContext);
  if (contextClass) 
  {
    // Web Audio API is available.
	Hybrid.audioContextReference = new contextClass();
	Hybrid.capabilities.audioContext=true; // huzza,we can do a lot now!
	
  } else 
  {
	Hybrid.capabilities.audioContext=false;
  }
  // webaudio support
  
  //window.alert("Testversion!"+Hybrid.platform.device+","+Hybrid.platform.OS+","+Hybrid.platform.browser);

  switch(Hybrid.platform.browser)
  {
   case "firefox":
    Hybrid.capabilities.audiotype='ogg';
   break;
   case "chrome":
    if(Hybrid.capabilities.audioContext)
    {
     Hybrid.capabilities.audiotype='mp3';
     Hybrid.capabilities.sound=true;
     Hybrid.capabilities.audio_preload=true; // and we preload everything!!
     Hybrid.switches.sound=true;
     //debugmessage("CHROME, Hybrid.capabilities.audioContext=true; ");     
    }else
    {
     Hybrid.capabilities.audiotype='mp3';
     Hybrid.capabilities.sound=true;
     Hybrid.capabilities.audio_preload=true;
     Hybrid.switches.sound=true;
    }
   break;
   case "android":
    if(Hybrid.capabilities.audioContext)
    {
     Hybrid.capabilities.sound=true; // if there is no support forwebaudio, this is an old android and you are screwed!
     Hybrid.switches.sound=true;
     Hybrid.capabilities.audiotype="mp3"; // not ogg and not mp3!
     Hybrid.capabilities.audio_preload=true; // not ogg and not mp3!
     //debugmessage("ANDROID, Hybrid.capabilities.audioContext=true; ");     
    }else
    {
     Hybrid.capabilities.sound=false; // if there is no support forwebaudio, this is an old android and you are screwed!
     Hybrid.switches.sound=false;
     Hybrid.capabilities.audiotype="mp3"; // not ogg and not mp3!
     Hybrid.capabilities.audio_preload=false; // not ogg and not mp3!
     //debugmessage("ANDROID, Hybrid.capabilities.audioContext=false; ");     
    }
   break;
   case "safari":
   	
	if(Hybrid.platform.OS == 'Mac') 
	{
		// we might make this an option if you want to warn for mac safari!
		//Hybrid.showWarning("Safari on the Mac has a problem with webaudioapi. Fallback to limited audio. Try Chrome for better performance.");
		// this means we are on a mac on safari..
		// webaudio is not working there as a default!
		// that should work, but alas Mac is not a stickler for standards. This was tested with safari on Mariska's computer.
		// version follows.
		// so we fall back to non audioContext
		Hybrid.capabilities.audioContext=false; // shut it down and go for the fallback on MAC desktops!
	}
	// but this WORKS on iOs7 (iPad), so we need to make a manual check if we are on MAC or on iPad.
	if(Hybrid.platform.device == 'iPad') 
	{
		switch(Hybrid.platform.OS)
		{
			case "iOs5":
				Hybrid.capabilities.audioContext=false; 
			break;
			case "iOs6":
				Hybrid.capabilities.audioContext=true;  // we give it the benefit of the doubt..
			break;
			case "iOs7":
				Hybrid.capabilities.audioContext=true; 
			break;
			default:
				Hybrid.capabilities.audioContext=true; 
			break;
		}
	}

    if(Hybrid.capabilities.audioContext)
    {
     Hybrid.capabilities.sound=true;
     Hybrid.switches.sound=true;
     Hybrid.switches.music=true;
     Hybrid.capabilities.audiotype="mp3"; // mp3 should be supported from 3.1 
     Hybrid.capabilities.audio_preload=true; 
    }else
    {
  	 Hybrid.capabilities.audioContext=false; // we need to set it hard, or it will all fall to pieces on mac!
     Hybrid.capabilities.sound=true;
     Hybrid.switches.sound=false; // this seems to be safe, users can turn it back on, if they please!
     Hybrid.switches.music=true;
     Hybrid.capabilities.audiotype="mp3"; // not ogg and but mp3 should be supported! 
     Hybrid.capabilities.audio_preload=false; // not ogg and not mp3!
     Hybrid.debugmessage("We are on Safari so Hybrid.capabilities.sound=true, but no preload! Music on is default");
    }
   break;
  }
 }
 
 // loading functions
 
 // for more info: https://developer.mozilla.org/es/docs/XMLHttpRequest/Usar_XMLHttpRequest
 // http://chimera.labs.oreilly.com/books/1234000001552/ch01.html#s01_8
 function _hybridLoadAudioIntoContext(nr,url,setCallback)
 {
  var request = new XMLHttpRequest(); // if webaudio api available, so is this!
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
//  request.onerror = function(){console.log("error" + request.status)}  
  // Decode asynchronously
	  
	request.onreadystatechange = function(e) {
		Hybrid.debugmessage("this.readyState"+this.readyState);
		Hybrid.debugmessage("this.status"+this.status);
		if(this.status==404)
		{
			// cannot find it anywhere!
			_hybridXMLHttpErrorHandler("error opening audio: "+url)
		}
	};
  
  request.onload = function() 
  { 
		Hybrid.debugmessage("Audio preloaded:"+nr);
		Hybrid.preload_message+="preloaded snd ac "+nr+"\n";
		Hybrid.audioContextReference.decodeAudioData(request.response, function(theBuffer){
		   Hybrid.audio_manifest[nr].buffer = theBuffer;
		   Hybrid.audio_manifest[nr].hasAudioContext = true;

		   // after decode, set the progress of loading (if necessary and wanted!)..
			if(setCallback)
			{
				if(Hybrid.audio_manifest[nr].loaded==false)
				{
					 Hybrid.audio_preloaded++;
					 Hybrid.audio_manifest[nr].loaded=true;
				}
				if ( Hybrid.audio_preloaded == Hybrid.nr_of_audio_files_to_preload) 
				{
					 Hybrid.debugmessage("all audio has been preloaded");
					 _hybridDonePreloading();  
					 return;
				}
				if(Hybrid.capabilities.audio_preload==false)
				{
					 // in theory this could be called more than once, so we have a watchvariable on allAudioLoaded..
					 Hybrid.debugmessage("skip rest because we have no audio preload support!");
					 _hybridDonePreloading();  // skip audio if no support!
					 return;
				}
			} // end of set Callback
		}, _hybridAudioDecodeError); // end of decode audio callback function definition
  } // end of request onload function definition
  request.send();
 }
 function _hybridLoadAudioTag(url,setLoadHandler)
 {
  var audio = new Audio();
  if(setLoadHandler==true)
  {
   $(audio).on("loadeddata", _hybridAudioFileLoadedHandler);  // jQuery checking
   $(audio).on("canplay canplaythrough", _hybridAudioFileLoadedHandler);  //  this will give you a million hits in Chrome
    $(audio).on("error", _hybridAudioTagLoadError);
   // this seems to keep on firing
  }
  audio.preload = "auto";
  audio.vol = 1; // default!
  audio.src = url;
  return audio;
 }
 
  // Audio preloader functions
 function _hybridAudioFileLoadedHandler()
 {
	Hybrid.audio_preloaded++;
//  if(audio_preload<=audio_to_preload)
//  {
//   debugmessage("AUDIO FILE "+audio_preload+"/"+audio_to_preload+" loaded" );
//   }
	if ( Hybrid.audio_preloaded == Hybrid.nr_of_audio_files_to_preload) 
	{
		Hybrid.debugmessage("all audio has been preloaded");
		_hybridDonePreloading();  
		return;
	}
	if(Hybrid.capabilities.audio_preload==false)
	{
		// in theory this could be called more than once, so we have a watchvariable on allAudioLoaded..
		Hybrid.debugmessage("skip rest because we have no audio preload support!");
		_hybridDonePreloading();  // skip audio if no support!
		return;
	}
 }
 // ---------------------------------
 // Music Loop functions! START
 // ---------------------------------
Hybrid.audioLoopKeeper="";
Hybrid.audioLoopBufferSource=-1;
Hybrid.musicLoopVolume=0.4; // this is a default value for all loops! you can change it with Hybrid.changeLoopVolume(loop_name, volume);
Hybrid.startMusicFailTryAgainSource="";
Hybrid.startMusicFailTimeOut=-1; // try again every two seconds, until it works!
  
Hybrid.startMusicLoop=_hybridStartMusicLoop;
Hybrid.stopMusicLoop=_hybridStopMusicLoop;

function _hybridStopMusicLoop(audio_id){
  if(audio_id=="") return; //this is for games, without music!
  if(Hybrid.switches.music)
  {
   if(Hybrid.capabilities.audioContext)
   {
		_hybridStopMusicLoopAudioContext(audio_id);
   }else
   {
		_hybridStopMusicLoopAudioTag(audio_id);
   }
  }
};

function _hybridStartMusicLoop(audio_id){
 if(audio_id=="") return; //this is for games, without music!
  if(Hybrid.switches.music)
  {
   if(Hybrid.capabilities.audioContext)
   {
		_hybridStartMusicLoopAudioContext(audio_id);
   }else
   {
		_hybridStartMusicLoopAudioTag(audio_id);
   }
  } 
};

 
function _hybridStartMusicLoopAudioContext(audio_id) {
   Hybrid.debugmessage("_hybridStartMusicLoopAudioContext for audio_id: "+audio_id+" - "+typeof(audio_id)+" source:"+Hybrid.startMusicFailTryAgainSource);
  if(typeof(audio_id)==="undefined" && Hybrid.startMusicFailTryAgainSource!="")
  {
   // we are probably retrying
   Hybrid.debugmessage("retrying for audio_id: "+Hybrid.startMusicFailTryAgainSource);
   audio_id=Hybrid.startMusicFailTryAgainSource;
   Hybrid.startMusicFailTimeOut=-1; // after all it's clear or this wouldn't fire
   //debugmessage(" probably a retry for "+audio_id);
  }
  var nr=audio_id;
  Hybrid.audioLoopKeeper=audio_id;
  if(typeof(Hybrid.audio_manifest[nr]) !== "undefined" && typeof(Hybrid.audio_manifest[nr].buffer) !== "undefined")
  {
		Hybrid.audio_manifest[nr].music=true;
		Hybrid.audio_manifest[nr].started=true;
		//debugmessage("set started for music loop:"+nr);
		if(1)//audioLoopBufferSource==-1) // theoretically works.
		{
			Hybrid.audioLoopBufferSource = Hybrid.audioContextReference.createBufferSource();
			// keep ref to stop it!
			Hybrid.audioLoopBufferSource.buffer = Hybrid.audio_manifest[nr].buffer;
			// set loop and volume!
			Hybrid.audioLoopBufferSource.loop=true;
			var gainNode = Hybrid.audioContextReference.createGain();
			// this fails on the Mac (Safari, chrome works fine), saying createGain is undefined and not a function
			// so if it's mac and safari, I'd say NO webaudio!
			
			// Connect the source to the gain node.
			Hybrid.audioLoopBufferSource.connect(gainNode);
			// Connect the gain node to the destination.
			gainNode.connect(Hybrid.audioContextReference.destination);
			gainNode.gain.value = Hybrid.musicLoopVolume;
			Hybrid.audioLoopBufferSource.start(0);
		}else
		{
			//debugmessage("buffer present, so just go:"+nr);
			Hybrid.audioLoopBufferSource.start(0);
		}
  }else
  {
	   //debugmessage(audio_id+" not loaded yet,let's try again in 2 secs..");
	   // this probably means, the preload didn't work yet..
	   // check if it's preloaded later and try again..
	   // trouble is now,we won't try that,it's just too damn risky!
	   Hybrid.startMusicFailTryAgainSource=audio_id;
	   Hybrid.debugmessage(audio_id+" buffer not ready yet, retry?");
	   if(Hybrid.startMusicFailTimeOut==-1)
	   {
			Hybrid.debugmessage(audio_id+" not ready yet, try again in 2000 ms");
			Hybrid.startMusicFailTimeOut=setTimeout(_hybridStartMusicLoopAudioContext,2000); // try again every two seconds, until it works!
		}
  }
 };
 function _hybridStartMusicLoopAudioTag(audio_id){
	var nr;
	if(audio_id=="") return; //this is for games, without music!
	if(Hybrid.audioLoopKeeper!=""){
		Hybrid.debugmessage("call stopMusicLoop first!");
		return;
	}
	Hybrid.audioLoopKeeper=audio_id;
	if(Hybrid.switches.music)
	{
		nr=audio_id;
		if(typeof(Hybrid.audio_manifest[nr]) !== "undefined")
		{
			// we need to start the music on the click!
			// if the page has embedded music, play it here!
			//music.play();
			var url="";
			if (Hybrid.capabilities.audiotype === 'ogg') {
				url="snd_ogg/"+nr+".ogg";
			} else if (Hybrid.capabilities.audiotype === 'mp3') { 
				url="snd_mp3/"+nr+".mp3";
			}
			if(url!='')
			{
				Hybrid.debugmessage("trying to start music file! '"+url+"' without preloading");
				Hybrid.audio_manifest[nr].au=new Audio(url); // IE works fine, but safari reports url is undefined!
				Hybrid.audio_manifest[nr].au.load();
				Hybrid.audio_manifest[nr].started=true;
				Hybrid.audio_manifest[nr].music=true;
				Hybrid.audio_manifest[nr].au.loop=Hybrid.audio_manifest[nr].loop;
				Hybrid.audio_manifest[nr].au.volume=Hybrid.musicLoopVolume; //audio_manifest[nr].vol; // standard soft for audio loops!
				
				Hybrid.audio_manifest[nr].au.play(); // safari for windows crashed here!!!
			}else
			{
				Hybrid.showWarning("Sorry, no sound capabilities found for this browser.");
				Hybrid.switches.music=false;
			}
		}
	}else
	{
		Hybrid.debugmessage("no music loop, because music is off!");
	}
 } 

 function _hybridStopMusicLoopAudioTag(audio_id){
   if(audio_id=="") return; //this is for games, without music!
   if(typeof(Hybrid.audio_manifest[audio_id])!=="undefined")
   {
    if(Hybrid.audio_manifest[audio_id].started)
    {
     Hybrid.audio_manifest[audio_id].au.pause();
     Hybrid.audio_manifest[audio_id].started=false;
     Hybrid.audioLoopKeeper="";
    }
   }
 };
 
function _hybridStopMusicLoopAudioContext(audio_id){
	

	if(Hybrid.startMusicFailTimeOut!=-1)
	{
		clearTimeout(Hybrid.startMusicFailTimeOut);
		Hybrid.startMusicFailTimeOut=-1;
	}
	if(typeof(Hybrid.audio_manifest[audio_id])==="undefined")
	{
		Hybrid.debugmessage("undefined audioloop:"+audio_id);
		return;
	}else
	{
		if(Hybrid.audio_manifest[audio_id].started)
		{
			if(Hybrid.audioLoopBufferSource)
			{
				Hybrid.audioLoopBufferSource.stop(0); // can give this a value, don't know what that is..
			}
			Hybrid.audioLoopKeeper="";
			Hybrid.audio_manifest[audio_id].started=false; // duh!
			Hybrid.audioLoopKeeper="";
		}
	}
 };

  // ---------------------------------
 // Music Loop functions! END
 // ---------------------------------
Hybrid.stopSound=_hybridStopSound;
function _hybridStopSoundTag(nr)
{
	var au=document.getElementById(nr);
	au.pause();
	au.currentTime = 0;
}
function _hybridStopSound(nr)
{
	if(Hybrid.audio_manifest[nr] !== undefined && Hybrid.audio_manifest[nr].use_tag==true)
	{
		_hybridStopSoundTag(nr);
		return;
	}	
	if(Hybrid.capabilities.sound==true && Hybrid.switches.sound!=false)
	{
		if(Hybrid.audio_manifest[nr] !== undefined)
		{
			if(Hybrid.audio_manifest[nr].started)
			{
				if(Hybrid.audio_manifest[nr].hasAudioContext)
				{
					if(Hybrid.audio_manifest[nr].buffer !== undefined)
					{
						Hybrid.audio_manifest[nr].source.stop(0);
						Hybrid.audio_manifest[nr].started=false;
					}else
					{
						Hybrid.debugmessage("sorry, no audio support via AudioContext of WebAudio.. Something went wrong..");
					}
				}else
				{
					// old fashioned way..
					if(typeof(Hybrid.audio_manifest[nr])!=="undefined")
					{
						 Hybrid.audio_manifest[nr].au.pause();
						 Hybrid.audio_manifest[nr].started=false;
					}
				}
			}
		}
	}
}
Hybrid.getSoundDuration=_hybridGetSoundDuration;
function _hybridGetSoundDuration(nr)
{
	if(Hybrid.capabilities.sound==true && Hybrid.switches.sound!=false)
	{
		//Hybrid.debugmessage("playSound "+nr);
		if(Hybrid.audio_manifest[nr] !== undefined)
		{
			if(Hybrid.audio_manifest[nr].hasAudioContext)
			{
				if(Hybrid.audio_manifest[nr].buffer !== undefined)
				{
					var source = Hybrid.audioContextReference.createBufferSource();
					return Hybrid.audio_manifest[nr].buffer.duration;
				}else
				{
					Hybrid.debugmessage("getSoundDuration, no audio support via AudioContext of WebAudio.. Something went wrong..");
					return -1;
				}
			}else
			{
				if(Hybrid.audio_manifest[nr].au !== undefined)
				{
					return Hybrid.audio_manifest[nr].au.duration;
				}else
				{
					Hybrid.debugmessage("getSoundDuration, no audio support");
				}
			}
		}
	}else
	{
		Hybrid.debugmessage("no sound support for this device")
	}
}
Hybrid.playSound=_hybridPlaySound;
function _hybridPlaySoundTag(nr)
{
	var au=document.getElementById(nr);
	au.play();
}
function _hybridPlaySound(nr)
{
	if(Hybrid.audio_manifest[nr] !== undefined)
	{
		if(Hybrid.audio_manifest[nr].use_tag==true) _hybridPlaySoundTag(nr);
		return;
	}
	if(Hybrid.capabilities.sound==true && Hybrid.switches.sound!=false)
	{
		//Hybrid.debugmessage("playSound "+nr);
		if(Hybrid.audio_manifest[nr] !== undefined)
		{
			if(Hybrid.audio_manifest[nr].hasAudioContext)
			{
				if(Hybrid.audio_manifest[nr].buffer !== undefined)
				{
					var source = Hybrid.audioContextReference.createBufferSource();
					source.buffer = Hybrid.audio_manifest[nr].buffer;
					source.connect(Hybrid.audioContextReference.destination);
					source.start(0);
					Hybrid.audio_manifest[nr].source=source; // keep it to be able to stop the sound!
					Hybrid.audio_manifest[nr].started=true; // keep it to be able to stop the sound!
					//debugmessage("start webaudio nr "+nr);
				}else
				{
					Hybrid.debugmessage("sorry, no audio support via AudioContext of WebAudio.. Something went wrong..");
				}
			}else
			{
				if(Hybrid.audio_manifest[nr].au !== undefined)
				{
					//debugmessage("I would now play sound "+nr)
					Hybrid.audio_manifest[nr].au.currentTime=0; // if you don't do this quick sounds will be lost!
					Hybrid.audio_manifest[nr].au.play(); // it seems to be that easy!*/
					Hybrid.audio_manifest[nr].started=true; // keep it to be able to stop the sound!
				}else
				{
					Hybrid.debugmessage("sorry, no audio support");
				}
			}
		}
	}else
	{
		Hybrid.debugmessage("no sound support for this device")
	}
}
 