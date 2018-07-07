/*
alert("navigator.vibrate?  " + (navigator.vibrate ? "Yes" : "No"));
alert("navigator.webkitVibrate?  " + (navigator.webkitVibrate ? "Yes" : "No"));
alert("navigator.oVibrate?  " + (navigator.oVibrate ? "Yes" : "No"));
var supportsVibrate = "vibrate" in navigator;
*/
//<button class="sexyButton" onclick="startVibrate(1000);">Vibrate Once</button>
//<button class="sexyButton" onclick="startVibrate([1000, 200, 1000, 2000, 400]);">Vibrate Multiple Times</button>
function startVibrate(level) {
	navigator.vibrate(level);
}
function stopVibrate()
{
	// Either of these stop vibration
	navigator.vibrate(0);
	navigator.vibrate([]);
}
