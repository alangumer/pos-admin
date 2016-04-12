angular.module('app.stores.service', [

])

.factory('storesService', ['$http', '$q', 'appSettings',  function ( $http, $q, appSettings ) {

  return {
    edit: function ( data ) {
      var deferred = $q.defer();
      $http.put( appSettings.restApiServiceBaseUri + 'stores/edit', data ).success( function ( res ) {
        deferred.resolve( res );
      }).error( function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
    get: function ( id ) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'stores/' + id ).success( function ( res ) {
        deferred.resolve( res );
      }).error( function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
  }
  
}]);