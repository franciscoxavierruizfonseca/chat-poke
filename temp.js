app.post("/registrar", function(req, res){
        var nombreperfil = '';
        var nombrebanner = '';
        var usuario = new Usuario({
           strCorreo: req.body.strCorreo,
           strContraseña: req.body.strContraseña
        });
        usuario.save().then(function(documento){
          
                   var tmp_path=req.files.imagePerfil.path;
                   var tipo=req.files.imagePerfil.type;
                   if(tipo=='image/png' || tipo=='image/jpg' || tipo=='image/jpeg'){
                   var nombrearchivo=req.files.imagePerfil.name;
                   var extension = nombrearchivo.split('.');
                   var nombredata = documento._id+'-perfil.'+extension[1];
                   nombreperfil = nombredata;
                   var target_path='./public/bdimg/'+nombredata;
                   fs.rename(tmp_path,target_path,function(err){
                       fs.unlink(tmp_path,function(err){
                       
                      
                  var tmp_path=req.files.imageBanner.path;
                   var tipo=req.files.imageBanner.type;
                   if(tipo=='image/png' || tipo=='image/jpg' || tipo=='image/jpeg'){
                   var nombrearchivo=req.files.imageBanner.name;
                   var extension = nombrearchivo.split('.');
                   var nombredata = documento._id+'-banner.'+extension[1];
                   nombrebanner = nombredata;
                   var target_path='./public/bdimg/'+nombredata;
                   fs.rename(tmp_path,target_path,function(err){
                    if(err){
                         res.send('Error inesperado');
                    }else{

                       fs.unlink(tmp_path,function(err){
                       if(err){
                         res.send('Error inesperado');
                       }else{
                          
                        var perfil = new Perfil({
                        strNombre: req.body.strNombre,
                        strApellidop: req.body.strApellidop,
                        strApellidom: req.body.strApellidom,
                        strUsuario: req.body.strUsuario,
                        strImgperfil: nombreperfil,
                        strImgbanner: nombrebanner,
                        idUsuario: documento._id
                        });

                        perfil.save().then(function(documento){
                        res.sendfile('./public/index.html');
                        },function(err){
                          res.send('Error al registrar el perfil');
                        });
                        }

               });

                    }
                       
                   });
                   }else{
                        res.send('Tipo de archivo no soportado banner');
                   }


                       });
                   });
                   }else{
                        res.send('Tipo de archivo no soportado perfil');
                   }
        },function(err){
            res.send('Error al registrar el usuario');
        });

        
});
