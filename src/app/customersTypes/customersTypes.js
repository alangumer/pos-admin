angular.module('app.customersTypes', [
  'ui.router',
  'toastr',
  'app.customersTypesService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.customersTypes', {
          
          abstract: true,

          url: 'customersTypes',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Tipo de Cliente';
              
            }]

        })
        .state('index.customersTypes.list', {

          url: '',

          templateUrl: 'app/customersTypes/customersTypes.list.tpl.html',
          
          resolve: {
            customersTypes: ['customersTypesService',
              function ( customersTypesService ){
                return customersTypesService.list();
              }]
          },

          controller: ['$scope', '$state', 'customersTypes',
            function (  $scope,   $state,   customersTypes) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Tipo' },
                { field:'credit_limit', name: 'Limite de credito' }
              ];
              
              $scope.gridOptions.data = customersTypes;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              }
              
            }]

        })
        .state('index.customersTypes.add', {

          url: '/add',

          templateUrl: 'app/customersTypes/customersTypes.add.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'customersTypesService',
            function (  $scope,   $state,   toastr,   customersTypesService) {
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  customersTypesService.add( $scope.data ).then( function ( res ) {
                    toastr.success( 'Agregado' );
                    $state.go( '^.list' );
                  });
                }
              }
              
            }]

        })
        .state('index.customersTypes.edit', {

          url: '/:id/edit',

          templateUrl: 'app/customersTypes/customersTypes.add.tpl.html',
          
          resolve: {
            customerType: ['customersTypesService', '$stateParams',
              function ( customersTypesService, $stateParams ){
                return customersTypesService.get( $stateParams.id );
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'customersTypesService', 'customerType',
            function (  $scope,   $state,   toastr,   customersTypesService,   customerType) {
              
              $scope.data = customerType;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  customersTypesService.edit( $scope.data ).then( function ( res ) {
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