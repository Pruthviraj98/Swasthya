const User = require('../models/user');

//Gets a JSON with a list of information regarding all users.
exports.user_all = function(req, res) {
    User.getAll(res);
};

//Adds a new user to the database with automatic ID generation.
//Usage: body:user, body:email, body:pass
exports.user_new = function(req, res) {
    User.newUser(req.body.user, req.body.email, req.body.pass, res);
};

//Gets a JSON with a user's information (finds using username).
//Usage: params:name
exports.user_get = function(req, res) {
    User.getInfo(req.params.name, res);
};

//Updates a user's information (finds using username).
//Usage: params:name, body:email, body:pass
exports.user_update = function(req, res) {
    User.updateUser(req.params.name, req.body.email, req.body.pass, res);
};

//Deletes a user from the database (finds using username).
//Usage: params:name, body:pass
exports.user_delete = function(req, res) {
    User.deleteUser(req.params.name, req.body.pass, res);
};
