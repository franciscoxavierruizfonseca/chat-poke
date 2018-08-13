var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');
var Evaluacion = mongoose.model('Evaluacion');


var ResultadoSchema = mongoose.Schema({
    idEvaluacion:{type:Schema.Types.ObjectId,ref: "Evaluacion",required:true},
    idUsuario:{type:Schema.Types.ObjectId,ref: "Usuario",required:true},
    Calificacion:{type:Number},
    strComentario:{type:String}
});


module.exports = mongoose.model('Resultado', ResultadoSchema);










              