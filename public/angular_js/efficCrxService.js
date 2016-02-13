angular.module('app').service('efficCrxService',
    ['$rootScope',
        function ($rootScope) {

            this.getFieldsFromExtension = function(fields_list, callback){
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

        }
    ]);