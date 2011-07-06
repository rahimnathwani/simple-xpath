/**
 * Injects into web page and listen to specific on click events on elements.
 */
console.log('Loaded Simple xpath script');

var currentEvent = null;
var elementEvent = null;
// register mouse event handler
document.oncontextmenu = trackEvent;

/**
 * Tracks an occured event and an element on which an event attached.
 * @param {DOM Event} DOM Event object.
 * @return {void}
 */
function trackEvent(event) {
  currentEvent = event;
  elementEvent = event.target;
}

// Registers listener for a specific action.
// Listens for request to get xpath for element.
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == 'getxpath') {
	  var xpath = getxpath();
      sendResponse({xpath:xpath});
    }
  }
);

/**
 * Builds xpath for a specified element.
 * @return {string} The full xpath for specified element.
 */
function getxpath() {
  var xpath = '';
  var node = elementEvent;
  while (node) {
    if (node == document.documentElement) {
      return xpath;
    }
    // some workaround to find an actual index
    // for the current node.
    var index = 0;
    var childs = node.parentNode.childNodes;
    if (node.tagName != 'BODY') {
      var iter = 0;
      while (true) {
        // count index only for the same types of objects in the node
        if (childs[iter].tagName == node.tagName) {
          index++;
        }
        if (childs[iter] == node) {
          break;
        }
        iter++;
      }
    } else {
      index = 1; // body always has index 1
	}
    // build xpath for current node
    xpath = '/' + node.tagName.toLowerCase() + '[' + index + ']' + xpath;

    node = node.parentNode;
  }

  throw 'Element is no longer attached to the DOM';
}