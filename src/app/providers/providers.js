angular.module('app.providers', [
  'ui.router',
  'toastr',
  'app.providersService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.providers', {
          
          abstract: true,

          url: 'providers',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Proveedor';
              
            }]

        })
        .state('index.providers.list', {

          url: '',

          templateUrl: 'app/providers/providers.list.tpl.html',
          
          resolve: {
            providers: ['providersService',
              function ( providersService ){
                return providersService.list();
              }]
          },

          controller: ['$scope', '$state', 'providers',
            function (  $scope,   $state,   providers) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Proveedor' },
                { field:'nit', name: 'Nit' },
                { field:'address', name: 'Direccion' },
                { field:'tel', name: 'Telefono' },
              ];
              
              $scope.gridOptions.data = providers;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              }
              
            }]

        })
        .state('index.providers.add', {

          url: '/add',

          templateUrl: 'app/providers/providers.add.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'providersService',
            function (  $scope,   $state,   toastr,   providersService) {
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  providersService.add( $scope.data ).then( function ( res ) {
                    toastr.success( 'Agregado' );
                    $state.go( '^.list' );
                  });
                }
              }
              
            }]

        })
        .state('index.providers.edit', {

          url: '/:id/edit',

          templateUrl: 'app/providers/providers.add.tpl.html',
          
          resolve: {
            provider: ['providersService', '$stateParams',
              function ( providersService, $stateParams ){
                return providersService.get( $stateParams.id );
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'providersService', 'provider',
            function (  $scope,   $state,   toastr,   providersService,   provider) {
              
              $scope.data = provider;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  providersService.edit( $scope.data ).then( function ( res ) {
                    toastr.success( !$state.params.id ? 'Agregado' : 'Actualizado' );
                    $state.go( '^.list' );
                  });
                }
              }
              
            }]

        })
    }
  ]
);