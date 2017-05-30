let mongo = require("./mongo");
let md5 = require("md5");

// `sign up` and `log in` function
exports.login = function (req, resolve, reject) {

    let login = req.body.login,
        password = req.body.password;

    //check if exist user
    mongo.User.findOne({
        login: md5(login)
    }, function (err, user) {
        if (err) {
            // error in query
            reject(err);
        } else {
            // doesn't have error
            // user found
            if (user) {
                if (md5(password) == user["password"]) {
                    resolve("OK"); // say `it's ok, log in this guy`
                } else {
                    reject("Incorrect login/password");
                }
            } else {
                reject("Incorrect login/password");
            }
        }
    });
}

exports.register = function (req, resolve, reject) {
    let login = req.body.login,
        password = req.body.password;
    //if user exist
    mongo.User.findOne({
        login: md5(login)
    }, function (err, doc) {
        if (err) {
            reject(err);
        } else {
            // doesn't have error in query, continue
            if (doc) {
                // mongo found user with this login
                reject("This user is exist !");
            } else {
                // new model
                let newUser = new mongo.User({
                    login: md5(login),
                    password: md5(password)
                });
                newUser.save(function (err) {
                    if (err) {
                        reject(err);
                        console.log("error with saving");
                    } else {
                        resolve("OK"); // say `ok, I register him`
                    }
                });
            }
        }
    });
}

exports.setSettings = function (data, resolve, reject) {
    
    let settings = JSON.parse(data);
    
    mongo.User.findOneAndUpdate({
        login: md5(settings["owner"])
    }, {
        $set: {
            settings: settings["array"]
        }
    }, {$upsert: true}, function (err, doc) {
        if (doc) {
            resolve("OK");
        } else {
            reject(err);
        }
    });
}

exports.getSettings = function(owner, resolve, reject){
    resolve(mongo.User.findOne({ login: md5(owner) }, { "_id":0, "settings":1 }));
}