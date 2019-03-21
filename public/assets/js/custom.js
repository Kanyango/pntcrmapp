$.fn.extend({
    treed: function (o) {
      var openedClass = 'fa-minus-circle';
      var closedClass = 'fa-plus-circle';

      if (typeof o != 'undefined'){
        if (typeof o.openedClass != 'undefined'){
        openedClass = o.openedClass;
        }
        if (typeof o.closedClass != 'undefined'){
        closedClass = o.closedClass;
        }
      };

        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator fa " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamically added icon
      tree.find('.branch .indicator').each(function(){
        $(this).on('click', function () {
            $(this).closest('li').click();
        });
      });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});
// var doc = new jsPDF();
// var specialElementHandlers = {
//     '#editor': function (element, renderer) {
//         return true;
//     }
// };
//
// $('#pt-pdf').click(function () {
//     doc.fromHTML($('#pdf-content').html(), 15, 15, {
//         'width': 170,
//             'elementHandlers': specialElementHandlers
//     });
//     doc.save('sample-file.pdf');
// });
$(document).ready(function() {
  $('#tree1').treed();
    $('.data-tables').DataTable({aaSorting : [[0, 'desc']]});
    $('.data-tables-n').DataTable();
    $('.data-tables-select').DataTable({
        initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var select = $('<select style="width: 100%;><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    } );
    $('.selectpicker').selectpicker();
    $('.multiselect').multiselect();
    $('#datetimepicker').datetimepicker({
        format: 'dd-mm-yyyy hh:ii'
    });
    $('#inquiry-status').on('change', function() {
      var status =$('select[name="inquiry-status"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                location.reload(true);
              }
          }
      }
      var sent = "id="+id+"&status="+status;
      xhr.open('POST', '/inquiry/inquiry_status/');
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(sent);
    });
    $('#blog-status').on('change', function() {
      var status =$('select[name="blog-status"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                location.reload(true);
              }
          }
      }
      var sent = "id="+id+"&status="+status;
      xhr.open('POST', '/blog/blog_status/');
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(sent);
    });
    $('#sale-status').on('change', function() {
      var status =$('select[name="sale-status"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                if(status == 'Shipped' ){
                  jQuery.noConflict();
                  $('#shipped-Modal').modal('show');
                } else {
                  location.reload(true);
                }
              }
          }
      }
      var sent = "id="+id+"&status="+status;
      xhr.open('POST', '/sale/sale_status/'+id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(sent);
    });
    $('#saleweb-status').on('change', function() {
      var status =$('select[name="saleweb-status"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                  jQuery.noConflict();
                  window.open('/sale/view/'+xhr.responseText)
              }
          }
      }
      var sent = "id="+id+"&status="+status;
      xhr.open('POST', '/sale/saleweb_status/'+id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(sent);
    });
    $('#sale-courier').on('change', function() {
      var location =$('select[name="location"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                  document.getElementById('shippedBody').innerHTML = xhr.responseText;
              }
          }
      }
      xhr.open('GET', '/sale/sale-courier/'+id+'/'+location);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
    $('#product-status').on('change', function() {
      var status =$('select[name="product-status"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {

              }
          }
      }
      var sent = "id="+id+"&status="+status;
      xhr.open('POST', '/products/product_status/'+id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(sent);
    });
    $('#product-web-status').on('change', function() {
      var status =$('select[name="product-web-status"]').val();
      var id =$('input[name="id"]').val();
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                location.reload(true);
              }
          }
      }
      var sent = "id="+id+"&status="+status;
      xhr.open('POST', '/products/product_web_status/'+id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(sent);
    });
    $('#product-stock-status').on('change', function() {
        var status =$('select[name="product-stock-status"]').val();
        var id =$('input[name="id"]').val();
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else {
            throw new Error("Ajax is not supported by this browser");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200 && xhr.status < 300) {
                    window.open('/products/')
                }
            }
        }
        var sent = "id="+id+"&stock="+Number(status);
        xhr.open('POST', '/products/product_stock_status/'+id);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(sent);
      });

    //Search Imei
    $("#search_imei").keyup(function(){
      var imei =$('input[name="search_imei"]').val();
      if(imei==''){
        $("#search_imei").empty();
      }
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                if(imei==''){
                  document.getElementById('client_field').innerHTML = '';
                }else{
                  document.getElementById('client_field').innerHTML = xhr.responseText;
                }

              }
          }
      }
      xhr.open('GET', '/home/imei_search/'+imei);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
    //Search Products
    $("#search_products").keyup(function(){
      var products =$('input[name="search_products"]').val();
      if(products==''){
        $("#search_products").empty();
      }
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                  document.getElementById('product_field').innerHTML = xhr.responseText;
              }
          }
      }
      xhr.open('GET', '/home/products_search/'+products);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
    //Search The clients
    $("#search_client").keyup(function(){
      var client =$('input[name="search_client"]').val();
      if(client==''){
        $("#client_field").empty();
      }
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                  document.getElementById('client_field').innerHTML = xhr.responseText;

              }
          }
      }
      xhr.open('GET', '/client/client_search/'+client);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
    //Search The clients Home Page
    $("#h_search_client").keyup(function(){
      var client =$('input[name="h_search_client"]').val();
      if(client==''){
        $("#client_field").empty();
      }
      var xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status == 200 && xhr.status < 300) {
                  document.getElementById('client_field').innerHTML = xhr.responseText;
              }
          }
      }
      xhr.open('GET', '/client/h_client_search/'+client);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
    $('[name="input_type"]').change(function() {
        var val = $(this).val();
        if(val === "select") {
            $("#OptionsYes").show();
            $("#OptionsNo").hide();
        }
        else {
            $("#OptionsNo").show();
            $("#OptionsYes").hide();
        }
      });
      $('[name="attrib_type"]').change(function() {
          var val = $(this).val();
          var xhr;
          if (window.XMLHttpRequest) {
              xhr = new XMLHttpRequest();
          }
          else if (window.ActiveXObject) {
              xhr = new ActiveXObject("Msxml2.XMLHTTP");
          }
          else {
              throw new Error("Ajax is not supported by this browser");
          }
          xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                  if (xhr.status == 200 && xhr.status < 300) {
                      document.getElementById('attrib_fields').innerHTML = xhr.responseText;
                  }
              }
          }
          xhr.open('GET', '/products/attrib_type/'+val);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.send();
        });
        $("#btnPrintSale").on("click", function () {
            var divContents = $("#dvContainerSale").html();
            var printWindow = window.open('', '', 'height=400,width=800');
            printWindow.document.write('<html><head>');
            printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">');
            printWindow.document.write('<link rel="stylesheet" href="http://localhost:3000/assets/css/printPDF.css" />');
            printWindow.document.write('</head><body >');
            printWindow.document.write(divContents);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        });
        $("#btnPrintInvoice").on("click", function () {
            var divContents = $("#dvContainerInvoice").html();
            var printWindow = window.open('', '', 'height=400,width=800');
            printWindow.document.write('<html><head>');
            printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">');
            printWindow.document.write('<link rel="stylesheet" href="http://localhost:3000/assets/css/printPDF.css" />');
            printWindow.document.write('</head><body >');
            printWindow.document.write(divContents);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        });
            $("#add_entity").on("submit",function  (e) {
                var id= document.getElementsByName("product_id");
                // var ent = $("#prod_entity option:selected").text();
                // var valu = $("#e_value").val();
                e.preventDefault();
            //     $.post("/products/add-entity/"+id,$(this).serialize(), function( data ) {
            //      console.log(ent);
            //      console.log(valu);
                 
            //      document.getElementById('add_entity').reset();
            //    });
            var xhr;
            var entity =$('select[name="entity"]').val(); 
            var entity_txt = $("#prod_entity option:selected").text();           
            var e_value =$('input[name="e_value"]').val();
            var product_id =$('input[name="product_id"]').val();
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200 && xhr.status < 300) {
                
            }
        }
    }
    var sent = "product_id="+product_id+"&entity="+entity+"&e_value="+e_value;
    xhr.open('POST', '/products/add-entity/'+product_id);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(sent);
    console.log(entity_txt);
                 console.log(e_value);
                 $('select[name="entity"]').val('');
                 $('input[name="e_value"]').val('');
    var recRow = '<tr><td>'+entity_txt+'</td><td>'+e_value+'</td><td><form action="/products/delete-prod-ent/'+product_id+'" method="post"><input type="hidden" name="image" value="'+entity+'"><button type="submit" class="btn btn-outline-danger">Delete</button></form></td></tr>';
    jQuery('#ent_prod').append(recRow);
            });

            $("#discountV").on("change paste keyup", function() {
                 
                var amount = document.getElementById('amount').value;
                var amountH = document.getElementById('amount_h').value;
                var discount = $(this).val();
                
                if(amountH == ''){amountH = 0;}
                if(discount == ''){discount = 0;}       
                var result =  parseInt(amount) - parseInt(discount);
                if (discount == 0 || discount =='') {
                    document.getElementById('amount').value = amountH;
                } else {
                    document.getElementById('amount').value = parseInt(amountH) - parseInt(discount);
                }
             });
});
function makeVisible_1(x) {
    var status =$('input[name="product-status-'+x+'"]').val();
    var sReturn = 0;
    if(status == 0){
      sReturn = 1;
    }
  
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200 && xhr.status < 300) {
                $('input[name="product-status-'+x+'"]').val(xhr.responseText);
            }
        }
    }
    var sent = "id="+x+"&status="+status;
    xhr.open('POST', '/products/product_status/'+x);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(sent);
  
  }
