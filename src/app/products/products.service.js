angular.module('app.productsService', [

])

.factory('productsService', ['$http', '$q', 'appSettings',  function ( $http, $q, appSettings ) {

  return {
    list: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'products' ).success( function ( res ) {
        deferred.resolve( res );
      }).error(function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
    add: function ( data ) {
      var deferred = $q.defer();
      $http.post( appSettings.restApiServiceBaseUri + 'products/add', data ).success( function ( res ) {
        deferred.resolve( res );
      }).error( function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
    edit: function ( data ) {
      var deferred = $q.defer();
      $http.put( appSettings.restApiServiceBaseUri + 'products/edit', data ).success( function ( res ) {
        deferred.resolve( res );
      }).error( function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
    get: function ( id ) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'products/' + id ).success( function ( res ) {
        deferred.resolve( res );
      }).error( function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
  }
  
}]);