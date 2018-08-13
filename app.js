// modulos
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var app = express();


// Parametros de configuracion
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(cookieParser());
    app.use(express.logger('dev'));
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.favicon());
    app.use(express.methodOverride());
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/cache" }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});



// uso de desarrollador
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//Conexión a Mongoose.

mongoose.connect('mongodb://admin:admin123456@ds119692.mlab.com:19692/chat', function(error) {
    if (error) {
        throw error;
    } else {
        console.log('Conectado a MongoDB');
    }
});

//Documentos
var Usuario = require('./Model/Usuario.js');
var Perfil = require('./Model/Perfil.js');
var Evaluacion = require('./Model/Evaluacion.js');
var Preguntayrespuesta = require('./Model/Preguntayrespuesta.js');
var Resultado = require('./Model/Resultado.js');
var Historial = require('./Model/Historial.js');


//REST API && HTTP Peticiones
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

app.post("/login", function(req, res) {
    Usuario.find({ strCorreo: req.query.strCorreo, strContraseña: req.query.strPassword }, function(err, documento) {
        var respuesta = { mensaje: false };
        if (documento.length > 0) {
            respuesta.mensaje = true;
            res.cookie('idusuario', documento[0]._id);
            res.send(respuesta);
        } else {
            respuesta.mensaje = false;
            res.send(respuesta);
        }
    });
});

app.get('/registro', function(req, res) {
    res.sendfile('./public/registro.html');
});

app.post("/registrar", function(req, res) {
    var catUsuario = {
        id: 0,
        strValor: ''
    };
    var nombreperfil = '';
    var nombrebanner = '';
    var target_path_perfil = '';
    var target_path_banner = '';
    var tmp_path_perfil = '';
    var tmp_path_banner = '';
    if (req.body.idUsuario == 1) {
        catUsuario.id = 1;
        catUsuario.strValor = 'Administrador';
    } else {
        catUsuario.id = 2;
        catUsuario.strValor = 'Usuario';
    }
    var usuario = new Usuario({
        strCorreo: req.body.strCorreo,
        strContraseña: req.body.strContraseña,
        catUsuario: catUsuario,
        password_confirmation: req.body.strPC
    });
    usuario.save().then(function(documento) {
        // guardo rutas de perfil
        tmp_path_perfil = req.files.imagePerfil.path;
        var tipo = req.files.imagePerfil.type;
        if (tipo == 'image/png' || tipo == 'image/jpg' || tipo == 'image/jpeg') {
            var nombrearchivo = req.files.imagePerfil.name;
            var extension = nombrearchivo.split('.');
            var nombredata = documento._id + '-perfil.' + extension[1];
            nombreperfil = nombredata;
            target_path_perfil = './public/bdimg/' + nombredata;
        }
        // guardo rutas de banner
        tmp_path_banner = req.files.imageBanner.path;
        var tipo = req.files.imageBanner.type;
        if (tipo == 'image/png' || tipo == 'image/jpg' || tipo == 'image/jpeg') {
            var nombrearchivo = req.files.imageBanner.name;
            var extension = nombrearchivo.split('.');
            var nombredata = documento._id + '-banner.' + extension[1];
            nombrebanner = nombredata;
            var target_path_banner = './public/bdimg/' + nombredata;
        }
        var perfil = new Perfil({
            strNombre: req.body.strNombre,
            strApellidop: req.body.strApellidop,
            strApellidom: req.body.strApellidom,
            strUsuario: req.body.strUsuario,
            strImgperfil: nombreperfil,
            strImgbanner: nombrebanner,
            idUsuario: documento._id
        });


        perfil.save().then(function(documento) {
            fs.rename(tmp_path_perfil, target_path_perfil, function(err) {
                fs.unlink(tmp_path_perfil, function(err) {
                    fs.rename(tmp_path_banner, target_path_banner, function(err) {
                        fs.unlink(tmp_path_banner, function(err) {
                            res.redirect('/');
                        });
                    });
                });
            });

        }, function(err) {
            fs.unlink(req.files.imagePerfil.path, function(err) {
                fs.unlink(req.files.imageBanner.path, function(err) {
                    Usuario.findOneAndRemove({ _id: documento._id }, function(err) {});
                });
            });
            res.send(String(err));
        });
    }, function(err) {
        fs.unlink(req.files.imagePerfil.path, function(err) {
            fs.unlink(req.files.imageBanner.path, function(err) {});
        });
        res.send(String(err));
    });
});














