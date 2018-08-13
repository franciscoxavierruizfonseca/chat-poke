var express = require('express')
    , path = require('path') 
    ,fs = require('fs');
;

var app = express();

app.configure(function(){
  //app.set('photos', __dirname + '/public');
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/bdimg" }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/', function(req, res){
	res.sendfile('./public/upload.html');
});

app.post("/upload", function(req, res){

    
var tmp_path=req.files.image.path;
	var tipo=req.files.image.type;
	if(tipo=='image/png' || tipo=='image/jpg' || tipo=='image/jpeg'){
  var nombrearchivo=req.files.image.name;
  var target_path='./public/bdimg/'+nombrearchivo;
  fs.rename(tmp_path,target_path,function(err){
        fs.unlink(tmp_path,function(err){
          res.send('<p>archivo subido</p><br><img src="./bdimg/'+nombrearchivo+'"/>');
        });
  });
	}else{
         res.send('Tipo de archivo no soportado');
	}




});
app.listen(3000, function(){
  console.log("server started in port 3000")
}); 