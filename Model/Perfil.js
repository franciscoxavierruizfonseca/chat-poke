var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');

var PerfilSchema = mongoose.Schema({
    strNombre: {type:String,required:"Debes ingresar un nombre",minLength:[2,"El nombre es muy corto"]},
    strApellidop: {type:String,required:"Debes ingresar un apellido paterno",minlength:[2,"El apellido paterno es muy corto"]},
    strApellidom: {type:String,required:"Debes ingresar un apellido materno",minlength:[2,"El apellido materno es muy corto"]},
    strUsuario: {type:String,required:"Debes ingresar un usuario",maxlength:[50,"Usuario muy largo"]},
    strImgperfil:{type:String,required:true},
    strImgbanner: {type:String,required:true},
    idUsuario: {type:Schema.Types.ObjectId,ref: "Usuario",required:true}
});


module.exports = mongoose.model('Perfil', PerfilSchema);