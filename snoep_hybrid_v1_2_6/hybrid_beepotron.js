Hybrid.beepotron={};

Hybrid.beepotron.beeps=[]; //Hybrid.beepotron.beeps that are playing or have been playing. 
Hybrid.beepotron.polyphony=1;
Hybrid.beepotron.play=beepotronPlaySfx;


Hybrid.beepotron.audioContext; // the default context you are going to hear!
if (typeof AudioContext !== "undefined") {
    Hybrid.beepotron.audioContext = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    /*jshint newcap:false*/
    Hybrid.beepotron.audioContext = new webkitAudioContext();
} else {
    window.alert("WebAudio isn't supported in this browser yet :-(");
	// supported browsers include Chrome, Firefox, Edge, Safari, Opera
    throw new Error('Beepotron reports: AudioContext not supported. :(');
}


function beepotronGetType(i)
{
    var tps=["sine","square","triangle","sawtooth"];
    return tps[i];
}
function beepotronCreateModulator(f,t,v)
{
    var o={};
	var actx=Hybrid.beepotron.audioContext;
    o.o=actx.createOscillator();
    o.t=beepotronGetType(t);
    o.o.type=o.t;
    o.f=f;
	//o.s=s;
    o.o.frequency.value = o.f;
    o.g=actx.createGain();
    o.gv=v;
    o.g.gain.value =o.gv;
    o.o.connect(o.g);
    return o;
}
function beepotronCreateCarrier(f,t,v)
{
	var actx=Hybrid.beepotron.audioContext;
    var o={};
	o.c=-1;
    o.o=actx.createOscillator();
    o.t=beepotronGetType(t)
    o.o.type=o.t;
    o.f=f;
    o.o.frequency.value = o.f;
    o.g=actx.createGain();
    o.gv=v;
    o.g.gain.value =o.gv;
    o.o.connect(o.g);
    return o;
}

function beepotronPlaySfx(r,v,pt,pn) // recipe, volume, pitch, pan, effect
{
	if(typeof(v)=="undefined") v=1;
	var actx=Hybrid.beepotron.audioContext;
	if(typeof(actx)=="undefined") 
	{
		console.log("not clear in which audio context you want me to beep: "+actx);
		return;
	}
 // if there is an old one and it needs stopping, stop it!
	var i;
    var now = actx.currentTime;
   if(Hybrid.beepotron.beeps.length!=0)
   {
//	    console.log("starting mod: "+JSON.stringify(Hybrid.beepotron.beeps));
	   for(i=0;i<Hybrid.beepotron.beeps.length;i++)
	   {
		   var b=Hybrid.beepotron.beeps[i];
		   var ts=new Date().getTime();
		   if((b.length+b.started)<ts)
		   {
			   //console.log(JSON.stringify(b.mod));
			   // we must stop it first.
				for(i=0;i<b.mod.length;i++)
				{
//					var d=b.mod[i].o;
//					console.log("starting mod: "+JSON.stringify(d));
					// create the envelope if there is one!
					b.mod[i].o.stop(now);
				}
		   }
	   }
					   
   }
   var mod=[];
   var l=r.l;
 	for(i=0;i<r.o.length;i++)
	{
		var d=r.o[i];
		if(d.c<0)
		{
			mod[i] =beepotronCreateCarrier(d.f,d.t,d.v,actx);
		}else
		{
			mod[i] = beepotronCreateModulator(d.f,d.t,d.v,actx);
		}
	}
	
    var env = actx.createGain(); // overal gain envelope!
    env.connect(actx.destination) ; 
    var now = actx.currentTime;
    env.gain.cancelScheduledValues(now);
	if(typeof(r.e)!="undefined")
	{
		for(i=0;i<r.e.length;i++)
		{
			if(i==0)
			{
				Hybrid.debugmessage("setenvelop :"+JSON.stringify(r.e[i]));
				Hybrid.debugmessage("setValueAtTime :"+r.e[i].v+"*"+v+"*"+d.v);
				env.gain.setValueAtTime(r.e[i].v*v*d.v, now);
			}
			//this.oscillator.frequency.setValueAtTime(frequency, actx.currentTime); is also possible! :)
			else
				env.gain.linearRampToValueAtTime(r.e[i].v*v*d.v, now + l*r.e[i].t);
			// 
		}
	}
	// create connections
	for(i=r.o.length-1;i>=0;i--)
	{
		var d=r.o[i];
		if(d.c<0)
		{
			mod[i].g.connect(env);	
		}else
		{
			var index=d.c;
			//  modulator.gain.connect(carrier.osc.frequency);
			if(d.m=="v")
				mod[i].g.connect(mod[index].g); // is you want to change the volume, you connect to the gain!				
			else
				mod[i].g.connect(mod[index].o.frequency);				
		}
	}
	for(i=0;i<mod.length;i++)
	{
		var d=r.o[i];
		//console.log("starting mod: "+JSON.stringify(d));
		// create the envelope if there is one!
		if(typeof(d.ve)!="undefined")
		{
			//console.log("do the volume envelop of: "+JSON.stringify(d.ve)+" to "+JSON.stringify(mod[i]));
			// put a envelope on the oscillator
			//mod[i].g.gain.cancelScheduledValues(now); // this is if you reuse oscillators..
			// we need to do something different for frequency and volume modifiers!
			var ove; // oscillator volume envelope
			for(ove=0;ove<d.ve.length;ove++)
			{
				if(ove==0)
					mod[i].g.gain.setValueAtTime(d.ve[ove].v*d.v, now);
				else
					mod[i].g.gain.linearRampToValueAtTime(d.ve[ove].v*d.v , now + l*d.ve[ove].t);
			}

		}
		if(typeof(d.fe)!="undefined")
		{
			console.log("do the frequency envelop of: "+JSON.stringify(d.fe)+" to "+JSON.stringify(mod[i]));
			// put a envelope on the oscillator
			//mod[i].g.gain.cancelScheduledValues(now); // this is if you reuse oscillators..
			// we need to do something different for frequency and volume modifiers!
			var ofe; // oscillator frequency envelope
			for(ofe=0;ofe<d.fe.length;ofe++)
			{
				if(ofe==0)
					mod[i].o.frequency.setValueAtTime(d.fe[ofe].v*d.f, now);
				else
					mod[i].o.frequency.linearRampToValueAtTime(d.fe[ofe].v*d.f , now + l*d.fe[ofe].t);
			}

		}
		mod[i].o.start(now);
		mod[i].o.stop(now+l);
		mod[i].stop=now+l; 
	}
	if(Hybrid.beepotron.polyphony==1)
	{
		// we save it in Hybrid.beepotron.beeps, 
		Hybrid.beepotron.beeps=[{mod:mod,length:l,started:(new Date()).getTime()}];		
	}
};



