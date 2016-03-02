angular.module('app.invoice', [
  'ui.router',
  'toastr',
  'app.products.service',
  'app.invoice.service'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.invoice', {

          url: 'invoice',

          templateUrl: 'app/invoice/invoice.tpl.html',
          
          resolve: {
            products: ['productsService',
              function( productsService ) {
                return productsService.list();
              }]
          },

          controller: ['$scope', 'invoiceService', 'products', 'toastr',
            function (  $scope,   invoiceService,   products,   toastr) {
              
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Producto' },
                { field:'price', name: 'Precio' }
              ];
              
              $scope.gridOptions.data = products;
              
              $scope.onClickRow = function( row ) {
                console.log("row",row);
              }
              
              $scope.products = products;
              $scope.currentDate = new Date();
              
              var invoiceItemModel = { quantity: 1, total: 0 };
              
              $scope.deleteItem = function ( item ) {
                $scope.invoiceItems.splice( $scope.invoiceItems.indexOf( item ), 1 );
              };
              
              $scope.addItem = function () {
                $scope.invoiceItems.push( angular.copy( invoiceItemModel ) );
              };
              
              $scope.getTotal = function ( item ) {
                if ( item.product ){
                  return isNaN(item.quantity * item.product.price) ? 0 : item.quantity * item.product.price;
                }
                return 0;
              };
              
              $scope.getGrandTotal = function () {
                var grandTotal = 0;
                for( var i =0; i < $scope.invoiceItems.length; i++ ) {
                  console.log("$scope.invoiceItems[i]",$scope.invoiceItems[i]);
                  if ( $scope.invoiceItems[i].product && !isNaN( $scope.invoiceItems[i].total ) ) {
                    grandTotal += $scope.invoiceItems[i].total
                  }
                }
                return grandTotal;
              };
              
              $scope.invoiceItems = [];
              $scope.addItem();
            }]

        })
    }
  ]
);