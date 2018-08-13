myApp.controller('listaController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.evaluaciones = [];
    $scope.evaluacion = {};
    $scope.titulo = 'en espera';
    $scope.seccion = {sec1:true,sec2:false,sec3:false};
    $scope.loader = true;
  
   $scope.cargarDatos = function(){
        $http.get('/getDatos').then(function (response) {
            $scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
           }, function (errResponse) {
                        
           });
        cargarEvaluaciones();
        $scope.iniciarTiempoReal();
}

$scope.iniciarTiempoReal = function(){
  setInterval('cargarEvaluaciones()', 20000);
}

$scope.cambiarSeccion = function(idseccion){
$scope.desactivarSeccion();
if(idseccion == 1){
$scope.titulo = 'en espera';
$scope.seccion.sec1 = true;
}
if(idseccion == 2){
$scope.titulo = 'activas';
$scope.seccion.sec2 = true;
}
if(idseccion == 3){
$scope.titulo = 'desactivadas';
$scope.seccion.sec3 = true;
}
cargarEvaluaciones();
}
$scope.desactivarSeccion = function(){
    $scope.titulo = '';
    $scope.seccion.sec1 = false;
    $scope.seccion.sec2 = false;
    $scope.seccion.sec3 = false;
}


cargarEvaluaciones = function(){
    if($scope.seccion.sec1){
        $http.get('/listar/0').then(function (response) {
          if(response.data.code==200){
          $scope.evaluaciones = response.data.data;
          $scope.loader = false; 
           setTimeout(function(){
        $(".dropdown-button").dropdown();
        }, 1000);
          }
           }, function (errResponse) {
                        
           });
    }
  if($scope.seccion.sec2){
        $http.get('/listar/1').then(function (response) {
          if(response.data.code==200){
          $scope.evaluaciones = response.data.data; 
           setTimeout(function(){
        $(".dropdown-button").dropdown();
        }, 1000);
          }
           }, function (errResponse) {
                        
           });
    }
    if($scope.seccion.sec3){
        $http.get('/listar/2').then(function (response) {
          if(response.data.code==200){
          $scope.evaluaciones = response.data.data; 
           setTimeout(function(){
        $(".dropdown-button").dropdown();
        }, 1000);
          }
           }, function (errResponse) {
                        
           });
    }
        

}

$scope.verEvaluacion = function(idevaluacion){
	  $http.post('/getEvaluacion',{_id:idevaluacion}).then(function (response) {
        	if(response.data.code==200){
        	$scope.evaluacion = response.data.data;	
        	 $('#modal1').modal('open');
        	}
           }, function (errResponse) {
                        
           });
}
$scope.desactivarEvaluacion = function(idevaluacion){


             swal({
        title: '¿Desea desactivar la evaluacion?',
        text: 'La evaluacion no sera usable',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Desactivar",
        cancelButtonText: "No",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function (isConfirm) {
        if (isConfirm) {
            setTimeout(function () {
             $http.post('/desactivarEvaluacion',{_id:idevaluacion}).then(function (response) {
             if(response.data.code==200){
             swal({
             title: "Desactivado",
             type: "success",
             showConfirmButton: true,
             closeOnConfirm: true
             });
             cargarEvaluaciones();
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
  }

  $scope.activarEvaluacion = function(idevaluacion){


             swal({
        title: '¿Desea activar la evaluacion?',
        text: 'La evaluacion no se podra modificar ni eliminar',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Activar",
        cancelButtonText: "No",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function (isConfirm) {
        if (isConfirm) {
            setTimeout(function () {
             $http.post('/activarEvaluacion',{_id:idevaluacion}).then(function (response) {
             if(response.data.code==200){
             swal({
             title: "Activada",
             type: "success",
             showConfirmButton: true,
             closeOnConfirm: true
             });
             cargarEvaluaciones();
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
  }



  $scope.eliminarEvaluacion = function(idevaluacion){
    swal({
        title: '¿Desea eliminar la evaluacion?',
        text: 'La evaluacion se perdera para siempre... como tu felicidad o ella',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Perderlo en el limbo",
        cancelButtonText: "No",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function (isConfirm) {
        if (isConfirm) {
            setTimeout(function () {
             $http.post('/eliminarEvaluacion',{_id:idevaluacion}).then(function (response) {
             if(response.data.code==200){
             swal({
             title: "Eliminado",
             type: "success",
             showConfirmButton: true,
             closeOnConfirm: true
             });
             cargarEvaluaciones();
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
}
 
});