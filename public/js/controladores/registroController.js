

myApp.controller('registroController', function($scope, $http) {
    $scope.formdata = {};
  
    $scope.guardarDatos = function() {
        console.log($scope.formdata.imagePerfil);
       $http({
            method: 'POST',
            url: '/registrarangular',
            params: $scope.formdata.imagePerfil
        }).then(function (response) {
           
           }, function (errResponse) {
                        
           });

    }

   
});