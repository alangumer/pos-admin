angular.module('app.customers', [
  'ui.router',
  'toastr',
  'app.customers.service',
  'app.customersTypes.service'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.customers', {
          
          abstract: true,

          url: 'customers',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Cliente';
              
            }]

        })
        .state('index.customers.list', {

          url: '',

          templateUrl: 'app/customers/customers.list.tpl.html',
          
          resolve: {
            customers: ['customersService',
              function ( customersService ){
                return customersService.list();
              }]
          },

          controller: ['$scope', '$state', 'utils', 'customers',
            function (  $scope,   $state,   utils,   customers) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Cliente' },
                { field:'nit', name: 'Nit' },
                { field:'address', name: 'Direccion' },
                { field:'tel', name: 'Telefono' },
              ];
              
              $scope.gridOptions.data = customers;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              };
              
              $scope.gridOptions.onRegisterApi = function ( gridApi ) {
                gridApi.selection.on.rowSelectionChanged( $scope, function ( row ) {
                  if ( row.isSelected ) {
                    $scope.current.customer = row.entity;
                  } else {
                    $scope.current.customer = undefined;
                  }
                });
                
                gridApi.grid.registerDataChangeCallback( function () {
                  if ( $scope.current.customer ) {
                    var currentCustomer = utils.findByField( $scope.gridOptions.data, 'id', $scope.current.customer.id );
                    gridApi.selection.toggleRowSelection(
                      $scope.gridOptions.data[ $scope.gridOptions.data.indexOf( currentCustomer )]
                    );
                  }
                });
              };
            }]

        })
        .state('index.customers.add', {

          url: '/add',

          templateUrl: 'app/customers/customers.add.tpl.html',
          
          resolve: {
            customerTypes: ['customersTypesService',
              function ( customersTypesService ){
                return customersTypesService.list();
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'customersService', 'customerTypes',
            function (  $scope,   $state,   toastr,   customersService,   customerTypes) {
              
              $scope.customerTypes = customerTypes;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  customersService.add( $scope.data ).then( function ( res ) {
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
        .state('index.customers.edit', {

          url: '/:id/edit',

          templateUrl: 'app/customers/customers.add.tpl.html',
          
          resolve: {
            customer: ['customersService', '$stateParams',
              function ( customersService, $stateParams ){
                return customersService.get( $stateParams.id );
              }],
            customerTypes: ['customersTypesService',
              function ( customersTypesService ){
                return customersTypesService.list();
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'customersService', 'customer', 'customerTypes',
            function (  $scope,   $state,   toastr,   customersService,   customer,   customerTypes) {
              
              $scope.data = customer;
              $scope.customerTypes = customerTypes;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  customersService.edit( $scope.data ) .then( function ( res ) {
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