function makeVisible_2(x) {
  var status =$('input[name="product-status2-'+x+'"]').val();
  var sReturn = 0;
  if(status == 0){
    sReturn = 1;
  }

  var xhr;
  if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
      xhr = new ActiveXObject("Msxml2.XMLHTTP");
  }
  else {
      throw new Error("Ajax is not supported by this browser");
  }
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status == 200 && xhr.status < 300) {
              $('input[name="product-status2-'+x+'"]').val(xhr.responseText);
          }
      }
  }
  var sent = "id="+x+"&status="+status;
  xhr.open('POST', '/products/product_web_status/'+x);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(sent);

}
function makeVisible_cat(x) {
    var status =$('input[name="category-status-'+x+'"]').val();
    var sReturn = 0;
    if(status == 0){
      sReturn = 1;
    }
  
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200 && xhr.status < 300) {
                $('input[name="category-status-'+x+'"]').val(xhr.responseText);
            }
        }
    }
    var sent = "id="+x+"&status="+status;
    xhr.open('POST', '/settings/category_status/'+x);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(sent);
  
  }
function quick_edit(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#QuickEdit').modal('show');
							document.getElementById('editBody').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/products/ajax_quick_edit/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function quick_edit_vendor(id,product) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#QuickEdit').modal('show');
							document.getElementById('editBody').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/vendor/ajax_quick_edit/'+id+'/'+product);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function quick_vendor(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#QuickVendor').modal('show');
							document.getElementById('vendorBody').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/products/ajax_quick_vendor/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function webIq_view(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#WebInqueryEdit').modal('show');
							document.getElementById('viewBody').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/inquiry/web_inquery_view/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function view_Cbranch(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#view-branch').modal('show');
							document.getElementById('branch-body').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/settings/courier_branch/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function edit_Cbranch(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#edit-branch').modal('show');
							document.getElementById('edit-branch-body').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/settings/courier_edit_branch/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function edit_location(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#editLocation').modal('show');
							document.getElementById('edit-location-body').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/settings/get_location/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function edit_tags(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#editTags').modal('show');
							document.getElementById('edit-tag-body').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/settings/get_tag/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
// $(function () {
//     $('#myTab a:last').tab('show')
//   })

var rowCount = 1;
function addImgRows(frm) {
    rowCount++;
    var recRow = '<tr id="imgCount' + rowCount + '" class="row"><td style="padding: 2px 5px;"><input name="img[]" id="id' + rowCount + '" type="text" class="form-control" /></td><td style="padding: 2px 5px;"><input name="sort[]" id="" type="text" class="form-control" value="0" /></td><td style="padding: 2px 5px;"><a  class="input-field btn-floating red" href="javascript:void(0);" onclick="removeImgRow(' + rowCount + ');" style="padding: 0px;"><i class="material-icons dp48" style="padding: 0px;margin: 0px;">delete</i></a></td></tr>';
    jQuery('#imgRows').append(recRow);
}
function removeImgRow(removeNum) {
    jQuery('#imgCount' + removeNum).remove();
}
function addMoreRows(frm) {
    rowCount++;
    var recRow = '<tr id="rowCount' + rowCount + '" class="row"><td style="padding: 2px 5px;"><input name="sd[]" id="id' + rowCount + '" type="text" class="form-control" /></td><td style="padding: 2px 5px;"><a  class="input-field btn-floating red" href="javascript:void(0);" onclick="removeRow(' + rowCount + ');" style="padding: 0px;"><i class="material-icons dp48" style="padding: 0px;margin: 0px;">delete</i></a></td></tr>';
    jQuery('#addedRows').append(recRow);
}
function removeRow(removeNum) {
    //del(removeNum);
    jQuery('#rowCount' + removeNum).remove();
      sumTotal();
}
function addval(x){
   values1 = $(x).val();
   id1 = $(x).attr('id');
   //$('#assigned').append("<img src='http://www.msshifi.com/skin/frontend/msshifi/default/images/delete-icon.gif' name='"+ values1 +"' value='" + values1 + "' onclick='removeval(this, \"" + values1 + "\")'></img>"+ values1 +"</li>");
   $('#assigned').append("<div class='checkbox'><label><input type='checkbox' class='flat' name='entity[]' value='" + values1 + "' onclick='removeval(this, \"" + values1 + "\")' id='"+ id1+"' checked>"+ id1+"</label></div>");
   $(x).parent().remove();
}
function removeval(y,val){
   values2 = val;
   id2 = $(y).attr('id');
   //$('#unassigned').append("<li><input type='checkbox' value='"+ values2 +"' name='"+ values2 +"' onclick='addval(this)' />"+ values2 +"</li>");
   $('#unassigned').append("<div class='checkbox'><label><input type='checkbox' class='flat' name='entity[]' value='" + values2 + "'  onclick='addval(this)' id='"+ id2+"'>"+ id2+"</label></div>");
   $(y).parent().remove();
}
function addBrandFoot(){
    rowCount++;
    var cat =$('#catF').val();
    
    //console.log(cat);
    var body ='';
    body +='<div class="col-md-4" id="cat'+rowCount+'"><div class="form-group"><label class="control-label col-md-3 col-sm-3 col-xs-12">Category</label><div id="foot'+rowCount+'" class="col-md-9 col-sm-9 col-xs-12">';
  
        body +='</div></div></div><div id="seF'+rowCount+'" class="col-md-6"><div class="form-group"><label for="footer_seo" class="col-md-12 col-sm-12 col-xs-12">Category Footer Seo</label><div class="col-md-12 col-sm-12 col-xs-12"><textarea name="category_footer_seo"  class="tinymce form-control"></textarea></div></div></div>';
    body +='<div class="col-md-2" id="del'+rowCount+'"><a  class="input-field btn-floating red" href="javascript:void(0);" onclick="removeBrandFoot(' + rowCount + ');" style="padding: 0px;"><i class="material-icons dp48" style="padding: 0px;margin: 0px;">delete</i></a>  </div>'
        $('#newCat').append(body);
    $('#category').clone().attr('id', 'newSel').attr('name', 'category').appendTo($('#foot'+rowCount));
 }
 function removeBrandFoot(x){
    jQuery('#cat' + x).remove();
    jQuery('#seF' + x).remove();
    jQuery('#del' + x).remove();
 }
function addprod(x) {
    var product =$('#P_'+x).val();
    var title =$('#title_'+x).val();
    var price =$('#price_'+x).val();
    var cost =$('#cost_'+x).val();
    var imei = document.getElementsByName('imei_'+x+'[]');
    var imeiId = document.getElementsByName('imeiId_'+x+'[]');
    rowCount++;
    $('#tr_'+x).hide();
    var recRow = '<tr id="prodCount' + rowCount + '">'+
    '<td>' + title + '<input name="prod[]" id="id' + rowCount + '" type="hidden" value="'+ product +'" /><input type="hidden" name="price[]" value="'+ price +'"><input type="hidden" name="cost[]" value="'+ cost +'"></td>'+
    '<td>'+ price +'</td>'+
    '<td><table>'; 
    for (var i = 0; i <imei.length; i++) {
        var inp=imei[i]; 
        var inpId = imeiId[i];
            //alert("pname["+i+"].value="+inp.value);
            recRow +='<tr id="imeiTr_'+rowCount+'_'+inp.value+'"><td>'+inp.value + '<input name="imei[]['+product+']" type="hidden" value="'+ inpId.value +'" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeaddimei(\'' + rowCount + '\',' + inp.value + ');"></td></tr>';
        }
    recRow +='</table></td>'+
    '<td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeaddprod(\'' + x + '\',' + rowCount + ');"><i class="fa fa-times"></i></button></td></tr>';
    jQuery('#prod_sec').append(recRow);
}
function removeaddprod(x,removeNum) {
    $('#tr_'+x).show();
    jQuery('#prodCount' + removeNum).remove();
}
function removeaddimei(x,imei) {
    jQuery('#imeiTr_'+x+'_'+imei).remove();
}
// function addprod(x) {
// 	var xhr;
// 	if (window.XMLHttpRequest) {
// 			xhr = new XMLHttpRequest();
// 	}
// 	else if (window.ActiveXObject) {
// 			xhr = new ActiveXObject("Msxml2.XMLHTTP");
// 	}
// 	else {
// 			throw new Error("Ajax is not supported by this browser");
// 	}
// 	xhr.onreadystatechange = function () {
// 			if (xhr.readyState === 4) {
// 					if (xhr.status == 200 && xhr.status < 300) {
// 						addprodTop(x);
// 						$('#prod_sec').append(xhr.responseText);
// 					}
// 			}
// 	}
// 	xhr.open('GET', '/sale/add_prod/'+x);
// 	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// 	xhr.send();
// }
function addprodTop(x) {
	var xhr;
	var total = $(".total-fig").text();
	if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
	}
	else {
			throw new Error("Ajax is not supported by this browser");
	}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
						$(".total-fig").text(xhr.responseText);
						$("#tr_"+x).hide('slide', {direction: 'up'}, 1400);
					}
			}
	}
	xhr.open('GET', '/sale/add_prod_top/'+x+"/"+total);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function addprodDown(x) {
	var xhr;
	var total = $(".total-fig").text();
	if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
	}
	else {
			throw new Error("Ajax is not supported by this browser");
	}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
						$(".total-fig").text(xhr.responseText);
					}
			}
	}
	xhr.open('GET', '/sale/add_prod_down/'+x+"/"+total);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function removeprod(removeNum) {
    jQuery('#prodCount' + removeNum).remove();
		addprodDown(removeNum);
		$("#tr_"+removeNum).show('slide', {direction: 'down'}, 1400);
		$('#ch_'+removeNum).attr('checked', false);
}
function addProdSale() {
    rowCount++;
    var recRow = '<tr id="prodCount' + rowCount + '"><td><input name="prod[]" id="id' + rowCount + '" type="text" class="form-control" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeProdSale(' + rowCount + ');"><i class="fa fa-times"></i></button></td></tr>';
    jQuery('#prod_sec').append(recRow);
}
function removeProdSale(removeNum) {
    jQuery('#prodCount' + removeNum).remove();
}
function addimei() {
    rowCount++;
    var recRow = '<tr id="imeiCount' + rowCount + '"><td><input name="imei[]" id="id' + rowCount + '" type="text" class="form-control" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeimei(' + rowCount + ');"><i class="fa fa-times"></i></button></td></tr>';
    jQuery('#imei_sec').append(recRow);
}
function removeimei(removeNum) {
    jQuery('#imeiCount' + removeNum).remove();
}
function addvendor(id) {
  rowCount++;
  var vendor =$('#vendor_'+id).val();
  var recRow = '  <tr id="venCount' + id + '"><td>'+ vendor +'<input name="vendor[]" type="hidden" value="'+ id +'" /></td><td><input name="cost[]" type="text" class="form-control" /></td><td><input name="feature[]" type="text" class="form-control" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeVendor(\'' + id + '\');"><i class="fa fa-times"></i></button></td></tr>';
  jQuery('#Prod-Vendor').append(recRow);
}
function removeVendor(removeNum) {
    jQuery('#venCount' + removeNum).remove();
}
function addvendorProd(id) {
  rowCount++;
  var vendor =$('#product_'+id).val();
  var recRow = '  <tr id="prodCount' + id + '"><td>'+ vendor +'<input name="product[]" type="hidden" value="'+ id +'" /></td><td><input name="cost[]" type="text" class="form-control" /></td><td><input name="feature[]" type="text" class="form-control" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeVendorProd(\'' + id + '\');"><i class="fa fa-times"></i></button></td></tr>';
  jQuery('#Prod-Vendor').append(recRow);
}
function removeVendorProd(removeNum) {
    jQuery('#prodCount' + removeNum).remove();
}
function addimeiC(id) {
    rowCount++;
    var recRow = '<tr id="'+ id +'imeiCount' + rowCount + '"><td><input name="imei['+ id +'][]" id="id' + rowCount + '" type="text" class="form-control" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeimeiC(' + rowCount + ',\''+ id +'\');"><i class="fa fa-times"></i></button></td></tr>';
    jQuery('#'+id+'imei_sec').append(recRow);
}
function removeimeiC(removeNum,id) {
    jQuery('#'+id+'imeiCount' + removeNum).remove();
}
function addProdR(x){
	rowCount++;
  var imei =$('#imei_'+x).val();
  var product =$('#product_'+x).val();
  var vendor =$('#vendor_'+x).val();
	var recRow = '<tr id="repairCount' + x + '"><td>'+ imei +'<input name="imei[]" type="hidden" value="'+ x +'" /><input name="product[]" type="hidden" value="'+ product +'" /></td><td>'+ product +'</td><td>'+ vendor +'</td><td><textarea name="issue[]" class="form-control"></textarea></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeProdR(\'' + x + '\');"><i class="fa fa-times"></i></button></td></tr>';
	jQuery('#Prod-Repair').append(recRow);
}
function removeProdR(x) {
    jQuery('#repairCount' + x).remove();
}
function addProdC(x){
	rowCount++;
  var product =$('#product_'+x).val();
  var price =$('#price_'+x).val();
	var recRow = '<tr id="catCount' + x + '"><td><input name="product[]" type="hidden" value="'+ x +'" />'+ product +'</td><td>'+ price +'</td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeProdC(\'' + x + '\');"><i class="fa fa-times"></i></button></td></tr>';
	jQuery('#Prod-Cat').append(recRow);
}
function removeProdC(x) {
    jQuery('#catCount' + x).remove();
}

