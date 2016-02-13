"use strict";

require('dotenv').config();
var express = require("express");
var app = express();
var bodyparser = require("body-parser");
app.use(bodyparser.json());
var http = require("http").Server(app);
var nconf = require("nconf");
var path = require("path");
var crypto = require("crypto");
var logger = require("./logger");
var db = require("./db");
var webRoutes = require("./web-routes")(__dirname);

nconf.argv().env();

var PORT = nconf.get("PORT") || 9001;

http.listen(PORT, function(){
    logger.info("Listening on *:" + PORT);
});

app.get('/', webRoutes.index_redirect);
app.get('/index', webRoutes.index_redirect);
app.get('/welcome', webRoutes.welcome);

/**
 * Adds a new account to the application (request with user_id)
 */
app.post("/account/new", function(req, res){
    var check = argCheck(req.body, {
        user_id: "string",
        history: "object"
    });

    if(!check.valid){
        res.status(400).send(check.error);
        return;
    }

    if(!req.body.user_id.match(/^.*$/)){ // TODO: anything legitimate
        res.status(400).send("Your User ID is not in a valid format.");
        return;
    }

    db.query("accounts", {
        user_id: req.body.user_id
    })
        .then(function(data){
            if(data.length > 0){
                res.status(400).send("An account already exists for this user ID.");
                return;
            }

            return db.insert("accounts", {
                user_id: req.body.user_id,
                history: req.body.history       // TODO: CHANGE HOW PUTTING IN HISTORY
            });
        })
        .then(function(data){
            res.status(200).send();
        })
        .catch(function(err){
            logger.error(err.stack);
            res.status(500).send("Internal server error.  Try again in a minute.");
        });
});

/**
 * Checks if an account has already been created (with a given user_id)
 */
app.post("/account/check", function(req, res){
    var check = argCheck(req.body, {
        user_id: "string"
    });

    if(!check.valid){
        res.status(400).send(check.error);
        return;
    }

    db.query("accounts", {
        user_id: req.body.user_id
    })
        .then(function(data){
            res.status(200).send(data.length == 1);
        })
        .catch(function(err){
            logger.error(err.stack);
            res.status(500).send("Internal server error.  Try again in a minute.");
        })
});

/**
 * Returns history data of a user
 */
app.post("/account/history", function(req, res){
    var check = argCheck(req.body, {
        user_id: "string"
    });

    if(!check.valid){
        res.status(400).send(check.error);
        return;
    }

    db.query("accounts", {
        user_id: req.params.user_id
    })
        .then(function(data){
            if(data.length != 1){
                res.status(400).send("Invalid user ID.");
                return;
            }
            return data; // TODO RETURN DATA IN A BETTER WAY
        })
        .then(function(data){
            if(data.length != 1){
                res.status(400).send("Invalid URL.");
            }
            res.status(200).send(data[0].info);
        })
        .catch(function(err){
            logger.error(err.stack);
            res.status(500).send("Internal server error.  Try again in a minute.");
        });
});

/**
 * Adds browsing data to a given user
 */
app.put("/account/add", function(req, res){
    var check = argCheck(req.body, {
        user_id: "string",
        store: "object"
    });

    if(!check.valid){
        res.status(400).send(check.error);
        return;
    }

    // TODO Process the additional data to store into however the data will be modeled
    //
    //

    db.query("accounts", {
        user_id: req.params.user_id
    })
        .then(function(data){
            if(data.length != 1){
                res.status(400).send("Invalid user ID.");
                return;
            }
            return db.update("accounts", {
                user_id: req.params.hardware_id
            }, {
                $set: {
                    history: req.body.store    //TODO Update with better way of adding information
                }
            }, {
                upsert: false
            });
        })
        .then(function(){
            res.status(200).send();
        })
        .catch(function(err){
            logger.error(err.stack);
            res.status(500).send("Internal server error.  Try again in a minute.");
        });
});

/**
 * Ensures that the given argument object matches the given schema.
 * @param {object} args The provided argument object
 * @param {object} type The schema to check against
 * @returns {object} An object describing whether or not the provided object is valid and what errors exist, if any
 */
var argCheck = function(args, type){
    for(var kA in args){
        if(!type[kA]){
            return {valid: false, error: "Your request has an extra field \"" + kA + "\" and can't be processed."};
        }
        if(typeof type[kA] == "object"){
            if(typeof args[kA] != type[kA].type){
                return {valid: false, error: "Your request's \"" + kA + "\" field is of the wrong type and can't be processed."};
            }
        } else {
            if(typeof args[kA] != type[kA]){
                return {valid: false, error: "Your request's \"" + kA + "\" field is of the wrong type and can't be processed."};
            }
        }
    }
    for(var kT in type){
        if(!(kT in args) && !(typeof type[kT] == "object" && type[kT].optional)){
            return {valid: false, error: "Your request is missing the field \"" + kT + "\" and can't be processed."};
        }
    }
    return {valid: true};
};

app.use('/public', express.static(path.join(__dirname, 'public')));