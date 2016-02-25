angular.module('app.invoice.service', [

])

.factory('invoiceService', ['$http', '$q', 'appSettings',  function($http, $q, appSettings) {  

  return {
    locations: function ( val ) {
      console.log("val",val);
      var deferred = $q.defer();
      $http.get( '//maps.googleapis.com/maps/api/geocode/json',{
        params: {
          address: val,
          sensor: false
        }
      }).success(function ( res ) {
        console.log("res",res);
        deferred.resolve( res.results.map(function(item){
          return item;
        }));
        /*return res.results.map(function(item){
          return item.formatted_address;
        });*/
      }).error(function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    },
    locationsb: function ( ) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'servicio/' + id + '/algo/' + id + '/' + id + '/final' ).success(function ( res ) {
        deferred.resolve( res );
      }).error(function( error ){
        deferred.reject( error );
      });
      return deferred.promise;
    }
  }
  
}]);