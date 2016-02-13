'use strict';

/*
 * Load the model data of the problem 1 of cs142's project4.
 * We load into DOM the property cs142models.exampleModel a function that returns an object
 * with the following property:
 *    name:  A string with name.
 *
 * See README.md for information on how to access it.
 */
var efficmodels;

if (efficmodels === undefined) {
   efficmodels = {};
}

efficmodels.visualModel = function() {
   // return {
   //      title: 'URL Data',
   //      data: [
   //          {url: 'facebook.com',
   //          time: '120'},
   //          {url: 'youtube.com',
   //          time: '60'}
   //      ]
   // };
  return {
    "chrome_history_timespent_domain": {
      "docs.google.com":35931179.41918945,
      "www.facebook.com":110728737.78857422,
      "mail.google.com":47076446.25341797,
      "calendar.google.com":16848468.021972656,
      "www.google.com":24458975.414794922,
      "psichiucsc.wordpress.com":29193.558837890625,
      "www.reddit.com":204612.1181640625
    }
  };
};