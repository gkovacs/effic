getFieldsFromExtension = (fields_list, callback) ->
  once_available '#autosurvey_content_script_loaded', ->
    sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
      sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
        callback response


document.addEventListener 'DOMContentLoaded', ->
  getFieldsFromExtension ['facebook_loggedin', 'facebook_fullname', 'facebook_shortname', 'facebook_profilepic', 'facebook_profilepic_small', 'facebook_id'], (data) ->
    console.log 'got fields from extension'
    console.log data
    document.querySelector('#rawdata').innerText = JSON.stringify(data)
