 /*--
 SnoepGames: snoepHybrid fileDrop, for drag and drop support of images then to be used on a canvas etc..
V1.2.0 
---*/
  
Hybrid.makeFileDropZone=_hybridMakeFileDropZone;
// zie werkende fiddle: http://jsfiddle.net/sdorLj3e/1/
// check for support..


function _hybridCreateHiddenUploadField(o,callback)
{
	Hybrid.filedropCallback=callback;
	var o=document.getElementById(o.jquery.attr('id'));
	o.addEventListener('dragover', _hybridHandleDragOver, false);
	o.addEventListener('drop', _hybridHandleFileSelect, false);}

function _hybridHandleDragOver(evt){
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};
function _hybridHandleFileSelect(evt) 
{
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.
    // files is a FileList of File objects. List some properties.
	
    for (var i = 0, f; f = files[i]; i++) 
    {
      // Only process image files.
      if (!f.type.match('image.*')) continue;
	  
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) 
      {
            return function(e) 
            {
              // Render thumbnail.
              var span = document.createElement('span');
			  var im=new Image();
              im.src=e.target.result;
			  if(typeof(Hybrid.filedropCallback)!=="undefined")
			  {
				Hybrid.filedropCallback(im);
			  }
            };
      })(f);
  }
