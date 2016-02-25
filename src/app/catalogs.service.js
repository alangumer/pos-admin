angular.module('app.catalogs.service', [

])

.factory('catalogsService', ['$http', '$q', 'appSettings',  function($http, $q, appSettings) {

  return {
    products: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'products' ).success(function ( res ) {
        deferred.resolve( res );
      }).error(function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
    store: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'store' ).success(function ( res ) {
        deferred.resolve( res );
      }).error(function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    }
  }
  
}]);