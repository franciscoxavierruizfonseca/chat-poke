var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Resultado = mongoose.model('Resultado');
var Preguntayrespuesta = mongoose.model('Preguntayrespuesta');


var HistorialSchema = mongoose.Schema({
    idResultado:{type:Schema.Types.ObjectId,ref: "Resultado",required:true},
    idPregunta:{type:Schema.Types.ObjectId,ref: "Preguntayrespuesta",required:true},
    idCorrecto:{type:Schema.Types.ObjectId,ref: "Preguntayrespuesta",required:true},
    idRespuesta:{type:Schema.Types.ObjectId,ref: "Preguntayrespuesta",required:true},
    ValorE:{type:Number},
    Index:{type:Number}
});


module.exports = mongoose.model('Historial', HistorialSchema);
