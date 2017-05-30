let mongo = require("./mongo");

exports.create = function(req, resolve, reject){
    let data = JSON.parse(req);
    
    let newTab = new mongo.Tab({ title: data.title, url: data.url, img_url: data.imgUrl, 
                                owner: data.owner, category: data.category, counter: 0 });
    newTab.save(function(err){
        if(err) {
            reject(err);
        } else {
            resolve("OK");
        }
    })
}

exports.getTabs = function(info, resolve, reject) {
    let data = JSON.parse(info);
    resolve(mongo.Tab.find({category: data["category"], owner: data["owner"]}));
}

exports.getLinks = function(info, resolve, reject){
    let data = JSON.parse(info);
    resolve(mongo.Tab.find({owner: data["owner"]}, {"category":1, "_id":0}));
}

exports.edit = function(info, resolve, reject){
    let tab = JSON.parse(info);
    
    mongo.Tab.findOneAndUpdate({ owner: tab["owner"], url: tab["old_url"], title: tab["old_title"] }, { title: tab["title"], url: tab["url"],
                                                                                            img_url: tab["imgUrl"]}, function(err, doc){
        if(err) {
            reject(err);
        } else if(doc){
            resolve("OK");
        }
    });
}

exports.delete = function(info, resolve, reject){
    let tab = JSON.parse(info);
    
    mongo.Tab.find({ owner: tab["owner"], url: tab["url"] }).remove(function(){
        resolve("OK");
    });
}

exports.setCount = function(info, resolve, reject){
    let data = JSON.parse(info);
    
    mongo.Tab.findOneAndUpdate({"owner":data["owner"], "url":data["url"]}, {$inc:{  "counter":1 }}, function(err, doc){
        if(doc){
            resolve("OK");
        } else {
            reject(err);
        }
    });
}

exports.getCount = function(info, resolve, reject){
    let data = JSON.parse(info);
    
    resolve(mongo.Tab.findOne({owner: data["owner"], url: data["url"]}, {"_id": 0, "counter":1}));
}
