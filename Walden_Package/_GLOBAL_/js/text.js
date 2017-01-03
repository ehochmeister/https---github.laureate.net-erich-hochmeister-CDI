// JavaScript Document

// 1/19/2011 - RK added NEW Bb9 version of iFrame height adjuster
function setInlineContentHeight(  ) {
// alert("myFrameId="+myFrame.id);
	var myFrame = parent.document.getElementById('loader');	
  var newHeight = null;
  if ( myFrame.contentWindow ) { // Internet Explorer
//    alert('IE');
    newHeight = myFrame.contentWindow.document.body.scrollHeight + 60 + "px";
  }
  else if ( myFrame.contentDocument ) { // Firefox, Opera
//    alert('FF/Opera');
    if ( myFrame.contentDocument.height && !isNaN( myFrame.contentDocument.height ) ) {
      newHeight = myFrame.contentDocument.height + 60 + "px";
	}
	else {
      newHeight = myFrame.contentDocument.clientHeight + 60 + "px";
	}
  }
  else if ( myFrame.document ) { // Others?
//    alert('Other?');
    newHeight = myFrame.document.body.scrollHeight + 60 + "px";
  }
  else {
//    alert('Unhandled browser?');
  }

  if ( newHeight != null ) {
//    alert("Setting Height=" + newHeight);
    myFrame.height = newHeight;
  }
}

function resizeText(multiplier) {  
if (document.body.style.fontSize == "") {
	 document.body.style.fontSize = ".85em"; 
}
document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.1) + "em"; 

setInlineContentHeight(  );
}

function ShowText(id) {
document.getElementById(id).style.display = 'block';
}
function HideText(id) {
document.getElementById(id).style.display = 'none';
}