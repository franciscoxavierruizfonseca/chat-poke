myApp.controller('hacerevaluacionController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.evaluaciones = [];
    $scope.evaluacion = {};
    $scope.resultados = {respuestas:null,comentario:''};
    $scope.respuestas = [];
    $scope.loader = true;
    
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
        	if(response.data.code==200){
        	  $scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
            $scope.validarEvaluacion();
            $scope.cargarEvaluaciones();
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
$scope.getEvaluacion = function(){
  $http.get('/cookieEvaluacion').then(function (response) {
          if(response.data.code==200){
          $scope.evaluacion = response.data.data;
          $scope.evaluacion.preguntas.forEach((pregunta) => {
            var correcto = null;
            pregunta.respuestas.forEach((respuesta) => {
             if(respuesta.BlnCorrecto){
              correcto = respuesta._id;
             }
            });
            var respuesta = {
              idPregunta:pregunta._id,
              idRespuesta:null,
              valor:pregunta.ValorE,
              Index:pregunta.Index,
              idCorrecto:correcto,
              idEvaluacion:pregunta.idEvaluacion
            };
            $scope.respuestas.push(respuesta);
          });
          console.log($scope.respuestas);
          $scope.loader = false; 
          }
           }, function (errResponse) {
                        
           });
}

$scope.validarEvaluacion = function(){
  $http.get('/validarEvaluacion').then(function (response) {
          if(response.data.code==200){
            if(response.data.data){
              $scope.getEvaluacion();
            }else{
              swal({
              title: "Vaya!",
              text: "Ya haz realizado esta evaluacion",
              type: "info",
              timer: 4000,
              showConfirmButton: false
              },function(){
              window.location.href = '/inicio';
              });
            }
          }
           }, function (errResponse) {
                        
           });
}


$scope.evaluar = function(){

  var validar = true;
  var indexPregunta  = '';
  $scope.respuestas.forEach((respuesta) => {
   if(respuesta.idRespuesta==null){
     validar = false;
     indexPregunta += respuesta.Index+', ';
   }
  });
  if(validar){
    $scope.resultados.respuestas = $scope.respuestas;
    console.log($scope.resultados);
       swal({
        title: '¿Desea entregar la evaluacion?',
        text: 'Ya no tendra acceso a su evaluacion',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: "Entregar",
        cancelButtonText: "No",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function (isConfirm) {
        if (isConfirm) {
            setTimeout(function () {
             $http.post('/evaluar',{resultado:$scope.resultados}).then(function (response) {
             if(response.data.code==200){
              swal({
              title: "Entregada",
              type: "success",
              timer: 4000,
              showConfirmButton: false
              },function(){
              window.location.href = '/inicio';
              });
             }
             else{
             swal({
             title: "Vaya! ha ocurrido un error",
             text: response.data.data,
             type: "error",
             timer: 3000,
             showConfirmButton: false
             });
             }
             }, function (errResponse) {
                        swal({
                            title: "Vaya! ha ocurrido un error",
                            text: "Causa del error: " + errResponse.Message,
                            type: "error",
                            timer: 3000,
                            showConfirmButton: false
                        });
             });
             }, 3000);
        }

    });
  }else{
    CrearAlerta('Vaya!', 'No haz contestado la pregunta '+indexPregunta, 4, 4000);
  }
}
});