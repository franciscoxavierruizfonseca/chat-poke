myApp.controller('resultadoController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.evaluaciones = [];
    $scope.Resultados = [];
    $scope.loader = true;
    
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
        	if(response.data.code==200){
        	  $scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
            $scope.cargarEvaluaciones();
            $scope.cargarResultados();
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

$scope.cargarResultados = function(){
   $http.get('/getResultado').then(function (response) {
          if(response.data.code==200){
          $scope.resultados = response.data.data; 
          $scope.loader = false;
          }
           }, function (errResponse) {
                        
           });
}


});