angular.module('app.categories', [
  'ui.router',
  'toastr',
  'app.categoriesService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.categories', {
          
          abstract: true,

          url: 'categories',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Categoria';
              
            }]

        })
        .state('index.categories.list', {

          url: '',

          templateUrl: 'app/categories/categories.list.tpl.html',
          
          resolve: {
            categories: ['categoriesService',
              function ( categoriesService ){
                return categoriesService.list();
              }]
          },

          controller: ['$scope', '$state', 'categories',
            function (  $scope,   $state,   categories) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Categoria' },
              ];
              
              $scope.gridOptions.data = categories;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              }
              
            }]

        })
        .state('index.categories.add', {

          url: '/add',

          templateUrl: 'app/categories/categories.add.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'categoriesService',
            function (  $scope,   $state,   toastr,   categoriesService) {
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  categoriesService.add( $scope.data ).then( function ( res ) {
                    toastr.success( 'Agregado' );
                    $state.go( '^.list' );
                  });
                }
              }
              
            }]

        })
        .state('index.categories.edit', {

          url: '/:id/edit',

          templateUrl: 'app/categories/categories.add.tpl.html',
          
          resolve: {
            category: ['categoriesService', '$stateParams',
              function ( categoriesService, $stateParams ){
                return categoriesService.get( $stateParams.id );
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'categoriesService', 'category',
            function (  $scope,   $state,   toastr,   categoriesService,   category) {
              
              $scope.data = category;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  categoriesService.edit( $scope.data ).then( function ( res ) {
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