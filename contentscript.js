
var WindowClipper = function(terminate){
  var that = this;
  this.terminate = terminate || function(){};

  this.onClick = function(e){
    that._onClick(e);
  };
  document.addEventListener("mouseup",this.onClick,true);
    
  this.onMouseover = function(e){
    that._onMouseover(e);
  };
  this.prev = {};
  window.addEventListener('mouseover',this.onMouseover,true);

};
WindowClipper.prototype.end = function(){
  //終了処理
  document.removeEventListener("mouseup",this.onClick,true);
  window.removeEventListener("mouseover",this.onMouseover,true);

  if(this.terminate.call){
    this.terminate.call();
  }

  this.restore();
  return undefined;
};
WindowClipper.prototype._onClick = function(e){
  e.preventDefault();

  this.windowClipByElement(this.prev.elm);

  this.end();
};
WindowClipper.prototype._onMouseover = function(e){
  this.restore();
  var target = e.target;
  this.save(target);

  target.style.backgroundColor = "#02e";
  target.style.opacity = "0.5";
};
WindowClipper.prototype.restore = function(){
  var prev = this.prev;
  if(prev.elm){
    prev.elm.style.backgroundColor = prev.backgroundColor;
    prev.elm.style.opacity = prev.opacity;
  }
};
WindowClipper.prototype.save = function(elm){
  this.prev.elm = elm;
  this.prev.backgroundColor = elm.style.backgroundColor;
  this.prev.opacity = elm.style.opacity;
};
WindowClipper.prototype.windowClipByElement = function(elm){
  var clientRect = elm.getBoundingClientRect();

  var rect = {
    "width":clientRect.width,
    "height":clientRect.height,
    "clientHeight":document.documentElement.clientHeight
  }


  window.addEventListener("resize",function(){  
    var clientRect = elm.getBoundingClientRect();
    var scrollX = clientRect.left + window.scrollX;
    var scrollY = clientRect.top + window.scrollY;
    window.scrollTo(scrollX,scrollY);
    window.removeEventListener("resize",arguments.callee,true);
    console.log("YEAH");
  },true);

  chrome.extension.sendMessage({"clip":true,"rect":rect},function(){
  });
}



var windowClipper;
chrome.extension.onMessage.addListener(
    function(request,sender,sendResponse){
      if(request.clicked){
        if(!windowClipper){
          function terminate(){
            windowClipper = undefined
          }
          windowClipper = new WindowClipper(terminate);
        }
        else{
          windowClipper.end();
          windowClipper = undefined;
        }
      }

      sendResponse({});
    }
);