app.post('/registrarevaluacion', function(req, res) {
    var oldrespuestas = [];
    var indexrespuestas = [];
    var idpreguntas = [];
    var contadorrespuestas = 0;
    var evaluacion = new Evaluacion({
        strValor: req.body.strValor,
        Status: 0
    });
    evaluacion.save(function(error, evaluacion) {
        var preguntas = req.body.preguntas;
        for (var x = 0; x < preguntas.length; x++) {
            var objpregunta = preguntas[x];
            var preguntaDB = new Preguntayrespuesta({
                idEvaluacion: evaluacion._id,
                strValor: objpregunta.strValor,
                ValorE: objpregunta.ValorE,
                TipoObjeto: 0,
                Index: objpregunta.id
            });
            oldrespuestas.push(objpregunta.respuestas);
            //indexrespuestas.push(objpregunta.res);
            preguntaDB.save(function(error, pregunta) {
                var respuestas = [];
                oldrespuestas.forEach((respuesta) => {
                    if (pregunta.Index == respuesta[0].indexPregunta) {
                        respuestas = respuesta;
                    }
                });
                idpreguntas[contadorrespuestas] = pregunta._id;
                //var respuestas = oldrespuestas[contadorrespuestas];
                //var indexrespuesta = indexrespuestas[contadorrespuestas];
                var idpregunta = idpreguntas[contadorrespuestas];
                contadorrespuestas++;
                for (var y = 0; y < respuestas.length; y++) {
                    var objrespuesta = respuestas[y];
                    //var correcto = false;
                    //if(objrespuesta.id == indexrespuesta){
                    //   correcto = true;
                    //}

                    var respuestaDB = new Preguntayrespuesta({
                        idPregunta: idpregunta,
                        strValor: objrespuesta.strValor,
                        BlnCorrecto: objrespuesta.correcto,
                        TipoObjeto: 1,
                        Index: objrespuesta.id
                    });
                    respuestaDB.save(function(error, respuesta) {
                        res.send(true);
                    });
                }
            });

        }


    });
});






app.get("/logout", function(req, res) {
    res.clearCookie("idusuario");
    res.redirect("");
});





app.get('/inicio', function(req, res) {
    Usuario.findOne({ _id: req.cookies.idusuario }, function(error, usuario) {
        if (usuario.catUsuario.id == 1) {
            res.sendfile('./public/inicioadmin.html');
        } else {
            res.sendfile('./public/iniciousuario.html');
        }
    });

});

app.get('/evaluacion', function(req, res) {
    res.sendfile('./public/encuesta.html');
});

app.get('/lista', function(req, res) {
    res.sendfile('./public/listaevaluaciones.html');
});

app.get('/getDatos', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    Usuario.findOne({ _id: req.cookies.idusuario }, function(error, usuario) {
        Perfil.findOne({ idUsuario: req.cookies.idusuario }, function(error, perfil) {
            var data = {};
            data.tipousuario = usuario.catUsuario.strValor;
            data.perfil = perfil;
            response.code = 200;
            response.data = data;
            res.send(response);
        });
    });

});

