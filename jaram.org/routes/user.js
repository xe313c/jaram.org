var mongojs = require('mongojs');
var users = mongojs('mongodb.jaram.org/jaram').collection('users');

exports.signup = function(req, res) {

}

exports.new = function(req, res) {
  var username = req.body['username'];
  var password = req.body['password'];

  users.save({u:username,p:password}, function(err , doc) {
    if (err) return;

    console.log(doc);
  });
}