angular.module('app.login', [
  'ui.router',
  'app.authService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        //////////////
        // Login //
        //////////////
        .state('login', {

          url: '/login',

          templateUrl: 'app/login/login.tpl.html',
          
          resolve: {
            
          },

          controller: ['$scope', '$state', '$timeout','authService',
            function (  $scope,   $state,   $timeout,  authService) {
              
              angular.element("html,body").addClass('login-content');
              
              //Status
              $scope.status = {
                login: 1,
                register: 0,
                forgot: 0
              }
              
              $scope.submitForm = function ( isValid ) {
                console.log("submitForm");
                if ( isValid ) {
                  authService.login( $scope.loginData ).then( function( response ) {
                    $scope.response = response;
                    if ( !response.error ) {
                      $state.go( 'index.home' );
                    } else {
                      $timeout( function() { $scope.form.$submitted = false; }, 1300 );
                      //$scope.form.$submitted = false;
                    }
                  });
                }
              }
            }]

        })
    }
  ]
);