function addcoll(x){
     var values1 = $(x).val();
     var id1 = $(x).attr('name');
     $('#addCollected').append("<tr id='col_" + values1 + "'><td>" + id1 + "<input type='hidden' name='col[]' value='" + values1 + "'></td><td><input type='text' name='cost[]' value='0' required></td><td><button type='button' name='button' onclick='addimeiC(\""+values1+"\")' class='btn btn-outline-danger'>Add Imei/Serial</button><table><tbody id='"+values1+"imei_sec'></tbody></table></td><td class='col-md-2'><button type='button' class='btn btn-danger btn-app-sm btn-circle' onclick='removecol(this, \"" + values1 + "\")'><i class='fa fa-times'></i></button></td></tr>");

 }
 function removecol(y,val){
     var values2 = 'col_'+val;
     var id2 = $(y).attr('id');
jQuery('#col_' + val).remove();
}
function addProdE(x){
	rowCount++;
	var recRow = '<tr id="prodCount' + x + '"><td><input name="entity[]" type="text" /></td><td><input name="value[]" type="text" /></td><td><button type="button" class="btn btn-danger btn-app-sm btn-circle" onclick="removeProdE(\'' + x + '\');"><i class="fa fa-times"></i></button></td></tr>';
	jQuery('#Prod-Ent').append(recRow);
}
function removeProdE(x) {
    jQuery('#prodCount' + x).remove();
}
function sale_addImei(id) {
		var xhr;
		if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
		else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
		else {throw new Error("Ajax is not supported by this browser");}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#sale-Modal').modal('show');
								document.getElementById('imeiBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/sale/add_imei/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
}
function sale_editImei(id) {
	var xhr;
  	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#sale-Modal').modal('show');
							document.getElementById('imeiBody').innerHTML = xhr.responseText;
					}
			}
	}
	xhr.open('GET', '/sale/edit_imei/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}
function sale_edit(id) {
	var xhr;
	if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
	else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
	else {throw new Error("Ajax is not supported by this browser");}
	xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
					if (xhr.status == 200 && xhr.status < 300) {
            jQuery.noConflict();
						$('#sale-Modal').modal('show');
							document.getElementById('imeiBody').innerHTML = xhr.responseText;
					}
			}
	}
  xhr.open('GET', '/sale/edit_prod_sale/'+id);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
}

