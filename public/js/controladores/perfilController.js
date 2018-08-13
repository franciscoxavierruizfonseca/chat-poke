myApp.controller('perfilController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.evaluaciones = [];
    $scope.admin = true;
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
          if(response.data.code==200){
          $scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
            if($scope.tipousuario=='Usuario'){
              $scope.admin = false;
            $scope.cargarEvaluaciones();
            }
            }
            //console.log($scope.usuario);
           }, function (errResponse) {
                        
           });
}
$scope.cargarEvaluaciones = function(){
   $http.get('/listar/1').then(function (response) {
          if(response.data.code==200){
          $scope.evaluaciones = response.data.data; 
          }
           }, function (errResponse) {
                        
           });
}
   
});