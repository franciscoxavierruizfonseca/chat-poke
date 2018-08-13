var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email valido"];         


// Virtual 

var password_validation = {
	validator: function(p){
    return this.password_confirmation ==p;
	},
	message: "La contraseña no coincide"
}


// Schema.


var UsuarioSchema = mongoose.Schema({
    strCorreo: {type:String,required:"Ingresa un correo",match:email_match},
    strContraseña:{type:String,required:"Ingresa una contraseña",minlength:[8,"El password es muy corto"],validate:password_validation},
    catUsuario:{
     id:{type:Number},
     strValor:{type:String}
    }  
});

UsuarioSchema.virtual("password_confirmation").get(function(){
return this.p_c;
}).set(function(password){
	this.p_c = password;
});


module.exports = mongoose.model('Usuario', UsuarioSchema);