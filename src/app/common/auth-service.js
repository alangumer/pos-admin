angular.module('app.auth.service', [
  'ui.router',
  'LocalStorageModule',
  'app.utils.service'
])

.factory('authService', ['$http', '$q', '$location', 'localStorageService', 'utils', 'appSettings',  function ($http, $q, $location, localStorageService, utils, appSettings) {

  var auth = {};

  auth.saveToken = function(token) {
    localStorageService.set('sgt2-token', token);
  };

  auth.getToken = function() {
    return localStorageService.get('sgt2-token');
  };

  /*auth.isLoggedIn = function() {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user) {
    return $http.post('/register', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user) {
    return $http.post('/login', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function() {
    $window.localStorage.removeItem('flapper-news-token');
  };*/

  auth.saveLoginData = function ( loginData ) {
    localStorageService.set('loginData', loginData);
  };

  auth.getLoginData = function () {
    return localStorageService.get('loginData');
  };

  auth.getUserId = function () {
    return auth.getLoginData() ? auth.getLoginData().id_usuario : null;
  };

  auth.login = function (data) {
    var deferred = $q.defer();
    $http.get(appSettings.apiServiceBaseUri + 'wsHomeDMZ.asmx/login',{
      params: { strUsername: data.username, strPassword: data.password }
    }).success(function (res) {
      res = utils.xml2json(res);
      console.log("esto retorno despues de login", res);
      if ( res && res.id_usuario != 2 &&  res.usuario != "null" ) {
        auth.saveLoginData(res);
        deferred.resolve(res);
      } else {
        deferred.resolve({'error': 'Usuario invalido'});
      }
    }).error(function( error ) {
      deferred.reject( error );
    });
    return deferred.promise;
  };

  auth.logOut = function () {
    localStorageService.remove('loginData');
  };

  auth.isLoggedIn = function () {
    return auth.getLoginData() ? true : false;
  };

  auth.loginPermission = function ( data ) {
    var deferred = $q.defer();
    $http.get(appSettings.apiServiceBaseUri + 'wsHomeDMZ.asmx/login',{
      params: { strUsername: data.username, strPassword: data.password }
    }).success(function (res) {
      res = utils.xml2json(res);
      if ( res.id_usuario != 2 &&  res.usuario != "null" ) {
        deferred.resolve(res);
      } else {
        deferred.resolve({'error': 'Usuario invalido'});
      }
    }).error(function( error ) {
      deferred.reject( error );
    });
    return deferred.promise;
  };

  auth.userPermission = function ( idUsuario, opcion ) {
    var deferred = $q.defer();
    $http.get(appSettings.apiServiceBaseUri + 'wssujetosdmz.asmx/getPermisoOpcion', {
      params: { p_id_usuario: idUsuario, p_id_opcion: opcion }
    }).success(function(data){
       deferred.resolve(utils.xml2json(data));
    }).error(function( error ){
      deferred.reject( error );
    });
    return deferred.promise;
  };

  return auth;

}]);