Polymer {
  is: 'autofill-data'
  properties: {
    pagename: String
    fields: {
      type: String
    }
    fields_array: {
      type: Array
      computed: 'computeFieldsArray(fields)'
      observer: 'fieldsChanged'
    }
    data: Object
    field_descriptions: Object
  }
  computeFieldsArray: (fields) ->
    return levn.parse('[String]', fields)
  fieldsChanged: (newfields, oldfields) ->
    self = this
    console.log newfields
    console.log 'sendMessage called'
    # once content script is loaded
    once_available '#autosurvey_content_script_loaded', ->
      console.log 'auotfill-data calling extension-loaded'
      self.fire 'extension-loaded', {}
      sendExtension 'requestfields', {fieldnames: newfields, pagename: self.pagename}, (response) ->
        console.log 'response received from sendMessage'
        self.data = response
        console.log 'self.data set'
        console.log self.data
        sendExtension 'get_field_descriptions', newfields, (field_descriptions) ->
          self.field_descriptions = field_descriptions
          self.fire 'have-data', response
}
