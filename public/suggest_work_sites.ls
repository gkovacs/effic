getFieldsFromExtension = (fields_list, callback) ->
  once_available '#autosurvey_content_script_loaded', ->
    sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
      sendExtension 'requestfields', {fieldnames: fields_list, pagename: 'something'}, (response) ->
        callback response

getWorkSitesVisitedInPast24Hours = (callback) ->
  getFieldsFromExtension ['chrome_history_pages_past_24_hours'], (data) ->
    $.get '/classifications.json', (classifications) ->
      domain_matcher = new RegExp(':\/\/(.[^\/]+)(.*)')
      urlToDomain = (url) ->
        domain_matches = url.match(domain_matcher)
        if not domain_matches? or domain_matches.length < 2
          return ''
        return domain_matches[1]
      isWorkUrl = (url) ->
        domain = urlToDomain(url)
        if not classifications[domain]?
          return false
        if classifications[domain] == 'work'
          return true
        return false
      sites_visited = data['chrome_history_pages_past_24_hours']
      work_sites_visited = [x for x in sites_visited when isWorkUrl(x.url)]
      work_sites_visited.sort (a, b) ->
        b.lastVisitTime - a.lastVisitTime
      callback work_sites_visited


document.addEventListener 'DOMContentLoaded', ->
  getWorkSitesVisitedInPast24Hours (work_sites_visited) ->
    document.querySelector('#rawdata').innerText = JSON.stringify(work_sites_visited)
