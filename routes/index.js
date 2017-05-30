let express = require('express');
let router = express.Router();
let path = require("path");
let bodyParser = require('body-parser');
let user = require("../controllers/user");
let tab = require("../controllers/tab");
let mongoose = require("mongoose");
mongoose.Promise = Promise;

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

router.use(session({
    secret: "session",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
}));


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function(req, res){
   res.render("index", { title: "Speed Tabs" });
});

router.get("/login", function(req, res){
    if(req.session.login) {
        res.redirect("/mytabs/main");
    }
   res.render("login", { title: "Log In page" });
});

router.get("/register", function(req, res){
   res.render("register", { title: "Register page" });
});

router.post("/auth/login", function(req, res){
    function login(req){
        return new Promise(function(resolve, reject){
            user.login(req, resolve, reject);
        });
    }
    
    login(req).then(result => {
        req.session.login = req.body.login;
        res.send(result);
    }, err => {
        res.send(err);
    });
});

router.post("/auth/register", function(req, res){
    function reg(req){
        return new Promise(function(resolve, reject){
           user.register(req, resolve, reject); 
        });
    }
    
    reg(req).then(result => {
        req.session.login = req.body.login;
        res.send(result);
    }, err => {
        res.send(err);
    });
});

router.get("/mytabs/:category", function(req, res){
    if(!req.session.login) {
        res.redirect("/login");
    }
    let owner = req.session.login;
    let data = JSON.stringify({
        owner: owner,
        category: req.params.category
    });
    function getTabs(data){
        return new Promise(function(resolve, reject){
            tab.getTabs(data, resolve, reject);
        });
    }
    function getLinks(data){
        return new Promise(function(resolve, reject){
           tab.getLinks(data, resolve, reject); 
        });
    }
 /*   
    function getCounter(data){
        return new Promise((resolve, reject) => {
           tab.getCount(data, resolve, reject);
        });
    }
  */  
    getTabs(data).then(result => {
        getLinks(data).then(links => { // deepeeeer
            
            let arr = [];
            for(let i = 0; i<links.length; i++) {
                arr.push(links[i]['category']);
            }
            
          let newArr = [];
            // push link in newArr if it doesn't exist yet
          arr.forEach(function(item){
                for(let i = 0; i<newArr.length; i++){
                    if(newArr[i] == item) return false;
                }
                newArr.push(item);
            });
         //   getCounter(data).then(counters => {
         //       res.render("mytabs", { title: "My Speed Tabs", login: req.session.login, tabs: result, links: newArr, counters: counters });
         //   });
            res.render("mytabs", { title: "My Speed Tabs", login: req.session.login, tabs: result, links: newArr });
        });
       
    });
   
});

router.post("/tab/create", function(req, res){
    
    let data = JSON.stringify({ title: req.body.title, url: req.body.url,
                              imgUrl: req.body.imgUrl, owner: req.session.login,
                              category: decodeURI(req.body.category), counter: 0});
    
    function createTab(data){
        return new Promise(function(resolve, reject){
            tab.create(data, resolve, reject);
        });
    }
    
    createTab(data).then(result => {
            res.send(result);
        }, err => {
            res.send(err);
        });
});

router.post("/tab/edit", function(req, res){
    let data = JSON.stringify({ old_title: req.body.old_title, old_url: req.body.old_url,
                               title: req.body.target_title, url: req.body.target_url,
                              imgUrl: req.body.target_img_url, owner: req.session.login});
    
    function editTab(edittab){
        return new Promise(function(resolve, reject){
           tab.edit(edittab, resolve, reject);
        });
    }
    
    editTab(data).then(result => {
        res.send(result);
    });
});

router.post("/tab/delete", function(req, res){
     let data = JSON.stringify({ url: req.body.url,
                              owner: req.session.login});
    
    function deleteTab(tabOne){
        return new Promise(function(resolve, reject){
            tab.delete(tabOne, resolve, reject);
        })
    }
    
    deleteTab(data).then(result => {
        res.send(result);
    });
});

router.post("/tab/setCounter", function(req, res){
    let data = JSON.stringify({
       url: req.body.url,
       owner: req.session.login
    });
    
   function setCounter(data){
       return new Promise((resolve, reject) => {
           tab.setCount(data, resolve, reject);
       });
   } 
    
     setCounter(data).then(result => {
           res.send("OK");
       })
});

router.post("/settings/set", function(req, res){
    let data = JSON.stringify({
       owner: req.session.login,
        array: [req.body.quantity, req.body.distance, req.body.width]
    }); 
    
    function setSetting(data){
        return new Promise(function(resolve, reject){
            user.setSettings(data, resolve, reject);
        });
    }
    
    setSetting(data).then(result => {
        res.send(result);
    }, err => {
        res.send(err);
    });
});

router.post("/settings/get", function(req, res){
   function getSettings(owner){
       return new Promise(function(resolve, reject){
          user.getSettings(owner, resolve, reject); 
       });
   } 
    
    getSettings(req.session.login).then(result => {
        res.send(result);
    }, err => {
        res.send(err);
    });
});

router.get("/session/destroy", function(req, res, next){
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
