angular.module('app.invoices', [
  'ui.router',
  'toastr',
  'app.productsService',
  'app.invoicesService'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.invoices', {
          
          abstract: true,

          url: 'invoices',

          template: '<div ui-view></div>',
          
          resolve: {
            products: ['productsService',
              function( productsService ) {
                return productsService.list();
              }]
          },

          controller: ['$scope', 'products',
            function (  $scope,   products) {
              
              $scope.module = 'Factura';
              
              // grid products
              $scope.gridOptions = angular.copy( $scope.gridOptionsSingleSelection );
              $scope.gridOptions.columnDefs = [
                { field:'name', name: 'Producto' },
                { field:'price', name: 'Precio' }
              ];
              
              $scope.gridOptions.data = products;
              $scope.gridOptions.noUnselect = true;
              
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
              
              $scope.getPaymentTotal = function() {
                var totalPayment = 0;
                for ( i = 0; i < $scope.current.invoice.payments.length; i++ ) {
                  totalPayment += $scope.current.invoice.payments[i].tendered;
                }
                return totalPayment;
              };
              
            }]

        })
        .state('index.invoices.input', {

          url: '',

          templateUrl: 'app/invoices/invoices.tpl.html',
          
          resolve: {
            
          },

          controller: ['$scope', 'toastr', 'utils',
            function (  $scope,   toastr,   utils) {
              
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
              
              $scope.getTotal = function ( item ) {
                var total = item.quantity * item.price;
                return ( isNaN( total ) ? 0 :
                  ( total ) - ( total * ( isNaN ( item.discount ) ? 0 : item.discount / 100 ) ) ).toFixed(2);
              };
            }]

        })
        .state('index.invoices.payment', {

          url: '/payment',

          templateUrl: 'app/invoices/invoices.payment.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'utils', 'invoicesService',
            function (  $scope,   $state,   toastr,   utils,   invoicesService) {
              
              console.log('current item',$scope.current.invoice.item);
              
              $scope.addPayment = function () {
                $scope.current.invoice.payment = {
                  due: null,
                  tenderedString: '',
                  tendered: 0.00,
                  change: '',
                  method: 'Efectivo'
                };
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
                // if no payment add one payment
                if ( !$scope.current.invoice.payment || !$scope.current.invoice.payment.correlative ) {
                  $scope.addPayment();
                }
                
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
                calculatePaymentRow();
              };
              
              $scope.substractNumber = function () {
                $scope.current.invoice.payment.tenderedString = $scope.current.invoice.payment.tenderedString.substr(0, $scope.current.invoice.payment.tenderedString.length - 1 );
                $scope.current.invoice.payment.tendered = utils.parseValue( $scope.current.invoice.payment.tenderedString, 2 );
                calculatePaymentRow();
              };
              
              var calculatePaymentRow = function () {
                var due = parseFloat ( $scope.getGrandTotal(), 10 );
                var change = 0;
                for ( i = 0; i < $scope.current.invoice.payments.length; i++ ) {
                  $scope.current.invoice.payments[i].due = due > 0 ? due : 0;
                  due -= $scope.current.invoice.payments[i].tendered;
                  
                  // change
                  change = ($scope.current.invoice.payments[i].tendered - $scope.current.invoice.payments[i].due).toFixed(2);
                  $scope.current.invoice.payments[i].change = change > 0 ? change : '';
                }
                $scope.current.invoice.credit = due;
              };
              
              calculatePaymentRow();
              
              $scope.isValidPayment = function() {
                return $scope.applyCredit || $scope.getPaymentTotal() >= parseFloat( $scope.getGrandTotal(), 10 );
              };
              
              $scope.validatePayment = function () {
                if ( $scope.current.invoice.items.length ) {
                  if ( $scope.current.customer ) {
                    if ( parseFloat( $scope.getGrandTotal(), 10 ) === 0 ) {
                      if (  $scope.getPaymentTotal() > 0 ) {
                        swal({
                          title: "Esta seguro que el cliente quiere pagar Q " + $scope.getPaymentTotal() + " por una orden de Q 0.00?",
                          type: "warning",
                          showCancelButton: true,
                        }, function() {
                          validPayment();
                        });
                      } else {
                        validPayment();
                      }
                    } else {
                      validPayment();
                    }
                  } else {
                    swal({
                      title: "Por favor seleccione el cliente",
                      text: "Necesita seleccionar un cliente antes que pueda facturar una orden.",
                      type: "warning",
                      showCancelButton: true,
                    }, function() {
                      $state.go( 'index.customers.list', { stateToGo: 'index.invoices.payment' } );
                    });
                  }
                } else {
                  toastr.warning( 'Debe haber por lo menos un producto en la orden antes que pueda ser validado.' );
                }
              };
              
              var validPayment =  function () {
                var invoice = {
                  customerId: $scope.current.customer.id,
                  items: $scope.current.invoice.items,
                  payment: $scope.getPaymentTotal()
                };
                
                console.log();
                invoicesService.add( invoice ).then( function ( res ) {
                  toastr.success( 'Factura ingresada' );
                  $state.go( '^.receipt' );
                });
              }
              
            }]

        })
        .state('index.invoices.receipt', {

          url: '/receipt',

          templateUrl: 'app/invoices/invoices.receipt.tpl.html',
          
          resolve: {
          },

          controller: ['$scope', '$state', 'toastr', 'utils',
            function (  $scope,   $state,   toastr,   utils) {
              
              /*$scope.invoiceItems = [{"id":"4","name":"Producto 4","status":"1","stock":"1000","minimum_amount":"65","category_id":"2","price":"120.00","category_name":"Categoria B","quantity":1,"quantityString":"","discountString":"","priceString":"","correlative":1,"total":"120.00"},{"id":"3","name":"Producto 3","status":"1","stock":"878","minimum_amount":"12","category_id":"1","price":"235.00","category_name":"Categoria A","quantity":1,"quantityString":"","discountString":"","priceString":"","correlative":2,"total":"235.00"},{"id":"2","name":"Producto 2","status":"1","stock":"2000","minimum_amount":"78","category_id":"2","price":"989.00","category_name":"Categoria B","quantity":5,"quantityString":"5","discountString":"","priceString":"","correlative":3,"total":"4697.75","discount":5}];
              
              $scope.current.invoice.items = $scope.invoiceItems;*/

              $scope.currentDate = new Date();
              $scope.credit = $scope.current.invoice.credit ? $scope.current.invoice.credit : 0;
              $scope.paymentTotal = $scope.getPaymentTotal().toFixed(2);
              $scope.subtotal = $scope.getGrandTotal();
              $scope.change = ( ( parseFloat( $scope.paymentTotal, 10 ) + $scope.credit ) - parseFloat( $scope.subtotal, 10 ) ).toFixed(2);
              $scope.invoiceItems = $scope.current.invoice.items;
              $scope.credit = $scope.credit.toFixed(2);
              
              var getDiscountTotal = function() {
                var discount = 0;
                for( var i =0; i < $scope.current.invoice.items.length; i++ ) {
                  if ( !isNaN( $scope.current.invoice.items[i].discount ) ) {
                    console.log('$scope.current.invoice.items[i].discount', parseFloat( $scope.current.invoice.items[i].discount, 10 ));
                    discount += parseFloat( $scope.current.invoice.items[i].discount, 10 );
                  }
                }
                return discount.toFixed(2);
              };
              
              console.log('invoiceItems', angular.toJson($scope.current.invoice.items) );
              
              $scope.discountTotal = getDiscountTotal();
              
              $scope.current = angular.copy( angular.currentMaster );
              
              $scope.printReceipt = function() {
                utils.openWindow( '#receipt', $scope, 'Recibo' );
              };
              
            }]

        })
    }
  ]
);