var mongojs = require('mongojs');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

var users = mongojs('mongodb.jaram.org/jaram').collection('users');

function signup(req, res) {
  var result = {};
  var username = req.body['username'];
  var password = req.body['password'];

  if (!username || !password) {
    res.json();
    return;
  }

  users.findOne({u:username}, function(err, doc) {
    if (err || doc) {
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
  });
}

function login(req, res) {
  var result = {};
  var username = req.body['username'];
  var password = req.body['password'];


  // TODO retry check
  users.findOne({u:username}, function(err, doc) {
    if (err || !doc) {
      res.json();
      return;
    }

    bcrypt.compare(password, doc.p, function(err, isEqual) {
      if (err || !isEqual) {
        res.json();
        return;
      }

      var timestamp = new Date().getTime().toString();

      crypto.randomBytes(8, function(err, buf) {
        if (err) {
          res.json();
          return;
        }

        var salt = buf.toString();
        var signer = crypto.createSign('RSA-SHA1');
        var accessToken = signer.sign(username + timestamp + salt, 'base64');

        users.findAndModify({
          query: { u:username },
          update: { $set : { a:accessToken } },
          new : true
        }, function(err, doc) {
             if (err) {
               res.json();
               return;
             }

             res.json(doc);
           });
      });
    });
  });
}

function list(req, res) {
  var result = {};

  users.find().sort([['_id', -1]] , function(err, docs) {
    if (err) {
      res.json();
      return;
    }

    res.json(docs);
  });
}

function info(req, res) {
  var result = {};
  var username = req.params.username;

  users.findOne({u:username}, function(err, doc) {
    if (err || !doc) {
      res.json();
      return;
    }

    res.json(doc);
  });
}

function edit(req, res) {
  var result = {};



  if (req.body['username']) {

  }
}

function delete(req, res) {

}

exports.signup = signup;
exports.login = login;
exports.list = list;