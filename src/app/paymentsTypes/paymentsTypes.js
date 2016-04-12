angular.module('app.paymentsTypes', [
  'ui.router',
  'toastr',
  'app.paymentsTypes.service'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.paymentsTypes', {
          
          abstract: true,

          url: 'paymentsTypes',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Tipo de Pago';
              
            }]

        })
        .state('index.paymentsTypes.list', {

          url: '',

          templateUrl: 'app/paymentsTypes/paymentsTypes.list.tpl.html',
          
          resolve: {
            paymentsTypes: ['paymentsTypesService',
              function ( paymentsTypesService ){
                return paymentsTypesService.list();
              }]
          },

          controller: ['$scope', '$state', 'paymentsTypes',
            function (  $scope,   $state,   paymentsTypes) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Tipo' }
              ];
              
              $scope.gridOptions.data = paymentsTypes;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              }
              
            }]

        })
        .state('index.paymentsTypes.add', {

          url: '/add',

          templateUrl: 'app/paymentsTypes/paymentsTypes.add.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'paymentsTypesService',
            function (  $scope,   $state,   toastr,   paymentsTypesService) {
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  paymentsTypesService.add( $scope.data ).then( function ( res ) {
                    if ( res.status == "OK" ) {
                      toastr.success( 'Agregado' );
                      $state.go( '^.list' );
                    } else {
                      toastr.error( res.status );
                    }
                  }, function ( error ) {
                    toastr.error( error );
                  });
                }
              }
              
            }]

        })
        .state('index.paymentsTypes.edit', {

          url: '/:id/edit',

          templateUrl: 'app/paymentsTypes/paymentsTypes.add.tpl.html',
          
          resolve: {
            paymentType: ['paymentsTypesService', '$stateParams',
              function ( paymentsTypesService, $stateParams ){
                return paymentsTypesService.get( $stateParams.id );
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'paymentsTypesService', 'paymentType',
            function (  $scope,   $state,   toastr,   paymentsTypesService,   paymentType) {
              
              $scope.data = paymentType;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  paymentsTypesService.edit( $scope.data ) .then( function ( res ) {
                    if ( res.status == "OK" ) {
                      toastr.success( !$state.params.id ? 'Agregado' : 'Actualizado' );
                      $state.go( '^.list' );
                    } else {
                      toastr.error( res.status );
                    }
                  }, function ( error ) {
                    toastr.error( error );
                  });
                }
              }
              
            }]

        })
    }
  ]
);