// Generated by LiveScript 1.4.0
(function(){
  var getFieldsFromExtension;
  getFieldsFromExtension = function(fields_list, callback){
    return once_available('#autosurvey_content_script_loaded', function(){
      return sendExtension('requestfields', {
        fieldnames: fields_list,
        pagename: 'something'
      }, function(response){
        return sendExtension('requestfields', {
          fieldnames: fields_list,
          pagename: 'something'
        }, function(response){
          return callback(response);
        });
      });
    });
  };
  document.addEventListener('DOMContentLoaded', function(){
    return getFieldsFromExtension(['chrome_history_timespent_domain_past_24_hours'], function(data){
      var facebook_time, ref$, facebook_time_minutes;
      console.log('got fields from extension');
      console.log(data);
      document.querySelector('#rawdata').innerText = JSON.stringify(data);
      console.log('displayresults set');
      facebook_time = (ref$ = data['chrome_history_timespent_domain_past_24_hours']['www.facebook.com']) != null ? ref$ : 0;
      facebook_time_minutes = facebook_time / (60 * 1000);
      return document.querySelector('#timespent').innerText = 'You have spent ' + facebook_time_minutes + ' minutes on facebook in the past 24 hours';
    });
  });
}).call(this);
