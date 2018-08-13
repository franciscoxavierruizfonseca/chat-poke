myApp.controller('encuestaController', function($scope, $http) {
    $scope.usuario = {};
    $scope.tipousuario = '';
    $scope.mensaje = 'Agregar pregunta';
    $scope.editar = false;
    $scope.evaluacion = {
      strValor:'Nombrame...',
      preguntas: []	
    };
    $scope.encuestatemp = {
    	id:0,
    	strValor:'',
    	respuestas : [],
    	res: 0,
    	ValorE:0
    };

   
   $scope.cargarDatos = function(){
        $http({
            method: 'GET', url: '/getDatos'
        }).then(function (response) {
            $scope.usuario = response.data.data.perfil;
            $scope.tipousuario = response.data.data.tipousuario;
           }, function (errResponse) {
                        
           });
}
   $scope.addRespuesta = function(){
   	if(!$scope.tempres==''){
   			$scope.respuesta = {
   		id: ($scope.encuestatemp.respuestas.length+1),
   		strValor : $scope.tempres,
      indexPregunta:0,
      correcto:false
   	};
   	$scope.encuestatemp.respuestas.push($scope.respuesta);
   	$scope.tempres = '';
   	}
   else{
   	CrearAlerta('Hey!', 'La respuesta no puede estar vacia', 4, 4000);
   }
   }

   $scope.deleteRespuesta = function(idrespuesta){

   	for (var x = 0; x < $scope.encuestatemp.respuestas.length; x++) {
        if ($scope.encuestatemp.respuestas[x].id == idrespuesta) {
        	if($scope.encuestatemp.res==idrespuesta){
            $scope.encuestatemp.res = 0;
        	}
        $scope.encuestatemp.respuestas.splice(x, 1);
        }
    }
    $scope.indexarRespuesta();
   }
   $scope.indexarRespuesta = function(){
        for (var x = 0; x < $scope.encuestatemp.respuestas.length; x++) {
        	$scope.encuestatemp.respuestas[x].id = (x+1);
        }
   }

   $scope.addPregunta = function(){
   	if(!$scope.encuestatemp.strValor == ''){
         if($scope.encuestatemp.ValorE!=0){

      if($scope.encuestatemp.respuestas.length>1){
         if($scope.encuestatemp.res != 0){

            if($scope.encuestatemp.id == 0){
              $scope.encuestatemp.respuestas.forEach((respuesta) => {
                if(respuesta.id==$scope.encuestatemp.res){
                 respuesta.correcto = true;
                }
               respuesta.indexPregunta = $scope.evaluacion.preguntas.length+1;
              });

            $scope.pregunta = {
            	id:($scope.evaluacion.preguntas.length+1),
            	strValor:$scope.encuestatemp.strValor,
            	respuestas:$scope.encuestatemp.respuestas,
            	res:$scope.encuestatemp.res,
            	ValorE:$scope.encuestatemp.ValorE
            }
            $scope.evaluacion.preguntas.push($scope.pregunta);	
            }
            else{
                $scope.encuestatemp.respuestas.forEach((respuesta) => {
                respuesta.correcto = false;
                if(respuesta.id==$scope.encuestatemp.res){
                 respuesta.correcto = true;
                }
              });
              
            	$scope.pregunta = {
            	id:$scope.encuestatemp.id,
            	strValor:$scope.encuestatemp.strValor,
            	respuestas:$scope.encuestatemp.respuestas,
            	res:$scope.encuestatemp.res,
            	ValorE:$scope.encuestatemp.ValorE
            }
                $scope.setPregunta($scope.pregunta);

            }
         	
            $scope.resetencuesta();
        }  else{
         	CrearAlerta('Advertencia', 'La pregunta debe tener una respuesta correcta', 4, 4000);
         }
      }else{
        CrearAlerta('mmm...', 'La pregunta debe contener minimo 2 respuestas', 4, 4000);
      }
  }else{
  		CrearAlerta('Vaya!', 'La pregunta debe tener un valor mayor a 0', 4, 4000);
  }
   	}else{
   		CrearAlerta('Vaya!', 'La pregunta esta vacia', 4, 4000);
   	}
   }

$scope.deletePregunta = function(idpregunta){
	for (var x = 0; x < $scope.evaluacion.preguntas.length; x++) {
        if ($scope.evaluacion.preguntas[x].id == idpregunta) {
        $scope.evaluacion.preguntas.splice(x, 1);
        }
    }
    $scope.indexarPreguntas();
}

$scope.editPregunta = function(idpregunta){
	var temp = {
	            id:0,
            	strValor:'',
            	respuestas:[],
            	res:0,
            	ValorE:0	
	};
	for (var x = 0; x < $scope.evaluacion.preguntas.length; x++) {
        if ($scope.evaluacion.preguntas[x].id == idpregunta) {
        	temp.id = $scope.evaluacion.preguntas[x].id;
        	temp.strValor = $scope.evaluacion.preguntas[x].strValor;
        	temp.respuestas = $scope.evaluacion.preguntas[x].respuestas;
        	temp.res = $scope.evaluacion.preguntas[x].res;
        	temp.ValorE = $scope.evaluacion.preguntas[x].ValorE;
           $scope.encuestatemp = temp;
           $scope.mensaje = 'Editar pregunta';
           $scope.editar = true;
        }
    }
  
}

$scope.setPregunta = function(pregunta){
	for (var x = 0; x < $scope.evaluacion.preguntas.length; x++) {
        if ($scope.evaluacion.preguntas[x].id == pregunta.id) {
          $scope.evaluacion.preguntas[x] = pregunta;
        }
    }
}

 $scope.indexarPreguntas = function(){
        for (var x = 0; x < $scope.evaluacion.preguntas.length; x++) {
        	$scope.evaluacion.preguntas[x].id = (x+1);
          $scope.evaluacion.preguntas[x].respuestas.forEach((respuesta) => {
          respuesta.indexPregunta = $scope.evaluacion.preguntas[x].id;
          });
        }
   }

   $scope.resetencuesta = function(){
   	$scope.encuestatemp.id = 0;
   	$scope.encuestatemp.strValor = '';
   	$scope.encuestatemp.res = 0;
   	$scope.encuestatemp.ValorE = 0;
   	$scope.encuestatemp.respuestas = [];
   	$scope.mensaje = 'Agregar pregunta';
   	$scope.editar = false;
   }

   $scope.saveEvaluacion = function(){
   	if(!$scope.evaluacion.strValor==''){
     if($scope.evaluacion.preguntas.length>0){
           console.log($scope.evaluacion);
          swal({
        title: 'Desea guardar la evaluacion?',
        text: 'Se guardaran la evaluacion',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "No",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function (isConfirm) {
        if (isConfirm) {
            setTimeout(function () {

            $http.post('/registrarevaluacion',$scope.evaluacion).then(function (response) {
           if (response.data) {
                            swal({
                                title: "Guardado",
                                type: "success",
                                showConfirmButton: true,
                                closeOnConfirm: false
                            }, function () {
                                window.location.href = '/inicio';
                            }
                         );

                        } else {
                            swal({
                                title: "Vaya! ha ocurrido un error",
                                text: "Causa del error: problema al interpretar los datos",
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
     	 CrearAlerta('Vaya!', 'La evaluacion debe tener minimo una pregunta', 4, 4000);
     }
   	}else{
        CrearAlerta('mmm...', 'La encuesta debe tener un nombre', 4, 4000);
   	}
   }
});