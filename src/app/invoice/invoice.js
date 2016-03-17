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
              
              console.log('current.customer',$scope.current.customer);
              
              $scope.setOptionSelected = function( option ) {
                $scope.calculatorOptions = angular.copy( $scope.calculatorOptionsMaster );
                $scope.calculatorOptions[ option ] = true;
                $scope.currentItem.quantityString = '';
                $scope.currentItem.discountString = '';
                $scope.currentItem.priceString = '';
              };
              
              $scope.setOptionSelected( 'quantity' );
              
              $scope.calculate = function( val ) {
                console.log('calculate',$scope.currentItem);
                if ( $scope.currentItem.id ) {
                  if ( $scope.calculatorOptions.quantity ) {
                    if ( val === '.' && $scope.currentItem.quantityString.indexOf('.') > -1 ) {
                      return;
                    }
                    $scope.currentItem.quantityString += val.toString();
                    $scope.currentItem.quantity = parseValue( $scope.currentItem.quantityString, 3 );
                  } else if ($scope.calculatorOptions.discount ) {
                    if ( val === '.' && $scope.currentItem.discountString.indexOf('.') > -1 ) {
                      return;
                    }
                    $scope.currentItem.discountString += val.toString();
                    $scope.currentItem.discount = parseDiscount( $scope.currentItem.discountString );
                  } else if ($scope.calculatorOptions.price ) {
                    if ( val === '.' && $scope.currentItem.priceString.indexOf('.') > -1 ) {
                      return;
                    }
                    $scope.currentItem.priceString += val.toString();
                    $scope.currentItem.price = parseValue( $scope.currentItem.priceString, 2 );
                  }
                }
              };
              
              $scope.substractNumber = function() {
                if ( $scope.currentItem.id ) {
                  if ( $scope.calculatorOptions.quantity ) {
                    if ( $scope.currentItem.quantity === 0 ) {
                      $scope.invoiceItems.splice( $scope.invoiceItems.indexOf( $scope.currentItem ), 1 );
                      $scope.currentItem = {};
                      return;
                    }
                    $scope.currentItem.quantityString = parseValue( parseInt( $scope.currentItem.quantity / 10 ), 3 ).toString();
                    $scope.currentItem.quantity = parseValue( $scope.currentItem.quantityString, 3 );
                  } else if ($scope.calculatorOptions.discount ) {
                    $scope.currentItem.discountString = $scope.currentItem.discountString.substr(0, $scope.currentItem.discountString.length - 1 );
                    $scope.currentItem.discount = parseDiscount( $scope.currentItem.discountString );
                  } else if ($scope.calculatorOptions.price ) {
                    $scope.currentItem.priceString = $scope.currentItem.priceString.substr(0, $scope.currentItem.priceString.length - 1 );
                    $scope.currentItem.price = parseValue( $scope.currentItem.priceString, 2 );
                  }
                }
              };
              
              var parseValue = function( str, fixed ) {
                var value = parseFloat( str, 10 );
                return isNaN( value ) ? 0 : parseFloat( value.toFixed( fixed ), 10 );
              };
              
              var parseDiscount = function( discountString ) {
                return parseFloat( discountString, 10 ) > 100 ? 100 : parseFloat( discountString, 10 );
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
                  $scope.currentItem.quantityString = '';
                  $scope.currentItem.discountString = '';
                  $scope.currentItem.priceString = '';
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
                var total = item.quantity * item.price;
                return ( isNaN( total ) ? 0 :
                  ( total ) - ( total * ( isNaN ( item.discount ) ? 0 : item.discount / 100 ) ) ).toFixed(2);
              };
              
              $scope.getGrandTotal = function () {
                var grandTotal = 0;
                for( var i =0; i < $scope.invoiceItems.length; i++ ) {
                  if ( !isNaN( $scope.invoiceItems[i].total ) ) {
                    grandTotal += parseFloat( $scope.invoiceItems[i].total, 10 );
                  }
                }
                return grandTotal.toFixed(2);
              };
            }]

        })
    }
  ]
);