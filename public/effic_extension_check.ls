extension_installed = false

once_available '#autosurvey_content_script_loaded', ->
  extension_installed := true
  window.location.href = '/welcome'

setTimeout ->
  if not extension_installed
    document.querySelector('body').style.display = ''
, 1000

export installextension = ->
  #alert 'install extnesion button clicked'
  if chrome? and chrome.webstore? and chrome.webstore.install?
    chrome.webstore.install(
      url='https://chrome.google.com/webstore/detail/efeilbcfmofhibadbmabeffihohfngnf',
      successCallback= ->
        console.log 'extension install finished'
        window.location.reload()
    )
  else
    window.open('https://chrome.google.com/webstore/detail/efeilbcfmofhibadbmabeffihohfngnf')