app.get('/cookieEvaluacion', function(req, res) {
    var data = {
        evaluacion: null,
        preguntas: []
    }
    var contador = 0;
    Evaluacion.findById(req.cookies.idevaluacion, function(error, evaluacion) {
        data.evaluacion = evaluacion;
        Preguntayrespuesta.find({ idEvaluacion: req.cookies.idevaluacion }, function(error, preguntas) {
            for (key in preguntas) {
                var preguntatemp = {
                    _id: preguntas[key]._id,
                    idEvaluacion: preguntas[key].idEvaluacion,
                    strValor: preguntas[key].strValor,
                    ValorE: preguntas[key].ValorE,
                    TipoObjeto: preguntas[key].TipoObjeto,
                    Index: preguntas[key].Index,
                    respuestas: []
                };
                data.preguntas.push(preguntatemp);
                Preguntayrespuesta.find({ idPregunta: preguntas[key]._id }, function(error, respuestas) {
                    data.preguntas.forEach((pregunta) => {
                        if (respuestas[0].idPregunta.toString() == pregunta._id.toString()) {
                            pregunta.respuestas = respuestas;
                            if (contador == (data.preguntas.length - 1)) {
                                var response = {
                                    code: 200,
                                    data: data
                                };
                                res.send(response);
                            }
                            contador++;
                        }
                    });
                });
            }



        });
    });


});



app.get('/hacerevaluacion/:id', function(req, res) {
    if (req.params.id) {
        res.cookie('idevaluacion', req.params.id);
        res.sendfile('./public/hacerevaluacion.html');
    } else {
        res.redirect('/inicio');
    }

});

app.get('/listar/:id', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    if (req.params.id == 3) {
        Evaluacion.find({}, function(error, evaluaciones) {
            if (error) {
                response.code = 400;
                response.data = 'Error en el servidor';
                res.send(response);
            } else {
                if (evaluaciones.length > 0) {
                    response.code = 200;
                    response.data = evaluaciones;
                } else {
                    response.code = 200;
                    response.data = [];
                }
                res.send(response);
            }
        });
    } else {
        Evaluacion.find({ Status: req.params.id }, function(error, evaluaciones) {
            if (error) {
                response.code = 400;
                response.data = 'Error en el servidor';
                res.send(response);
            } else {
                if (evaluaciones.length > 0) {
                    response.code = 200;
                    response.data = evaluaciones;
                } else {
                    response.code = 200;
                    response.data = [];
                }
                res.send(response);
            }
        });
    }

});

app.post('/activarEvaluacion', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    Evaluacion.findByIdAndUpdate(req.body._id, { $set: { Status: 1 } }, { new: true }, function(err, evaluacion) {
        if (err) {
            response.code = 400;
            response.data = 'Error al solicitar conexion al servidor';
        } else {
            response.code = 200;
            response.data = true;
        }
        res.send(response);
    });
});

app.post('/desactivarEvaluacion', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    Evaluacion.findByIdAndUpdate(req.body._id, { $set: { Status: 2 } }, { new: true }, function(err, evaluacion) {
        if (err) {
            response.code = 400;
            response.data = 'Error al solicitar conexion al servidor';
        } else {
            response.code = 200;
            response.data = true;
        }
        res.send(response);
    });
});

app.post('/eliminarEvaluacion', function(req, res) {
    var deleteids = [];
    var acu = 0;
    var response = {
        code: 0,
        data: null
    };
    var idevaluacion = req.body._id;
    Preguntayrespuesta.find({ idEvaluacion: req.body._id }, function(err, preguntas) {
        preguntas.forEach((pregunta) => {
            deleteids.push(pregunta._id);
            Preguntayrespuesta.find({ idPregunta: pregunta._id }, function(err, respuestas) {
                respuestas.forEach((respuesta) => {
                    deleteids.push(respuesta._id);
                });
                acu++;
                if (acu == preguntas.length) {
                    var acu2 = 1;
                    deleteids.forEach((id) => {
                        Preguntayrespuesta.remove({ _id: id }, function(err) {
                            if (acu2 == deleteids.length) {
                                Evaluacion.remove({ _id: idevaluacion }, function(err) {
                                    if (err) {
                                        response.code = 400;
                                        response.data = 'Error al solicitar conexion al servidor';
                                    } else {
                                        response.code = 200;
                                        response.data = true;
                                    }
                                    res.send(response);
                                });
                            }
                            acu2++;
                        });
                    });
                }
            });
        });

    });
});

