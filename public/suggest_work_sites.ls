root = exports ? this

getFieldsFromExtension = (fields_list, callback) ->
  once_available '#autosurvey_content_script_loaded', ->
    sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
      sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
        callback response

domain_matcher = new RegExp(':\/\/(.[^\/]+)(.*)')
urlToDomain = (url) ->
  domain_matches = url.match(domain_matcher)
  if not domain_matches? or domain_matches.length < 2
    return ''
  return domain_matches[1]

isWorkUrl = (url, classifications) ->
  domain = urlToDomain(url)
  if not root.classifications[domain]?
    return false
  if root.classifications[domain] == 'work'
    return true
  return false

document.addEventListener 'DOMContentLoaded', ->
  getFieldsFromExtension ['chrome_history_pages_past_24_hours'], (data) ->
    $.get '/classifications.json', (classifications) ->
      root.classifications = classifications
      console.log 'classifications are'
      console.log classifications
      sites_visited = data['chrome_history_pages_past_24_hours']
      sites_visited.sort (a, b) ->
        b.lastVisitTime - a.lastVisitTime
      console.log 'sites visited are'
      console.log sites_visited
      work_sites_visited = [x for x in sites_visited when isWorkUrl(x.url)] 
      console.log 'work sites visited are'
      console.log work_sites_visited
      document.querySelector('#rawdata').innerText = JSON.stringify(work_sites_visited)