function sale_status(id) {
		var xhr;
		if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();	}
		else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
		else {throw new Error("Ajax is not supported by this browser");}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#sale-Modal').modal('show');
								document.getElementById('imeiBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/sale/status_edit/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
function sale_payment(id) {
		var xhr;
		if (window.XMLHttpRequest) {xhr = new XMLHttpRequest();}
		else if (window.ActiveXObject) {xhr = new ActiveXObject("Msxml2.XMLHTTP");}
		else {throw new Error("Ajax is not supported by this browser");}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#sale-Modal').modal('show');
								document.getElementById('imeiBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/sale/sale_payment/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
  function sale_pdf(id) {
  		var xhr;
  		if (window.XMLHttpRequest) {
  				xhr = new XMLHttpRequest();
  		}
  		else if (window.ActiveXObject) {
  				xhr = new ActiveXObject("Msxml2.XMLHTTP");
  		}
  		else {
  				throw new Error("Ajax is not supported by this browser");
  		}
  		xhr.onreadystatechange = function () {
  				if (xhr.readyState === 4) {
  						if (xhr.status == 200 && xhr.status < 300) {
                jQuery.noConflict();
  							$('#sale-Modal').modal('show');
  								document.getElementById('imeiBody').innerHTML = xhr.responseText;
  						}
  				}
  		}
  		xhr.open('GET', '/sale/sale_pdf/'+id);
  		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  		xhr.send();
  }
function repair_payment(id) {
		var xhr;
		if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		else {
				throw new Error("Ajax is not supported by this browser");
		}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#repair-Modal').modal('show');
								document.getElementById('repairBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/repair/repair_payment/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
function vendor_imei_edit(id) {
		var xhr;
		if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		else {
				throw new Error("Ajax is not supported by this browser");
		}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#vendor-Modal').modal('show');
								document.getElementById('ModalBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/vendor/collected/edit/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
function vendor_imei_status(id) {
		var xhr;
		if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		else {
				throw new Error("Ajax is not supported by this browser");
		}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#vendor-Modal').modal('show');
								document.getElementById('ModalBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/vendor/collected/status/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
function edit_log(id) {
		var xhr;
		if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		else {
				throw new Error("Ajax is not supported by this browser");
		}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#user-Modal').modal('show');
								document.getElementById('ModalBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/user/edit-log/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
function client_data(id) {
		var xhr;
		if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		else {
				throw new Error("Ajax is not supported by this browser");
		}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
								document.getElementById('nSaleB').innerHTML = xhr.responseText;
                document.getElementById('client_field').innerHTML = '';
                client_data_products(id);
						}
				}
		}
		xhr.open('GET', '/client/client_data/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
  function client_data_products(id) {
  		var xhr;
  		if (window.XMLHttpRequest) {
  				xhr = new XMLHttpRequest();
  		}
  		else if (window.ActiveXObject) {
  				xhr = new ActiveXObject("Msxml2.XMLHTTP");
  		}
  		else {
  				throw new Error("Ajax is not supported by this browser");
  		}
  		xhr.onreadystatechange = function () {
  				if (xhr.readyState === 4) {
  						if (xhr.status == 200 && xhr.status < 300) {
  								document.getElementById('repair-products').innerHTML = xhr.responseText;
  						}
  				}
  		}
  		xhr.open('GET', '/client/client_data_products/'+id);
  		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  		xhr.send();
  	}
    function imei_repair(id) {
    		var xhr;
    		if (window.XMLHttpRequest) {
    				xhr = new XMLHttpRequest();
    		}
    		else if (window.ActiveXObject) {
    				xhr = new ActiveXObject("Msxml2.XMLHTTP");
    		}
    		else {
    				throw new Error("Ajax is not supported by this browser");
    		}
    		xhr.onreadystatechange = function () {
    				if (xhr.readyState === 4) {
    						if (xhr.status == 200 && xhr.status < 300) {
    								$('#Prod-Repair').append(xhr.responseText);
                    document.getElementById('client_field').innerHTML = '';
    						}
    				}
    		}
    		xhr.open('GET', '/client/imei_repair/'+id);
    		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    		xhr.send();
    	}
function repair_edit(id) {
		var xhr;
		if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		else {
				throw new Error("Ajax is not supported by this browser");
		}
		xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
						if (xhr.status == 200 && xhr.status < 300) {
              jQuery.noConflict();
							$('#repair-Modal').modal('show');
							document.getElementById('repairBody').innerHTML = xhr.responseText;
						}
				}
		}
		xhr.open('GET', '/repair/edit/'+id);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send();
	}
	function repairp_edit(id) {
			var xhr;
			if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
			}
			else if (window.ActiveXObject) {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}
			else {
					throw new Error("Ajax is not supported by this browser");
			}
			xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
							if (xhr.status == 200 && xhr.status < 300) {
                jQuery.noConflict();
								$('#repair-Modal').modal('show');
								document.getElementById('repairBody').innerHTML = xhr.responseText;
							}
					}
			}
			xhr.open('GET', '/repair/edit_product/'+id);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send();
		}
    function PostCat(e) {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else {
            throw new Error("Ajax is not supported by this browser");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200 && xhr.status < 300) {
                    document.getElementById('MainCat').innerHTML = xhr.responseText;
                }
            }
        }
        xhr.open('GET', '/settings/getcat/'+e);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    }
    function editCategory(e){
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else {
            throw new Error("Ajax is not supported by this browser");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200 && xhr.status < 300) {
                    document.getElementById('editSUB').innerHTML = xhr.responseText;
                }
            }
        }

        xhr.open('POST', '/settings/getSubCat');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("id=" + e);
    }
    function editCateg(e){

        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else {
            throw new Error("Ajax is not supported by this browser");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200 && xhr.status < 300) {
                  jQuery.noConflict();
                  $('#editSub').modal('show');
                    document.getElementById('editCat').innerHTML = xhr.responseText;
                }
            }
        }

        xhr.open('GET', '/settings/geteditcat/'+e);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    }
    function editProdVen(e){
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else {
            throw new Error("Ajax is not supported by this browser");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200 && xhr.status < 300) {
                  jQuery.noConflict();
                  $('#vendor-Modal').modal('show');
                    document.getElementById('vendor-body').innerHTML = xhr.responseText;
                }
            }
        }

        xhr.open('GET', '/products/edir-vendor/'+e);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    }
    function addpay(x) {
    	var tr =$('input[name="trC_'+x+'"]').val();
      var arr =$('input[name="ch_'+x+'"]').val();
      var imei = $('input[name="im_'+x+'"]').val();
      var product =$('input[name="pr_'+x+'"]').val();
      var cost =$('input[name="co_'+x+'"]').val();
      var qty =$('input[name="qty_'+x+'"]').val();
      var total =$('input[name="total"]').val();

      total = parseInt(cost)+parseInt(total);
      $('input[name="total"]').val(total);
      $('input[name="amount"]').val(total);
      $('input[name="total2"]').val(total);

      $('#pay_sec').append("<tr id='col_" + tr + "'><td>" + product + "</td><td>" + cost + "</td><td>" + qty + "</td><td><button type='button' class='btn btn-danger btn-app-sm btn-circle' onclick='removepay(\"" + tr + ','+ cost +"\")'><i class='fa fa-times'></i></button></td></tr>");
      $("#tr_"+x).hide('slide', {direction: 'up'}, 1400);
    }
    function removepay(removeNum,cost) {
      var total =$('input[name="total"]').val();
      total = parseInt(total)-parseInt(cost);
      $('input[name="total"]').val(total);
      $('input[name="amount"]').val(total);
      $('input[name="total2"]').val(total);
        jQuery('#col_' + removeNum).remove();
    		$("#tr_"+removeNum).show('slide', {direction: 'down'}, 1400);
    		$('#ch_'+removeNum).attr('checked', false);
    }
    function sumPay() {
        var cash = Number($('input[name="cash"]').val());
        var mpesa = Number($('input[name="mpesa"]').val());
        var cheque = Number($('input[name="cheque"]').val());
        var card = Number($('input[name="card"]').val());
        var total = cash + card + mpesa + cheque;
        document.getElementById('total_pay').innerHTML = total;
    }
    function imeiCost(x)
    {
        var amount = document.getElementById('amount').value;
        var cost = document.getElementById('cost_'+x).value;
        if(amount == ''){amount = 0;}
        if(cost == ''){cost = 0;}        
        if (document.getElementById('ch_'+x).checked) 
        {document.getElementById('amount').value = parseInt(amount) + parseInt(cost);} 
        else {document.getElementById('amount').value = parseInt(amount) - parseInt(cost);}
    }

    function imeiDiscount()
    {
        var amount = document.getElementById('amount').value;
        var amountH = document.getElementById('amount_h').value;
        var discount = document.getElementById('discount').value;
        console.log(amount);
        console.log(discount);
        
        if(amountH == ''){amountH = 0;}
        if(discount == ''){discount = 0;}       
        var result =  parseInt(amount) - parseInt(discount);
        if (discount == 0 || discount =='') {
            document.getElementById('amount').value = amountH;
        console.log(result);    
        } else {
            document.getElementById('amount').value = parseInt(amountH) - parseInt(discount);
        console.log(result);
        }
        
        
    }