app.post('/getEvaluacion', function(req, res) {
    var data = {
        evaluacion: null,
        preguntas: []
    }
    var contador = 0;
    Evaluacion.findById(req.body._id, function(error, evaluacion) {
        data.evaluacion = evaluacion;
        Preguntayrespuesta.find({ idEvaluacion: req.body._id }, function(error, preguntas) {
            for (key in preguntas) {
                var preguntatemp = {
                    _id: preguntas[key]._id,
                    idEvaluacion: preguntas[key].idEvaluacion,
                    strValor: preguntas[key].strValor,
                    ValorE: preguntas[key].ValorE,
                    TipoObjeto: preguntas[key].TipoObjeto,
                    Index: preguntas[key].Index,
                    respuestas: []
                };
                data.preguntas.push(preguntatemp);
                Preguntayrespuesta.find({ idPregunta: preguntas[key]._id }, function(error, respuestas) {
                    data.preguntas.forEach((pregunta) => {
                        if (respuestas[0].idPregunta.toString() == pregunta._id.toString()) {
                            pregunta.respuestas = respuestas;
                            if (contador == (data.preguntas.length - 1)) {
                                var response = {
                                    code: 200,
                                    data: data
                                };
                                res.send(response);
                            }
                            contador++;
                        }
                    });
                });
            }



        });
    });

});

app.post('/getEvaluacionhistorial', function(req, res) {
    var data = {
        evaluacion: null,
        preguntas: [],
        historial: []
    }
    var idevaluacion;
    var contador = 0;
    Evaluacion.findById(req.body._id, function(error, evaluacion) {
        data.evaluacion = evaluacion;
        idevaluacion = evaluacion._id;
        Preguntayrespuesta.find({ idEvaluacion: req.body._id }, function(error, preguntas) {
            for (key in preguntas) {
                var preguntatemp = {
                    _id: preguntas[key]._id,
                    idEvaluacion: preguntas[key].idEvaluacion,
                    strValor: preguntas[key].strValor,
                    ValorE: preguntas[key].ValorE,
                    TipoObjeto: preguntas[key].TipoObjeto,
                    Index: preguntas[key].Index,
                    respuestas: []
                };
                data.preguntas.push(preguntatemp);
                Preguntayrespuesta.find({ idPregunta: preguntas[key]._id }, function(error, respuestas) {
                    data.preguntas.forEach((pregunta) => {
                        if (respuestas[0].idPregunta.toString() == pregunta._id.toString()) {
                            pregunta.respuestas = respuestas;
                            if (contador == (data.preguntas.length - 1)) {
                                Resultado.findOne({ idEvaluacion: idevaluacion }, function(error, resultado) {
                                    Historial.find({ idResultado: resultado._id }, function(error, historiales) {
                                        data.historial = historiales;
                                        var response = {
                                            code: 200,
                                            data: data
                                        };
                                        res.send(response);
                                    });
                                });
                            }
                            contador++;
                        }
                    });
                });
            }



        });
    });

});

