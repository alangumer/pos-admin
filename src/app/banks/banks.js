angular.module('app.banks', [
  'ui.router',
  'toastr',
  'app.banksService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.banks', {
          
          abstract: true,

          url: 'banks',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Banco';
              
            }]

        })
        .state('index.banks.list', {

          url: '',

          templateUrl: 'app/banks/banks.list.tpl.html',
          
          resolve: {
            banks: ['banksService',
              function ( banksService ){
                return banksService.list();
              }]
          },

          controller: ['$scope', '$state', 'banks',
            function (  $scope,   $state,   banks) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Banco' },
              ];
              
              $scope.gridOptions.data = banks;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              }
              
            }]

        })
        .state('index.banks.add', {

          url: '/add',

          templateUrl: 'app/banks/banks.add.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'banksService',
            function (  $scope,   $state,   toastr,   banksService) {
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  banksService.add( $scope.data ).then( function ( res ) {
                    toastr.success( 'Agregado' );
                    $state.go( '^.list' );
                  });
                }
              }
              
            }]

        })
        .state('index.banks.edit', {

          url: '/:id/edit',

          templateUrl: 'app/banks/banks.add.tpl.html',
          
          resolve: {
            bank: ['banksService', '$stateParams',
              function ( banksService, $stateParams ){
                return banksService.get( $stateParams.id );
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'banksService', 'bank',
            function (  $scope,   $state,   toastr,   banksService,   bank) {
              
              $scope.data = bank;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  banksService.edit( $scope.data ).then( function ( res ) {
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