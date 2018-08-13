
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Evaluacion = mongoose.model('Evaluacion');

var PreguntayrespuestaSchema = mongoose.Schema({
   idEvaluacion:{type:Schema.Types.ObjectId,ref: "Evaluacion"},
   strValor:{type:String},
   ValorE:{type:Number},
   TipoObjeto:{type:Number},
   idPregunta:{type:Schema.Types.ObjectId},
   BlnCorrecto:{type:Boolean},
   Index:{type:Number}
});


module.exports = mongoose.model('Preguntayrespuesta', PreguntayrespuestaSchema);