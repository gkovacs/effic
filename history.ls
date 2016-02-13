document.addEventListener 'DOMContentLoaded', ->
  console.log 'domcontentloaded called'
  document.querySelector('#autofill').addEventListener 'have-data', (results) ->
    console.log 'have-data callback'
    console.log results.detail
    data = results.detail
    document.querySelector('#displayresults').innerText = JSON.stringify(results.detail)
    console.log 'displayresults set'
  document.querySelector('#autofill').fields = "chrome_history_timespent_domain,chrome_history_pages,chrome_history_visits"
