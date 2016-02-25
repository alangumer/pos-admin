angular.module('app.products', [
  'ui.router',
  'toastr',
  'app.products.service',
  'app.categories.service'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.products', {
          
          abstract: true,

          url: 'products',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Producto';
              
            }]

        })
        .state('index.products.list', {

          url: '',

          templateUrl: 'app/products/products.list.tpl.html',
          
          resolve: {
            products: ['productsService',
              function ( productsService ){
                return productsService.list();
              }]
          },

          controller: ['$scope', '$state', 'products',
            function (  $scope,   $state,   products) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Producto' },
                { field:'stock', name: 'Stock' },
                { field:'minimum_amount', name: 'Cantidad minima' },
                { field:'category_name', name: 'Categoria' },
                { field:'price', name: 'Precio' }
              ];
              
              $scope.gridOptions.data = products;
              
              $scope.editRow = function ( row ) {
                $state.go('^.edit',{ id: row.id });
              }
              
            }]

        })
        .state('index.products.add', {

          url: '/add',

          templateUrl: 'app/products/products.add.tpl.html',
          
          resolve: {
            categories: ['categoriesService',
              function ( categoriesService ){
                return categoriesService.list();
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'productsService', 'categories',
            function (  $scope,   $state,   toastr,   productsService,   categories) {
              
              $scope.categories = categories;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  productsService.add( $scope.data ).then( function ( res ) {
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
        .state('index.products.edit', {

          url: '/:id/edit',

          templateUrl: 'app/products/products.add.tpl.html',
          
          resolve: {
            product: ['productsService', '$stateParams',
              function ( productsService, $stateParams ){
                return productsService.get( $stateParams.id );
              }],
            categories: ['categoriesService',
              function ( categoriesService ){
                return categoriesService.list();
              }]
          },

          controller: ['$scope', '$state', 'toastr', 'productsService', 'product', 'categories',
            function (  $scope,   $state,   toastr,   productsService,   product,   categories) {
              
              $scope.data = product;
              $scope.categories = categories;
              
              $scope.submitForm = function ( isValid ) {
                if ( isValid ) {
                  productsService.edit( $scope.data ) .then( function ( res ) {
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