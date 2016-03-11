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
              
              // current item
              $scope.currentItem = {};
              
              $scope.calculatorOptions = {
                quantity: false,
                discount: false,
                price: false,
              };
              
              $scope.calculatorOptionsMaster = angular.copy( $scope.calculatorOptions );
              
              var multiplicator = 1;
              
              $scope.setOptionSelected = function( option ) {
                $scope.calculatorOptions = angular.copy( $scope.calculatorOptionsMaster );
                $scope.calculatorOptions[ option ] = true;
                multiplicator = 0;
              };
              
              $scope.setOptionSelected( 'quantity' );
              
              $scope.calculate = function( number ) {
                console.log('calculate');
                if ( $scope.currentItem.id ) {
                  
                  if ( $scope.calculatorOptions.quantity ) {
                    $scope.currentItem.quantity = $scope.currentItem.quantity * 10 * multiplicator + number;
                  } else if ($scope.calculatorOptions.discount ) {
                    $scope.currentItem.discount = $scope.currentItem.quantity * 10 * multiplicator + number;
                  } else {
                    $scope.currentItem.price = $scope.currentItem.quantity * 10 * multiplicator + number;
                  }
                  
                  if ( !multiplicator ){
                    multiplicator = 1;
                  }
                }
              };
              
              $scope.onClickRow = function( row ) {
                addItem( row );
              };
              
              var addItem = function ( item ) {
                console.log("item added",item);
                if ( item.id == $scope.currentItem.id ) {
                  $scope.currentItem.quantity += 1;
                } else {
                  $scope.setOptionSelected( 'quantity' );
                  $scope.currentItem = angular.copy( item );
                  $scope.currentItem.quantity = 1;
                  $scope.currentItem.correlative = $scope.invoiceItems.length + 1;
                  $scope.invoiceItems.push( $scope.currentItem );
                }
              };
              
              $scope.deleteItem = function ( item ) {
                $scope.invoiceItems.splice( $scope.invoiceItems.indexOf( item ), 1 );
              };
              
              $scope.setCurrentItem = function ( item ) {
                $scope.currentItem = item;
              };
              
              $scope.products = products;
              $scope.currentDate = new Date();
              
              $scope.getTotal = function ( item ) {
                return isNaN(item.quantity * item.price) ? 0 : item.quantity * item.price;
              };
              
              $scope.getGrandTotal = function () {
                var grandTotal = 0;
                for( var i =0; i < $scope.invoiceItems.length; i++ ) {
                  console.log("$scope.invoiceItems[i]",$scope.invoiceItems[i]);
                  if ( !isNaN( $scope.invoiceItems[i].total ) ) {
                    grandTotal += $scope.invoiceItems[i].total;
                  }
                }
                return grandTotal;
              };
            }]

        })
    }
  ]
);