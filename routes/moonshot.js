var path = require('path');
var uuid = require('node-uuid');
var mongo = require('mongodb');
var shortid = require('shortid');

var appDir = path.dirname(require.main.filename);
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('moonshotdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'moonshotdb' database");
        db.collection('moonshots', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'moonshots' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;

    db.collection('moonshots', function(err, collection) {
        collection.findOne({'moonID':id}, function(err, item) {
           if(item.media){
	            res.sendFile(appDir+'/public/files/'+item.media);
	         
	        }
        });
    });
};

exports.thumbnail = function(req, res) {
    var id = req.params.id;
    var size = req.params.size;

    db.collection('moonshots', function(err, collection) {
        collection.findOne({'moonID':id}, function(err, item) {
        	if(item.media){
	            //res.sendFile(appDir+'/public/files/'+item.media);
	            
	            var file = appDir+'/public/files/'+item.media
	            var dst = appDir+'/public/files/cropped/'+item.media



	         	res.sendFile(dst);
	        }
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('moonshots', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

 
exports.addMoonShot = function(req, res) {
	var ext = path.extname(req.files.iptfile.name)
	var nname = uuid.v1() + ext;
	var sid = shortid.generate();
    var serverPath = '/public/files/' + nname;
 	var type = req.files.iptfile.type;

 	var atype = type.split("/");

 	if(atype[0] == "image"){
 		require('fs').rename(
		req.files.iptfile.path,
		appDir + serverPath,
		function(error) {
	            if(error) {
					res.send({
			                    error: 'Ah crap! Something bad happened'
					});
	                return;
	            }
	            var Data = {media:nname, moonID:sid}
	            db.collection('moonshots', function(err, collection) {
			        collection.insert(Data, {safe:true}, function(err, result) {
			            if (err) {
			                res.send({'error':'An error has occurred'});
			            } else {
			                res.send({
			                    code: 200,
			                    media: nname,
			                    moonID: sid
							});
			            }
			        });
			    });
			}
	    );
 	}else{

 		res.send({
                error: 'Wrong file'
	});


	}



}
 
exports.updateMoonShot = function(req, res) {
    var id = req.params.id;
    var moonshot = req.body;
    console.log('Updating moonshot: ' + id);
    console.log(JSON.stringify(moonshot));
    db.collection('moonshots', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, moonshot, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating moonshot: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(moonshot);
            }
        });
    });
}
 
exports.deleteMoonShot = function(req, res) {
    var id = req.params.id;
    console.log('Deleting moonshot: ' + id);
    db.collection('moonshots', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}


var populateDB = function() {
 
    var moonshots = [
    {
        name: "img",
        media: "img.jpg",
        moonID: "46Juzcyx"
    },
    {
        name: "img2",
        media: "img2.jpg",
        moonID: "eWRhpRV"
    }];
 
    db.collection('moonshots', function(err, collection) {
        collection.insert(moonshots, {safe:true}, function(err, result) {});
    });
 
};
