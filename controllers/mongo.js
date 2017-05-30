let mongoose = require("mongoose");
// mongoose don't have own Promise library
mongoose.Promise = Promise;
let uri = "SOME_SECRET_URI";
mongoose.connect(uri);

let User = mongoose.model('User', {
    login: String,
    password: String,
    settings: Array
});

let Tab = mongoose.model("Tab", {
    title: String,
    url: String,
    img_url: String,
    owner: String,
    category: String,
    counter: Number
})


exports.User = User;
exports.Tab = Tab;