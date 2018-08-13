var myApp = angular.module('registroApp', ['ngResource']);

myApp.config(['$httpProvider', function($httpProvider) {
 
  $httpProvider.defaults.transformRequest = function(data) {
    if(undefined === data) return data;
    var formData = new FormData();
    angular.forEach(data, function(value, key) {
      if(value instanceof FileList) {
        if(value.length === 1)
          formData.append(key, value[0]);
        else {
          angular.foreach(value, function(file, index) {
            formData.append(key + '_' + index, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  };
  $httpProvider.defaults.headers.post['Content-Type'] = undefined;
 
}]);

myApp.controller('registroController', function($scope, $http) {
    $scope.formdata = {};
  
    $scope.guardarDatos = function() {
        $http({
            method: 'POST',
            url: '/registrarangular',
            params: $scope.formdata
        }).
        success(function(data) {
          
        }).
        error(function() {
           
        });
    }

   
});