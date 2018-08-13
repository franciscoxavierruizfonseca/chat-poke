myApp.controller('resultadosController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.evaluacion = {};
    $scope.historial = [];
    $scope.evaluaciones = [];
    $scope.Resultados = [];
    $scope.filtros = [];
    $scope.filtro = {};
    $scope.loader = true;
    
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
        	if(response.data.code==200){
        	  $scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
            $scope.cargarEvaluaciones(1);
            $scope.cargarResultados(1);
            $scope.iniciarTiempoReal();
            }
            //console.log($scope.usuario);
           }, function (errResponse) {
                        
           });
        
        
}

$scope.iniciarTiempoReal = function(){
  setInterval('cambiarFiltroReal()', 20000);
  }

$scope.cargarEvaluaciones = function(status){
   $http.get('/listar/3').then(function (response) {
          if(response.data.code==200){
            $scope.evaluaciones = [];
          var evaluaciontemp = {
            _id:0,
            strValor:'Todos'
          }
          $scope.evaluaciones.push(evaluaciontemp);
          for(var x=0;x<response.data.data.length;x++){
          $scope.evaluaciones.push(response.data.data[x]);
          }
          if(status==1){
          $scope.filtro = $scope.evaluaciones[0];  
          }
          }
           }, function (errResponse) {
                        
           });
}

$scope.cargarResultados = function(status){
   $http.get('/getAllresultados').then(function (response) {
          if(response.data.code==200){

          $scope.resultados = response.data.data;
          
           if(status==1){
            $scope.filtros = $scope.resultados;
            }
          $scope.loader = false;
          }
           }, function (errResponse) {
                        
           });
}
$scope.cambiarFiltro = function(){
$scope.filtros = [];
loader = true;
$scope.cargarResultados(2);
if($scope.filtro._id==0){
$scope.filtros = $scope.resultados;
}else{
for(var x=0;x<$scope.resultados.length;x++){
  if($scope.resultados[x].Evaluacion._id==$scope.filtro._id){
  $scope.filtros.push($scope.resultados[x]);
  }
}
}
}

$scope.verEvaluacion = function(idevaluacion){
    $http.post('/getEvaluacionhistorial',{_id:idevaluacion}).then(function (response) {
          if(response.data.code==200){
          $scope.evaluacion = response.data.data;
          $scope.historial = $scope.evaluacion.historial;
          for(var x = 0;x<$scope.historial.length;x++){
            var idRespuesta = $scope.historial[x].idRespuesta;
            var idPregunta = $scope.historial[x].idPregunta;
            for(var y = 0;y<$scope.evaluacion.preguntas.length;y++){
               if(idPregunta==$scope.evaluacion.preguntas[y]._id){
                  for(var z = 0;z<$scope.evaluacion.preguntas[y].respuestas.length;z++){
                    $scope.evaluacion.preguntas[y].respuestas[z].BlnRespondido=false;
                   if($scope.evaluacion.preguntas[y].respuestas[z]._id==idRespuesta){
                     $scope.evaluacion.preguntas[y].respuestas[z].BlnRespondido=true;
                   }
                  }
               }
            }
          }
          console.log($scope.evaluacion);
           $('#modal1').modal('open');
          }
          
          
           }, function (errResponse) {
                        
           });
}

cambiarFiltroReal = function(){
$scope.filtros = [];
loader = true;
cargarResultadosReal(2);
if($scope.filtro._id==0){
$scope.filtros = $scope.resultados;
}else{
for(var x=0;x<$scope.resultados.length;x++){
  if($scope.resultados[x].Evaluacion._id==$scope.filtro._id){
  $scope.filtros.push($scope.resultados[x]);
  }
}
}
}


cargarResultadosReal = function(status){
   $http.get('/getAllresultados').then(function (response) {
          if(response.data.code==200){

          $scope.resultados = response.data.data;
           if(status==1){
            $scope.filtros = $scope.resultados;
            }
          $scope.loader = false;
          }
           }, function (errResponse) {
                        
           });
}


});