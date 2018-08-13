myApp.controller('indexController', function($scope, $http) {
    $scope.usuario = {};
  
    $scope.iniciarSesion = function() {
        if (!$scope.usuario.strCorreo == "") {
            if (!$scope.usuario.strPassword == "") {
               $http({
            method: 'POST',
            url: '/login',
            params: $scope.usuario
        }).then(function (response) {
            if(response.data.mensaje==true){
           window.location.href = '/inicio';
           }else{
           CrearNotificacion('Error al iniciar sesion', 'usuario o contraseña incorrectos', 'Intentelo de nuevo', 1, 39000);
           }
           }, function (errResponse) {
                        
           });

            }else{
CrearAlerta('Vaya!', 'La contraseña parece estar vacio', 4, 4000);
            }
        }else{
CrearAlerta('Vaya!', 'el correo parece estar vacio', 4, 4000);
        }
       


                        
    }

   
});