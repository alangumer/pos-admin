angular.module('app.invoicesService', [

])

.factory('invoicesService', ['$http', '$q', 'appSettings',  function($http, $q, appSettings) {

  return {
    add: function ( data ) {
      var deferred = $q.defer();
      $http.post( appSettings.restApiServiceBaseUri + 'invoices/add', data ).success( function ( res ) {
        deferred.resolve( res );
      }).error( function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
  }
  
}]);