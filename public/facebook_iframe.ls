document.addEventListener 'DOMContentLoaded', ->
  console.log 'domcontentloaded called'
  document.querySelector('#autofill').addEventListener 'have-data', (results) ->
    console.log 'have-data callback'
    console.log results.detail
    data = results.detail
    document.querySelector('#rawdata').innerText = JSON.stringify(results.detail)
    console.log 'displayresults set'
    facebook_time = data['chrome_history_timespent_domain_past_24_hours']['www.facebook.com'] ? 0
    facebook_time_minutes = facebook_time /  (60*1000)
    document.querySelector('#timespent').innerText = 'You have spent ' + facebook_time_minutes + ' minutes on facebook in the past 24 hours'
  document.querySelector('#autofill').fields = "chrome_history_timespent_domain_past_24_hours"
