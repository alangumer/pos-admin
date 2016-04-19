angular.module('app.stores', [
  'ui.router',
  'toastr',
  'app.storesService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.stores', {
          
          abstract: true,

          url: 'stores',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Tienda';
              
            }]

        })
        .state('index.stores.edit', {

          url: '/:id/edit',

          templateUrl: 'app/stores/stores.add.tpl.html',
          
          resolve: {
            store: ['storesService', '$stateParams',
              function ( storesService, $stateParams ){
                return storesService.get( $stateParams.id );
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'storesService', 'store',
            function (  $scope,   $state,   toastr,   storesService,   store) {
              
              $scope.data = store;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  storesService.edit( $scope.data ).then( function ( res ) {
                    toastr.success( !$state.params.id ? 'Agregado' : 'Actualizado' );
                    // $state.go( '^.list' ); 
                  });
                }
              }
              
            }]

        })
    }
  ]
);