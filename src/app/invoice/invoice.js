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
          
          abstract: true,

          url: 'invoice',

          template: '<div ui-view></div>',
          
          resolve: {
          },

          controller: ['$scope',
            function (  $scope) {
              
              $scope.module = 'Factura';
              
              // function getGrandTotal
              $scope.getGrandTotal = function () {
                var grandTotal = 0;
                for( var i =0; i < $scope.current.invoice.items.length; i++ ) {
                  if ( !isNaN( $scope.current.invoice.items[i].total ) ) {
                    grandTotal += parseFloat( $scope.current.invoice.items[i].total, 10 );
                  }
                }
                return grandTotal.toFixed(2);
              };
              
              console.log('invoice parent');
              
            }]

        })
        .state('index.invoice.input', {

          url: '',

          templateUrl: 'app/invoice/invoice.tpl.html',
          
          resolve: {
            products: ['productsService',
              function( productsService ) {
                return productsService.list();
              }]
          },

          controller: ['$scope', 'invoiceService', 'products', 'toastr', 'utils',
            function (  $scope,   invoiceService,   products,   toastr,   utils) {
              
              console.log('current item',$scope.current.invoice.item);
              
              // grid products
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Producto' },
                { field:'price', name: 'Precio' }
              ];
              
              $scope.gridOptions.data = products;
              
              $scope.gridOptions.noUnselect = true;
              
              // calculator options
              $scope.calculatorOptions = {
                quantity: false,
                discount: false,
                price: false,
              };
              
              $scope.calculatorOptionsMaster = angular.copy( $scope.calculatorOptions );
              
              $scope.setOptionSelected = function( option ) {
                $scope.calculatorOptions = angular.copy( $scope.calculatorOptionsMaster );
                $scope.calculatorOptions[ option ] = true;
                $scope.current.invoice.item.quantityString = '';
                $scope.current.invoice.item.discountString = '';
                $scope.current.invoice.item.priceString = '';
              };
              
              // set default option selected quantity
              $scope.setOptionSelected( 'quantity' );
              
              $scope.calculate = function( val ) {
                if ( $scope.current.invoice.item.id ) {
                  if ( $scope.calculatorOptions.quantity ) {
                    if ( val === '.' && $scope.current.invoice.item.quantityString.indexOf('.') > -1 ) {
                      return;
                    }
                    $scope.current.invoice.item.quantityString += val.toString();
                    $scope.current.invoice.item.quantity = utils.parseValue( $scope.current.invoice.item.quantityString, 3 );
                  } else if ($scope.calculatorOptions.discount ) {
                    if ( val === '.' && $scope.current.invoice.item.discountString.indexOf('.') > -1 ) {
                      return;
                    }
                    $scope.current.invoice.item.discountString += val.toString();
                    $scope.current.invoice.item.discount = parseDiscount( $scope.current.invoice.item.discountString );
                  } else if ($scope.calculatorOptions.price ) {
                    if ( val === '.' && $scope.current.invoice.item.priceString.indexOf('.') > -1 ) {
                      return;
                    }
                    $scope.current.invoice.item.priceString += val.toString();
                    $scope.current.invoice.item.price = utils.parseValue( $scope.current.invoice.item.priceString, 2 );
                  }
                }
              };
              
              $scope.substractNumber = function() {
                console.log('substractnumber');
                if ( $scope.current.invoice.item.id ) {
                  if ( $scope.calculatorOptions.quantity ) {
                    if ( $scope.current.invoice.item.quantity === 0 ) {
                      $scope.current.invoice.items.splice( $scope.current.invoice.items.indexOf( $scope.current.invoice.item ), 1 );
                      $scope.current.invoice.item = {};
                      return;
                    }
                    $scope.current.invoice.item.quantityString = $scope.current.invoice.item.quantityString.substr(0, $scope.current.invoice.item.quantityString.length - 1 );
                    $scope.current.invoice.item.quantity = utils.parseValue( $scope.current.invoice.item.quantityString, 3 );
                  } else if ($scope.calculatorOptions.discount ) {
                    $scope.current.invoice.item.discountString = $scope.current.invoice.item.discountString.substr(0, $scope.current.invoice.item.discountString.length - 1 );
                    $scope.current.invoice.item.discount = parseDiscount( $scope.current.invoice.item.discountString );
                  } else if ($scope.calculatorOptions.price ) {
                    $scope.current.invoice.item.priceString = $scope.current.invoice.item.priceString.substr(0, $scope.current.invoice.item.priceString.length - 1 );
                    $scope.current.invoice.item.price = utils.parseValue( $scope.current.invoice.item.priceString, 2 );
                  }
                }
              };
              
              var parseDiscount = function( discountString ) {
                return parseFloat( discountString, 10 ) > 100 ? 100 : parseFloat( discountString, 10 );
              };
              
              $scope.onClickRow = function( row ) {
                addItem( row );
              };
              
              var addItem = function ( item ) {
                console.log("item added",item);
                if ( item.id == $scope.current.invoice.item.id ) {
                  $scope.current.invoice.item.quantity += 1;
                } else {
                  $scope.setOptionSelected( 'quantity' );
                  $scope.current.invoice.item = angular.copy( item );
                  $scope.current.invoice.item.quantity = 1;
                  $scope.current.invoice.item.quantityString = '';
                  $scope.current.invoice.item.discountString = '';
                  $scope.current.invoice.item.priceString = '';
                  $scope.current.invoice.item.correlative = $scope.current.invoice.items.length + 1;
                  $scope.current.invoice.items.push( $scope.current.invoice.item );
                }
              };
              
              $scope.deleteItem = function ( item ) {
                $scope.current.invoice.items.splice( $scope.current.invoice.items.indexOf( item ), 1 );
              };
              
              $scope.setCurrentItem = function ( item ) {
                console.log('set current item');
                $scope.current.invoice.item = item;
              };
              
              $scope.products = products;
              
              $scope.getTotal = function ( item ) {
                var total = item.quantity * item.price;
                return ( isNaN( total ) ? 0 :
                  ( total ) - ( total * ( isNaN ( item.discount ) ? 0 : item.discount / 100 ) ) ).toFixed(2);
              };
            }]

        })
        .state('index.invoice.payment', {

          url: '/payment',

          templateUrl: 'app/invoice/invoice.payment.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'utils',
            function (  $scope,   $state,   toastr,   utils) {
              
              console.log('current item',$scope.current.invoice.item);
              
              $scope.addPayment = function () {
                $scope.current.invoice.payment = { due: null, tenderedString: '', tendered: 0.00, change: '', method: 'Efectivo' };
                $scope.current.invoice.payment.correlative = $scope.current.invoice.payments.length + 1;
                $scope.current.invoice.payments.push( $scope.current.invoice.payment );
                calculatePaymentRow();
              };
              
              $scope.deletePayment = function ( item ) {
                $scope.current.invoice.payments.splice( $scope.current.invoice.payments.indexOf( item ), 1 );
                calculatePaymentRow();
              };
              
              $scope.setCurrentPayment = function ( item ) {
                $scope.current.invoice.payment = item;
                $scope.current.invoice.payment.tenderedString = '';
              };
              
              $scope.calculate = function ( val ) {
                console.log('calculate',$scope.current.invoice.payment);
                if ( val === '.' && $scope.current.invoice.payment.tenderedString.indexOf('.') > -1 ) {
                  return;
                }
                $scope.current.invoice.payment.tenderedString += val.toString();
                $scope.current.invoice.payment.tendered = utils.parseValue( $scope.current.invoice.payment.tenderedString, 2 );
                calculatePaymentRow();
              };
              
              $scope.addAmount = function ( val ) {
                $scope.current.invoice.payment.tenderedString = ( utils.parseValue( $scope.current.invoice.payment.tenderedString, 2 ) + val ).toString();
                $scope.current.invoice.payment.tendered = utils.parseValue( $scope.current.invoice.payment.tenderedString, 2 );
              };
              
              $scope.substractNumber = function () {
                $scope.current.invoice.payment.tenderedString = $scope.current.invoice.payment.tenderedString.substr(0, $scope.current.invoice.payment.tenderedString.length - 1 );
                $scope.current.invoice.payment.tendered = utils.parseValue( $scope.current.invoice.payment.tenderedString, 2 );
              };
              
              var calculatePaymentRow = function () {
                var due = parseFloat ( $scope.getGrandTotal(), 10 );
                var change = 0;
                for ( i = 0; i < $scope.current.invoice.payments.length; i++ ) {
                  $scope.current.invoice.payments[i].due = due > 0 ? due : 0;
                  due -= $scope.current.invoice.payments[i].tendered;
                  
                  // change
                  change = $scope.current.invoice.payments[i].tendered - $scope.current.invoice.payments[i].due;
                  $scope.current.invoice.payments[i].change = change > 0 ? change : '';
                }
              };
              
              calculatePaymentRow();
              
              var getTotalPayment = function() {
                var totalPayment = 0;
                for ( i = 0; i < $scope.current.invoice.payments.length; i++ ) {
                  totalPayment += $scope.current.invoice.payments[i].tendered;
                }
                return totalPayment;
              };
              
              $scope.isValidPayment = function() {
                console.log('parseFloat( $scope.getGrandTotal(), 10 )',getTotalPayment(),parseFloat( $scope.getGrandTotal(), 10 ));
                return getTotalPayment() >= parseFloat( $scope.getGrandTotal(), 10 );
              };
              
              $scope.validatePayment = function () {
                if ( $scope.current.invoice.items.length ) {
                  if ( parseFloat( $scope.getGrandTotal(), 10 ) === 0 ) {
                    if (  getTotalPayment() > 0 ) {
                      if ( confirm( 'Esta seguro que el cliente quiere pagar ' + getTotalPayment() + ' por una orden de Q 0.00?' ) ) {
                        toastr.success( 'validado' );
                      }
                    } else {
                      toastr.success( 'validado' );
                    }
                  } else {
                    toastr.success( 'validado' );
                  }
                } else {
                  toastr.warning( 'Debe haber por lo menos un producto en la orden antes que pueda ser validado.' );
                }
              };
              
            }]

        })
        .state('index.invoice.receipt', {

          url: '/receipt',

          templateUrl: 'app/invoice/invoice.receipt.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'utils',
            function (  $scope,   $state,   toastr,   utils) {
              
            }]

        })
    }
  ]
);