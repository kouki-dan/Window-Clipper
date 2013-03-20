
chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.sendMessage(tab.id,{"clicked":true},function(){});        
});

chrome.extension.onMessage.addListener(
  function(request,sender,sendResponse){
    if(request.clip){ 
      chrome.windows.get(sender.tab.windowId,function(win){
        var width = request.rect.width;
        var height = request.rect.height + win.height - request.rect.clientHeight;
        width = width | 0;
        height = height | 0;
        chrome.windows.update(win.id,{
            width:width,
            height:height
          }
        );
      });
    
    }

    sendResponse({"end":true});    
  }
);


