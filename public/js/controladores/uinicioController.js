myApp.controller('uinicioController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.evaluaciones = [];
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
        	if(response.data.code==200){
        	$scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
            }
            //console.log($scope.usuario);
           }, function (errResponse) {
                        
           });
        $scope.cargarEvaluaciones();
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