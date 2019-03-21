<div class="row">

<% for(var sprod of saleProd ){ %>
      <% for( var prod of products){
          if(sprod.product == prod.id){
        %>
        <div class="col-sm-2">
    			<input type="text" class="form-control" value="<%= prod.title %>" placeholder="Title">
    		</div>
        <div class="col-sm-2">
    			<input type="text" class="form-control" value="<%= prod.price %>" placeholder="Price">
    		</div>
        <div class="col-sm-2">
    			<input type="text" class="form-control" value="<%= sprod.qty %>" placeholder="Quantity">
    		</div>
        <input type="hidden" name="id" value="">
      <% } } %>
      <button type="button" class="add_imei btn btn-primary" data-toggle="modal" data-target="#addImei" onclick="sale_addImei('<%= sprod.id %>')">Add Imei</button>
<% } %>
</div>
