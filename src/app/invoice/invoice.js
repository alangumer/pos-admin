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
              
              // grid products
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Producto' },
                { field:'price', name: 'Precio' }
              ];
              
              $scope.gridOptions.data = products;
              
              // invoice items
              $scope.invoiceItems = [];
              
              $scope.onClickRow = function( row ) {
                addItem( row );
              };
              
              $scope.calculatorOptions = {
                quantity: false,
                discount: false,
                price: false,
              };
              
              $scope.calculatorOptionsMaster = angular.copy( $scope.calculatorOptions );
              
              
              $scope.setOptionSelected = function( option ) {
                $scope.calculatorOptions = angular.copy( $scope.calculatorOptionsMaster );
                $scope.calculatorOptions[ option ] = true;
              }
              
              $scope.products = products;
              $scope.currentDate = new Date();
              
              $scope.deleteItem = function ( item ) {
                $scope.invoiceItems.splice( $scope.invoiceItems.indexOf( item ), 1 );
              };
              
              var addItem = function ( item ) {
                item.quantity = 1;
                $scope.invoiceItems.push( item );
                console.log("item added",item);
              };
              
              $scope.getTotal = function ( item ) {
                return isNaN(item.quantity * item.price) ? 0 : item.quantity * item.price;
              };
              
              $scope.getGrandTotal = function () {
                var grandTotal = 0;
                for( var i =0; i < $scope.invoiceItems.length; i++ ) {
                  console.log("$scope.invoiceItems[i]",$scope.invoiceItems[i]);
                  if ( !isNaN( $scope.invoiceItems[i].total ) ) {
                    grandTotal += $scope.invoiceItems[i].total
                  }
                }
                return grandTotal;
              };
            }]

        })
    }
  ]
);