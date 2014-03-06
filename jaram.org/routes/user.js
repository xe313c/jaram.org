var mongojs = require('mongojs');
var bcrypt = require('bcrypt');

var users = mongojs('mongodb.jaram.org/jaram').collection('users');

exports.signup = function(req, res) {

  res.json();
  return;

  var result = {};
  var username = req.body['username'];
  var password = req.body['password'];

  if (!username || !password) {
    res.json();
    return;
  }

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {

      var user = {
          u: username,
          p: hash
      }

      users.save(user, function(err, doc) {
        if (err) return;

        console.log(doc);
      });
    });
  });
}