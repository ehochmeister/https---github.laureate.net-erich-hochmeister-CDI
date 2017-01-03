/**
 * Location of MyMedia Player control
 */
var MyMediaPlayerLocation = "MyMediaPlayer.swf";
var _placeholder = "MyMPlayer";
var _flashVars = "";
var _template = "";
var _autoPlay = false;
var _disabledOptions = false;
var _shouldBe = false;
 
/**
 * Default parameters for the diferent templates. More Templates can de added here.
 */ 
var mymediaT1 = {
    "Language": "English",
    "Resolution": "Hi",
    "Show-Options": "Y",
    "Show-Controls": "A",
    "Show-Captions": "N",
    "Secure": "N",
	"CDNMapper": "Y"
  };
  
var mymediaT2 = {
    "Language": "Spanish",
    "Resolution": "Med",
    "Show-Options": "Y",
    "Show-Controls": "A",
    "Show-Captions": "N",
    "Secure": "N",
	"CDNMapper": "Y"
  };
  
var mymediaT3 = {
    "Language": "Spanish",
    "Resolution": "Low",
    "Show-Options": "N",
    "Show-Controls": "A",
    "Show-Captions": "Y",
    "Secure": "N",
	"CDNMapper": "Y"
  };
/**
 * MyMediaPlayer
 * @param playerLocation: A string with the MyMedia player location path.
 * @param placeholder: A string with the id of the HTML element to insert the media player.
 * @param template: MyMediaPlayer template to use. Each template has predefined parameters set.
 * @param flashVarStr: A string with name-value pairs URL encoded used to pass variables to
 *                	    MyMedia Player control. The variables values specified in this list override
 *                      the values in the specified in the template passed as argument. 
 * @description This function Replace the HTML element with ID of "placeholder" with the media player.
 */  
 
 function setInlineContentHeight( myFrame ) {
// alert("myFrameId="+myFrame.id);

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


function MyMediaPlayer(playerLocation, placeholder, template, flashVarStr) {
	_template = template;
	_flashVars = flashVarStr;
	MyMediaPlayerLocation = playerLocation;
	_placeholder = placeholder;
	
	validateHost(document.domain, "", "http://secure.waldenu.edu/AllowedDomains/");
}

/**
 * mergeObjects
 * @param object1 This object is a copy of the template object selected.
 * @param object2 This object contains the flashvars received.
 * @return tmp The merge of the the objects received.
 * @description This function is used to merge properties from object2 into object1. ( template object copy into object with flashvars received)
 */ 
function mergeObjects(object1, object2) {
	var tmp = cloneObj(object1);
	var tmp2 = cloneObj(object2);
	for (var p in tmp2) {
		tmp[p] = tmp2[p];
	}
	return tmp;
}

/**
* cloneObj
 * @param obj The object to be copyed.
 * @return newObj A copy of the object received.
 * @description  This function is used to create a copy the object received.
 */ 
function cloneObj(obj) {
	if(typeof(obj) != "object") {
		return obj;
	}
	if(obj == null) {
		return obj;
	}

	var newObj = new Object();

	for(var i in obj) {
		newObj[i] = cloneObj(obj[i]);
	}
	return newObj;
}

/**
 * mymediaDecodeURLString
 * @param variablesStr A string with name-value pairs URL encoded used to pass variables to MyMedia Player control.
 * @return result The array containing the flashvars received.
 * @description This function separate the flashvars  and store them in an array.
*/
function mymediaDecodeURLString(variablesStr) {
	var result = {};

	var vars = variablesStr.split("&"); 
	for (var i=0;i<vars.length;i++) { 
	var pair = vars[i].split("="); 
		if (pair.length == 2) { 
		  pair[0] = escape(pair[0]);
		  pair[1] = escape(pair[1]);
		  result[pair[0]] = pair[1]; 
		} 
		else {
		  pair[0] = escape(pair[0]);
		  result[pair[0]] = true;
		}
	}
	return result;
}


/**
 * getSizeFromResolution
 * @param resolution The resolution selected. The one received in the flashvar "Resolution"
 * @description This function return the size specified for the resolution received.
*/
getSizeFromResolution = function(resolution) {
	var size = {width: "888px", height: "592px"}
	// If resolution is not defined return immediatly
	if (!resolution ) {
		return size;
	}

	switch(resolution) {
		case "Low":
		case "SMALL":
		{
		  size.width = "570px";
		  size.height = "388px";
		  break;
		}
		case "Med":
		case "MEDIUM":
		{
		  size.width = "729px";
		  size.height = "440px";
		  break;
		}
		case "Hi":
		case "LARGE":
		{
		  size.width = "888px";
		  size.height = "592px";
		  break;
		}
	}
	return size;
} 

/**
 * changeLayoutSize
 * @param layoutSize The selected size of the MyMedia player
 * @description This function changes the object and embed flash object sizes according to the size selected.
*/
function changeLayoutSize(objectID, layoutSize) {
	var flashObject = document.getElementById(objectID);
	if(flashObject==null){
		return;
	}
	var flashObjectEmbed = flashObject.firstChild;
	
	if(flashObjectEmbed==null)
		flashObjectEmbed = document.getElementById(objectID);
	if(_disabledOptions) {
		switch(layoutSize) {
			case "SMALL":
				flashObject.width = "363px";
				flashObject.height = "388px";	
				flashObjectEmbed.width = "363px";
				flashObjectEmbed.height = "388px";	
				flashObject.style.width = "363px";
				flashObject.style.height = "388px";	
				flashObjectEmbed.style.width = "363px";
				flashObjectEmbed.style.height = "388px";	
				break;
			case "MEDIUM":
				flashObject.width = "522px";
				flashObject.height = "432px";
				flashObjectEmbed.width = "522px";
				flashObjectEmbed.height = "432px";
				flashObject.style.width = "522px";
				flashObject.style.height = "432px";
				flashObjectEmbed.style.width = "522px";
				flashObjectEmbed.style.height = "432px";	
				break;
			case "LARGE":
				flashObject.width = "681px";
				flashObject.height = "592px";
				flashObjectEmbed.width = "681px";
				flashObjectEmbed.height = "592px";
				flashObject.style.width = "681px";
				flashObject.style.height = "592px";
				flashObjectEmbed.style.width = "681px";
				flashObjectEmbed.style.height = "592px";
				break;
		}			
	}
	else {
		switch(layoutSize) {
			case "SMALL":
				flashObject.width = "570px";
				flashObject.height = "388px";	
				flashObjectEmbed.width = "570px";
				flashObjectEmbed.height = "388px";	
				flashObject.style.width = "570px";
				flashObject.style.height = "388px";	
				flashObjectEmbed.style.width = "570px";
				flashObjectEmbed.style.height = "388px";				
				break;
			case "MEDIUM":
				flashObject.width = "729px";
				flashObject.height = "455px";
				flashObjectEmbed.width = "729px";
				flashObjectEmbed.height = "455px";
				flashObject.style.width = "729px";
				flashObject.style.height = "455px";
				flashObjectEmbed.style.width = "729px";
				flashObjectEmbed.style.height = "455px";
				break;
			case "LARGE":
				flashObject.width = "888px";
				flashObject.height = "610px";
				flashObjectEmbed.width = "888px";
				flashObjectEmbed.height = "610px";
				flashObject.style.width = "888px";
				flashObject.style.height = "610px";
				flashObjectEmbed.style.width = "888px";
				flashObjectEmbed.style.height = "610px";
				break;	
			case "DISABLEDOPTIONS":
				_disabledOptions = true;
				
				break;
		}//switch
		parent.getHeight();
		var theFrame=parent.document.getElementById('loader');
		parent.setInlineContentHeight(theFrame);	
	}

}
/**
 *getXML
 *@version 1.0
 *@param url - a String containing the url from which to access the xml to load
 *@description Loads a an XML file by calling the loadXMLDoc function
**/
function getXML(url) {
	// The commented code below is useful for loading the xml for an external domain. 
	// It uses a script tag to call a aspx that return the XML in JSON format.
	/*
	var obj = new JSONscriptRequest("http://207.248.55.114/asp/Default.aspx?url=" + url);
	obj.buildScriptTag(); // Build the script tag
	obj.addScriptTag(); // Execute (add) the script tag
	*/
	
	// Load xml using direct XMLHttpRequest javascript function. This methods works when the XML file is in the same domain that the swf.
	loadXMLDoc(url, loadedXML);
} //end addScript

/**
 *getUserId
 *@version 1.0
 *@param url - a String containing the url from which to access the webpage to obtain the userId
 *@description Loads a JSON from a url string and then calls the loadedUserId method.
**/
function getUserId(url){
	try
	{
		// If this works, we're in BlackBoard
		document.getElementById(_placeholder).assignUserID(document.getElementById("myMediaUserId").value);
	} catch(err) {
		// Must be eCollege
		var xmlDoc=null;
		if (window.ActiveXObject)
		{// code for IE
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		}
		else if (document.implementation.createDocument)
		{// code for Mozilla, Firefox, Opera, etc.
			xmlDoc=document.implementation.createDocument("","",null);
		}
		else
		{
			alert('Your browser cannot handle this script');
		}
		if (xmlDoc==null)
		{
			return;
		}

		xmlDoc.async=false;
		xmlDoc.load("http://ts.ecollege.com/TC/Api/User/UserInfo/xml.ed");
		xmlObj=xmlDoc.documentElement; 
		document.getElementById(_placeholder).assignUserID(xmlObj.childNodes(3).text);
	}
}

/**
 *validateHost
 *@version 1.0
 *@param domain - a String containing the domain of the HTML hosting the MyMediaPlayer.swf
 *@param requestId - a String containing id number of the request sent
 *@param connectionURL - a String containing the url which to connect
 *@description this function creates a JSON request to a asp page sending the corresponding parameters, 
 *			   when the aspx page returns it calls the returnHostValidation method
**/
function validateHost(domain, requestId, connectionURL) {
	var obj = new JSONscriptRequest(connectionURL + "HostValidator.aspx?domain=" + domain + "&requestId=" + requestId);
	obj.buildScriptTag(); // Build the script tag
	obj.addScriptTag(); // Execute (add) the script tag
}

/**
 *getCDNURL
 *@version 1.0
 *@param fileName - a String containing the filename of the item to load
 *@param path - a String containing a url path of the item to load
 *@param requestId - a String containing id number of the request sent
 *@param connectionURL - a String containing the url which to connect
 *@description this function creates a JSON request to a asp page sending the corresponding parameters, 
 *			   when the aspx page returns it calls the returnCDNURL method
**/
function getCDNURL(fileName, path, requestId, connectionURL) {
	var obj = new JSONscriptRequest(connectionURL + "CDNMapper.aspx?filePath=" + path + "&fileName=" + fileName+ "&requestId=" + requestId);
	obj.buildScriptTag(); // Build the script tag
	obj.addScriptTag(); // Execute (add) the script tag
}

/**
 *getSecurityToken
 *@version 1.0
 *@param userId - a String containing the userId used to validate the user
 *@param url - a String containing a complete url path (with filename) of the item to load
 *@param sessionId - a String containing the sessionId of the current player
 *@param requestId - a String containing id number of the request sent
 *@param connectionURL - a String containing the url which to connect
 *@description this function creates a JSON request to a asp page sending the corresponding parameters, 
 *			   when the aspx page returns it calls the receiveToken method
**/
function getSecurityToken(userId, url, sessionId, requestId, connectionURL) {
	var obj = new JSONscriptRequest(connectionURL + "SecurityToken.aspx?userId=" + userId + "&url=" + url + "&SessionID=" + sessionId + "&requestId=" + requestId);
	obj.buildScriptTag(); // Build the script tag
	obj.addScriptTag(); // Execute (add) the script tag
}

/**
 *convertToXML
 *@version 1.0
 *@param data - a JSON object
 *@description this function receives a JSON object and converts it to XML.
**/
function convertToXML(data) {
	var playerData = data;
	var options = { formatOutput: true,
		rootTagName: 'root'
	};
	var xml = $.json2xml(playerData, options);
	var xmlString = xml.toString();
	var xmlComplete = xmlString.substring(xmlString.indexOf('>') + 1, xmlString.lastIndexOf('<'));
	sendXMLToActionScript(xmlComplete);
}

/**
 *returnHostValidation
 *@version 1.0
 *@param data - a JSON object
 *@description this function receives a JSON object, and calls the sendHostValidationResultToActionScript method with 
			   the host validation result and the requestId parameters received from the aspx page.
**/
function returnHostValidation(data){
	//document.getElementById(_placeholder).sendHostValidationResultToActionScript(data.Response.validationResult, data.Response.requestId);
	_shouldBe = data.Response.validationResult == "true";
	
	if (_shouldBe == true) {
		var parameters = {};
		parameters.wmode = "transparent";
		parameters.allowFullScreen = "true";
		parameters.salign="lt";
		parameters.allowNetworking="all";
		parameters.allowScriptAccess="always";
		var flashvars = {};
		if (_template == "T1") {
			flashvars = cloneObj(mymediaT1);
		}else if (_template == "T2") {
			flashvars = cloneObj(mymediaT2);
		}else if (_template == "T3") {
			flashvars = cloneObj(mymediaT3);
		}
		var additionalVariables = {}
		if (_flashVars) {
			additionalVariables = mymediaDecodeURLString(_flashVars);
		}
		// Add the URL of the page which embeds the control.
		flashvars["ParentPage"] = encodeURIComponent(window.location.href);
		flashvars["ObjectID"] = _placeholder;

		// Add additionalVariables properties to flashvars object to pass those 
		// to the flash control variables.
		flashvars = mergeObjects(flashvars, additionalVariables);

		var size = getSizeFromResolution(flashvars["Resolution"]);
		swfobject.embedSWF(MyMediaPlayerLocation, _placeholder, size.width, size.height, "10.0.0", null, flashvars, parameters, null);
	}
	else {
		alert("MyMedia player is not allowed to run on this domain.");
		document.getElementById(_placeholder).innerHTML = "<p><b>MyMedia player is not allowed to run on this domain.</b></p>";
	}
}

/**
 *returnCDNURL
 *@version 1.0
 *@param data - a JSON object
 *@description this function receives a JSON object, and calls the sendURLToActionScript method with the resourceURL and the requestId
 *			   parameters received from the aspx page.
**/
function returnCDNURL(data){
	document.getElementById(_placeholder).sendURLToActionScript(data.Response.resourceURL, data.Response.requestId);
}

/**
 *receiveToken
 *@version 1.0
 *@param data - a JSON object
 *@description this function receives a JSON object, and calls the sendTokenToActionScript method with the tokenURL and the requestId
 *			   parameters received from the aspx page.
**/
function receiveToken(data){
	document.getElementById(_placeholder).sendTokenToActionScript(data.Response.tokenURL, data.Response.requestId);
}

/**
 *isAutoPlayOn
 *@version 1.0
 *@description Verify if the _autoPlay flag is On and return its value.
**/
function isAutoPlayOn() {
	 document.getElementById(_placeholder).sendAutoPlayFlagValueToActionScript(_autoPlay);
}

/**
 *setAutoPlayOn
 *@version 1.0
 *@description Sets the _autoPlay flag On and return its value.
**/
function setAutoPlayOn() {
	_autoPlay = true;
	document.getElementById(_placeholder).sendAutoPlayFlagValueToActionScript(_autoPlay);
}

/**
 *setAutoPlayOnTimer
 *@version 1.0
 *@param value - an integer. The number of seconds to wait before calling the setAutoPlayOn method.
 *@description Set the timeout..
**/
function setAutoPlayOnTimer(seconds) {
	setTimeout("setAutoPlayOn()", (seconds*1000));	
}

/**
 *sendXMLToActionScript
 *@version 1.0
 *@param value - a String
 *@description this function receives a String and calls the corresponding sendXMLToActionScript function on AS.
**/
function sendXMLToActionScript(value) {
	 document.getElementById(_placeholder).sendXMLToActionScript(value);
}


var xmlhttp;
/**
 *GetXmlHttpObject
 *@version 1.0
 *@description this function checks what is the current browser and returns the corresponding request
**/
function GetXmlHttpObject()
{
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		return new XMLHttpRequest();
	}
	if (window.ActiveXObject) {
		// code for IE6, IE5
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	return null;
}

/**
 *loadXMLDoc
 *@version 1.0
 *@param url - a String indicating the url to connect to
 *@param functionType - a String indicating the function to call when the xml is received
 *@description this function loads an xml from a given url and then calls the corresponding function
**/
function loadXMLDoc(url, functionType)
{
	xmlhttp=GetXmlHttpObject();
	if (xmlhttp==null) {
		alert ("Your browser does not support XMLHTTP!");
		return;
	}
	xmlhttp.onreadystatechange=functionType;
	xmlhttp.open("GET",url,true);
	xmlhttp.send(null);
}

/**
 *loadedUserId
 *@version 1.0
 *@description this function gets called after the xml for retrieving the playlist and downloads is received.
**/
function loadedXML()
{
	if (xmlhttp.readyState==4) {
		if (xmlhttp.status==200) {
			sendXMLToActionScript(xmlhttp.responseText);
		}
		else {
			alert("Problem retrieving XML data:" + xmlhttp.statusText);
		}
	}
}

/**
 *loadedUserId
 *@version 1.0
 *@description this function gets called after the xml for retrieving the userID is received.
**/
function loadedUserId()
{
	if (xmlhttp.readyState==4) {
		if (xmlhttp.status==200) {
			sendXMLToActionScript(xmlhttp.responseText);
		}
		else {
			alert("Problem retrieving XML data:" + xmlhttp.statusText);
		}
	}
}
/**
 *returnError
 *@version 1.0
 *@param data - a JSON object containing the error message
 *@description this function gets called whenever the aspx page finds an error or exception, it then calls the sendErrorToActionScript method
 *			   on AS which displays the error in the player.
**/
function returnError(data){
	document.getElementById(_placeholder).sendErrorToActionScript(data.Response.errorMessage);
}

function returnShouldBe() {
	return _shouldBe;
}

