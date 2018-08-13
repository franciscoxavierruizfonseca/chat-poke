var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EvaluacionSchema = mongoose.Schema({
    strValor: {type:String},
    Status: {type:Number}
});


module.exports = mongoose.model('Evaluacion', EvaluacionSchema);