myApp.controller('editarperfilController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.editar = {};
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
          if(response.data.code==200){
           $scope.usuario = response.data.data.perfil;
           $scope.editar = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
            }
            //console.log($scope.usuario);
           }, function (errResponse) {
                        
           });
}
   
});