app.post('/evaluar', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    var contador = 0;
    var resultados = req.body.resultado.respuestas;
    var comentario = req.body.resultado.comentario;
    var puntaje = 0;
    var total = 0;
    var idEvaluacion = null;
    resultados.forEach((resultado) => {
        if (resultado.idCorrecto.toString() == resultado.idRespuesta.toString()) {
            puntaje += resultado.valor;
        }
        total += resultado.valor;
    });
    var calificacion = (puntaje * 10) / total;
    var resultado = new Resultado({
        idEvaluacion: resultados[0].idEvaluacion,
        idUsuario: req.cookies.idusuario,
        Calificacion: calificacion,
        strComentario: comentario
    });
    resultado.save(function(error, result) {
        resultados.forEach((resultado) => {
            var historial = new Historial({
                idResultado: result._id,
                idPregunta: resultado.idPregunta,
                idCorrecto: resultado.idCorrecto,
                idRespuesta: resultado.idRespuesta,
                ValorE: resultado.valor,
                Index: resultado.Index
            });
            historial.save(function(error, historial) {
                contador++;
                if (contador == resultados.length) {
                    response.code = 200;
                    response.data = 'Exito';
                    res.send(response);
                }
            });
        })
    });
});

app.get('/resultado', function(req, res) {
    res.sendfile('./public/resultado.html');
});

app.get('/resultados', function(req, res) {
    res.sendfile('./public/resultados.html');
});

app.get('/perfil', function(req, res) {
    res.sendfile('./public/perfil.html');
});

app.get('/getResultado', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    var contador = 0;
    var resultadostemp = [];
    Resultado.find({ idUsuario: req.cookies.idusuario }, function(err, resultados) {
        if (resultados.length > 0) {
            resultados.forEach((resultado) => {
                Evaluacion.findById(resultado.idEvaluacion, function(error, evaluacion) {
                    var r = {
                        Evaluacion: evaluacion,
                        idUsuario: resultado.idUsuario,
                        Calificacion: resultado.Calificacion,
                        strComentario: resultado.strComentario
                    };
                    resultadostemp.push(r);
                    contador++;
                    if (contador == resultados.length) {
                        if (err) {
                            response.code = 400;
                            response.data = 'Error al solicitar conexion al servidor';
                        } else {
                            response.code = 200;
                            response.data = resultadostemp;
                        }
                        res.send(response);
                    }
                });
            });
        } else {
            response.code = 200;
            response.data = [];
            res.send(response);
        }


    });
});

app.get('/getAllresultados', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    var contador = 0;
    var resultadostemp = [];
    Resultado.find({}, function(err, resultados) {
        if (resultados.length > 0) {
            resultados.forEach((resultado) => {
                Evaluacion.findById(resultado.idEvaluacion, function(error, evaluacion) {
                    Perfil.findOne({ idUsuario: resultado.idUsuario }, function(error, usuario) {
                        var r = {
                            Evaluacion: evaluacion,
                            Usuario: usuario,
                            Calificacion: resultado.Calificacion,
                            strComentario: resultado.strComentario
                        };
                        resultadostemp.push(r);
                        contador++;
                        if (contador == resultados.length) {
                            if (err) {
                                response.code = 400;
                                response.data = 'Error al solicitar conexion al servidor';
                            } else {
                                response.code = 200;
                                response.data = resultadostemp;
                            }
                            res.send(response);
                        }
                    });
                });
            });
        } else {
            response.code = 200;
            response.data = [];
            res.send(response);
        }


    });
});



app.get('/evaluaciones', function(req, res) {
    res.sendfile('./public/evaluaciones.html');
});

app.get('/editarperfil', function(req, res) {
    res.sendfile('./public/editarperfil.html');
});


app.get('/validarEvaluacion', function(req, res) {
    var response = {
        code: 0,
        data: null
    };
    Resultado.find({ idEvaluacion: req.cookies.idevaluacion, idUsuario: req.cookies.idusuario }, function(error, evaluaciones) {
        if (error) {
            response.code = 400;
            response.data = 'Error en el servidor';
            res.send(response);
        } else {
            if (evaluaciones.length > 0) {
                response.code = 200;
                response.data = false;
            } else {
                response.code = 200;
                response.data = true;
            }
            res.send(response);
        }
    });
});

// creacion del servidor
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express escucha el puerto: ' + app.get('port'));
});