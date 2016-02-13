getFieldsFromExtension = (fields_list, callback) ->
  once_available '#autosurvey_content_script_loaded', ->
    sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
      sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
        callback response


document.addEventListener 'DOMContentLoaded', ->
  getFieldsFromExtension ['chrome_history_timespent_domain_past_24_hours'], (data) ->
    console.log 'got fields from extension'
    console.log data
    document.querySelector('#rawdata').innerText = JSON.stringify(data)
    console.log 'displayresults set'
    facebook_time = data['chrome_history_timespent_domain_past_24_hours']['www.facebook.com'] ? 0
    facebook_time_minutes = facebook_time /  (60*1000)
    document.querySelector('#timespent').innerText = 'You have spent ' + facebook_time_minutes + ' minutes on facebook in the past 24 hours'
