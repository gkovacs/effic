// Generated by LiveScript 1.4.0
(function(){
  var extension_installed, installextension, out$ = typeof exports != 'undefined' && exports || this;
  extension_installed = false;
  once_available('#autosurvey_content_script_loaded', function(){
    extension_installed = true;
    return window.location.href = '/welcome';
  });
  setTimeout(function(){
    if (!extension_installed) {
      return document.querySelector('body').style.display = '';
    }
  }, 1000);
  out$.installextension = installextension = function(){
    var url, successCallback;
    if ((typeof chrome != 'undefined' && chrome !== null) && chrome.webstore != null && chrome.webstore.install != null) {
      return chrome.webstore.install(url = 'https://chrome.google.com/webstore/detail/efeilbcfmofhibadbmabeffihohfngnf', successCallback = function(){
        console.log('extension install finished');
        return window.location.reload();
      });
    } else {
      return window.open('https://chrome.google.com/webstore/detail/efeilbcfmofhibadbmabeffihohfngnf');
    }
  };
}).call(this);
