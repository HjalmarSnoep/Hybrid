 /*--
 SnoepGames: snoepHybrid LZW decoding and encoding
V1.2.5 
---*/

/***This function will attempt to shorten a string you can still express in normal characters, if it succeeds, it will return the shortened string**/
Hybrid.compressString=function(s)
{
	var d = _hybridLzw_encode(s);
	return Hybrid.b64.encode(d);
};
/*****/
Hybrid.decompressString=function(s)
{
	var d = Hybrid.b64.decode(s);
	return _hybridLzw_decode(d);
};
// BASE 64 encoding

// Create Base64 Object
Hybrid.b64=
{
	_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function(e)
	{ 
	  var t="";
	  var n,r,i,s,o,u,a;
	  var f=0;
	  e=Hybrid.b64._utf8_encode(e);
	  while(f<e.length)
	  {
	     n=e.charCodeAt(f++);
		 r=e.charCodeAt(f++);
		 i=e.charCodeAt(f++);
		 s=n>>2;
		 o=(n&3)<<4|r>>4;
		 u=(r&15)<<2|i>>6;
		 a=i&63;
		 if(isNaN(r))
		 {
			u=a=64;
		 }else if(isNaN(i)){
		  a=64;
		 }
		 t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);
	  }
	  return t;
	},
	decode: function(e)
	{
	   var t="";
	   var n,r,i;
	   var s,o,u,a;
	   var f=0;
	   e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");
	   while(f<e.length)
	   {
	     s=this._keyStr.indexOf(e.charAt(f++));
		 o=this._keyStr.indexOf(e.charAt(f++));
		 u=this._keyStr.indexOf(e.charAt(f++));
		 a=this._keyStr.indexOf(e.charAt(f++));
		 n=s<<2|o>>4;r=(o&15)<<4|u>>2;
		 i=(u&3)<<6|a;
		 t=t+String.fromCharCode(n);
		 if(u!=64)
		 {	
			t=t+String.fromCharCode(r);
		 }
			if(a!=64)
			{
				t=t+String.fromCharCode(i)};
			}
			t=Hybrid.b64._utf8_decode(t);
			return t;
		},
		_utf8_encode: function(e)
		{
			e=e.replace(/\r\n/g,"\n");
			var t="";
			for(var n=0;n<e.length;n++)
			{
			 var r=e.charCodeAt(n);
			 if(r<128){
				t+=String.fromCharCode(r);
			 }else if(r>127&&r<2048)
			 {
			  t+=String.fromCharCode(r>>6|192);
			  t+=String.fromCharCode(r&63|128)
			 }else
			 {
			  t+=String.fromCharCode(r>>12|224);
			  t+=String.fromCharCode(r>>6&63|128);
			  t+=String.fromCharCode(r&63|128)
			 }
		}
		return t;
	},
	_utf8_decode: function(e)
	{
		var t="";
		var n=0;
		var r=0,c1=0,c2=0;
		while(n<e.length)
		{
			r=e.charCodeAt(n);
			if(r<128)
			{
				t+=String.fromCharCode(r);
				n++;
			}else if(r>191&&r<224)
			{
				c2=e.charCodeAt(n+1);
				t+=String.fromCharCode((r&31)<<6|c2&63);
				n+=2;
			}else
			{
				c2=e.charCodeAt(n+1);
				c3=e.charCodeAt(n+2);
				t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
				n+=3;
			}
		}
		return t;
	}
}

//https://gist.github.com/ncerminara/11257943
// Encode the String
//var encodedString = Hybrid.b64.encode(string);
//console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

// Decode the String
//var decodedString = Hybrid.b64.decode(encodedString);
//console.log(decodedString); // Outputs: "Hello World!"



// https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch
// Patent expired: Unisys's US patent on the LZW algorithm expired on June 20, 2003,[3] 20 years after it had been filed. Patents that had been filed in the United Kingdom, France, Germany, Italy, Japan and Canada all expired in 2004,[3] 


// LZW-compress a string
function _hybridLzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function _hybridLzw_decode(s) 
{
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}