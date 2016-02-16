"use strict";

var mongo = require("mongod");
var dbPath = process.env.MONGOLAB_URI;
if (!dbPath) {
    dbPath = "mongodb://localhost:27017/effic";
}
var db = mongo.connect(dbPath+'?authMechanism=SCRAM-SHA-1', ["accounts"]);
var ObjectId = mongo.ObjectId;
var Promise = require("promise");
var logger = require("./logger");

logger.info("DB connected @ " + dbPath);

/**
 * Returns the passed data; used to buffer promise results.
 * @param {data} object The data to return
 * @returns {object}
 */
var pass = function(data){
    return data;
}

/**
 * Returns the result of a database query.
 * @param {string} collection The collection on which to run the query
 * @param {object} query The query to run on the collection (formatted mongo-style)
 * @returns {Promise}
 */
var query = function(collection, query){
    return db[collection].find(query).then(pass);
}

/**
 * Returns the result of a database query projected onto the projection object.
 * @param {string} collection The collection on which to run the query
 * @param {object} query The query to run on the collection (formatted mongo-style)
 * @param {object} projection The object on which to project the query (formatted mongo-style)
 * @returns {Promise}
 */
var project = function(collection, query, projection){
    return db[collection].find(query, projection).then(pass);
}

/**
 * Inserts an item into a collection or updates it if another object with the same _id already exists.
 * @param {string} collection The collection into which to insert the data
 * @param {object} data The data to insert into the collection
 * @returns {Promise}
 */
var insert = function(collection, data){
    return db[collection].save(data).then(pass);
};


/**
 * Updates a set of items in a collection.
 * @param {string} collection The collection in which to update records
 * @param {object} query The query to run on the collection to select items to update (formatted mongo-style)
 * @param {object} data The updates to perform on the selected records (formatted mongo-style)
 * @returns {Promise}
 */
var update = function(collection, query, data, options){
    options = options || {};
    return db[collection].update(query, data, options).then(pass);
};

/**
 * Removes objects matching the given query.
 * @param {string} collection The collection in which to remove records
 * @param {object} query The query to run on the collection to select items to remove (formatted mongo-style)
 * @returns {Promise}
 */
var remove = function(collection, query) {
    return db[collection].remove(query).then(pass);
}

/**
 * Clears a database in its entirety.
 * @param {string} collection The collection to clear
 * @returns {Promise}
 */
var clear = function(collection) {
    return remove(collection, {}).then(pass);
}

/**
 * Creates a new collection with the given name if it does not already exist.
 * @param {string} collection The collection to clear
 * @returns {Promise}
 */
var createCollection = function(collection, options) {
    return db.createCollection(collection, options || {});
}

module.exports = {
    query: query,
    insert: insert,
    update: update,
    project: project,
    clear: clear,
    createCollection: createCollection,
    ObjectId: ObjectId
}