/*NOTE: All response from API Call will contain the following structure
/*
    {
        "status": "success",=====> will contain either 'success' or 'failure'
        "code": 200,======> status code Ex:404,500,200
        "data": {},====>>requested data
        "error": ""====>>if any errors
    }
*/


/*Global Variables Section*/

//Declare your Global Variables inside this block
var product_list = "";
var button_category = "";
var jsonObj;
var data_object;
var category_list = [];
var product_name;
var product_category;
var product_description;
var product_price;
var initial_drop_id = "";
/*End of Global Variables*/

// A $(document).ready() block.
$(document).ready(function() {
    
    //Write any code you want executed in a $(document).ready() block here
/* Function when add product button is clicked */
   $("#upload-image").hide();

    $(document).on("click", "img[id^='image-div-']", function () {
        var image_id = this.id;
        console.log(image_id);
        $("#upload-image").click();
        $('#upload-image').change(function () {
            readURL(image_id, this);
        })
    });
var upload_id;
    var image_file;

    function readURL(id, input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#' + id).attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
            image_file = input.files[0];  
        }
    }
 $(document).on("click", "button[id^='upload-']", function () {
        upload_id = this.id.substr(7);
        uploadImage(upload_id, image_file);
    });

    var removeId;
    /* Function when remove button is clicked */
    $(document).on("click", "button[id^='remove-product-']", function () {
        removeId = this.id.substr(15);

});

    $(document).on("click", "#confirm-delete", function () {
            removeProduct(removeId);
        });
    

    var editId;
    /* Function when edit button is clicked */
    $(document).on("click", "button[id^='edit-product-']", function () {
        editId = this.id.substr(13);
        $("#heading-form").html("Edit Product");
        $("#save-form").replaceWith("<button id='update-form' name='success' class='btn btn-success'>Update</button>");
        $.each(data_object, function (key, element) {
            if (element._id == editId) {
                document.getElementById("add-name").value = element.name;
                document.getElementById("add-price").value = element.price;
                document.getElementById("add-category").value = element.category;
                document.getElementById("add-description").value = element.description;
            }
        });

        $(document).on("click", "#update-form", function () {
            if (validateForm()) {
                editProduct(editId);
            }
        });
    });


    /* Function when add product button is clicked */
    $(document).on("click", "#save-form", function () {
        if (validateForm()) {
            createProduct(getInputData());
        }
    });

    $(document).on("click", "#clear-form", function () {
        document.getElementById("product-form").reset();
        $("#heading-form").html("Add Product");
        $("#update-form").replaceWith("<button id='save-form' name='success' class='btn btn-success'>Submit</button>");
    });

    $(document).on("click", "i[id^='close-']", function () {
        var category = this.id.substr(6);
        $( "#drop-" + category ).remove();
        $( "#close-" + category ).remove();
        initial_drop_id = "";
        
        category_list = category_list.filter(function(value){
            return value != category;
        });
        
        categoryFilter();
    });
});

    /***
    Write your code for fetching the list of product from the database
    
    Using AJAX call the webservice http://localhost:3000/products in GET method
    It will return an Array of objects as follows
    
        {
            [
                {
                    "_id" : "57b6fabb977a336f514e73ef",
                    "price" : 200,
                    "description" : "Great pictures make all the difference. That’s why there’s the new Moto G Plus, 4th Gen. It gives you a 16 MP camera with laser focus and a whole lot more, so you can say goodbye to blurry photos and missed shots. Instantly unlock your phone using your unique fingerprint as a passcode. Get up to 6 hours of power in just 15 minutes of charging, along with an all-day battery. And get the speed you need now and in the future with a powerful octa-core processor.",
                    "category" : "Smartphones",
                    "name" : "Moto G Plus, 4th Gen (Black, 32 GB)",
                    "productImg" : {
                    "fileName" : "57b6fabb977a336f514e73ef_Product.png",
                    "filePath" : "./public/images/Product/57b6fabb977a336f514e73ef_Product.png",
                    "fileType" : "png"
                },
                {
                    //Next Product and so on
                }
            ]
        }

    Using jQuery
    Iterate through this response array and dynamically create the products list
    using JavaScript DOM and innerHTML.
    ***/
//Get List of Products from the database
function getProducts() {
    $("#product-list").empty();
    $("#button-categories").empty();
    $('#clear-form').click();

    $.ajax({
        url: "http://localhost:3000/products",
        type: 'GET',            
    }).done(function(responseObj){
         cat_array = [];
        $.each(responseObj, function (i, item) {
            if (i == "data") {
                data_object = item;
                $.each(item, function (key, value) {
                    //Right Code to update in the Product Template
                    product_list += "<div class='col-lg-12 panel panel-default dashboard_graph' id = 'test-filter'>"
                        + "<div class='col-lg-3'><div>"
                        + "<img id='image-div-" + value._id + "' src=" + value.productImg.filePath.substr(9) + " class = 'img-thumbnail  float-center'></div>"
                        + "<div id='upload'><button class='btn btn-link fa fa-upload' style='padding-left: 45%' id='upload-" + value._id + "'> Upload</button></div></div>"
                        + "<div id='" + value.category + "-" + value._id + "' class='col-lg-8 text-justify pull-right'>"
                        + "<h4>" + value.name + "</h4>"
                        + "<p>" + value.description + "</p>"
                        + "<p><span class='label label-default'><i id='product-category'>" + value.category + "</i></span></p>"
                        + "<b style='color: brown'>Rs. <i>" + value.price + "</i></b></div>"
                        + "<div class='col-lg-12 panel-footer'><div>"
                        + "<button id='remove-product-" + value._id + "' class='btn btn-danger pull-right' data-toggle='modal' data-target='#myModal'>"
                        + "<span class='glyphicon glyphicon-trash'></span> Remove</button>"
                        + "<button id='edit-product-" + value._id + "' class='btn btn-success pull-right'>"
                        + "<span class='glyphicon glyphicon-edit'></span> Edit</button></div></div></div>"
                    cat_array.push(value.category);
                });
            }
        });


        $.each(jQuery.unique(cat_array), function (i, value) {
            button_category += "<button id='drag-" + value + "' class='btn btn-success draggable' draggable='true' ondragstart='drag(event)' value = " + value + ">" + value + "</button>";
        });

        document.getElementById("product-list").innerHTML = product_list;
        document.getElementById("button-categories").innerHTML = button_category;

    product_list = "";
    button_category = "";
      });
}

//Initial call to populate the Products list the first time the page loads
getProducts();


/*
 
 Write a generic click even capture code block 
 to capture the click events of all the buttons in the HTML page

 If the button is remove
 -----------------------
 Popup an alert message to confirm the delete
 if confirmed
 Call the API
    http://localhost:3000/product/<id>
    with method = DELETE
    replace <id> with the _id in the product object

 Show the success/failure message in a message div with the corresponding color green/red


 If the button is add
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product
    with method=POST
    For this call data should be in following structure
    {
         name:'',
         category:'',
         description:'',
         price:''
    }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the form and set the mode to Add

 
 If the button is edit
 ---------------------
 Change the Form to Edit Mode
 Populate the details of the product in the form
 
 
 If the button is Update
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product/:id    
    with method=PUT
    replace <id> with the _id in the product object
    For this call data should be in following structure
     {
     name:'',
     category:'',
     description:'',
     price:''
     }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the Form
 Set the Form back to Add mode

 if the button is Cancel
 -----------------------
 Reset the form
 Set the mode to Add

 */
function validateForm() {
    product_name = document.getElementById("add-name").value;
    product_category = document.getElementById("add-category").value;
    product_description = document.getElementById("add-description").value;
    product_price = document.getElementById("add-price").value;

    if (product_name != "" && product_category != "" && product_description != "" && product_price != "") {
        return true;
    } else {
        $('#alert-banner-form').empty();
        $("#alert-banner-form").html('<div class="alert alert-danger alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Please fill all fields</div>');
        
        $('#alert-banner-form').slideUp(3000, function(){
            $(this).empty().show();
        });
        return false;
    }
}
function getInputData() {

    return {
        name: product_name,
        category: product_category,
        description: product_description,
        price: product_price
    }
}


/*Remove Product*/
function removeProduct(id) {
    console.log("Remove" + id);
    $.ajax({
        url: "http://localhost:3000/product/" + id,
        type: 'DELETE',
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
        },
        complete: function () {
            $('#alert-banner').empty();
            $("#alert-banner").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Deleted Successfully</div>');
            
            $('#alert-banner').slideUp(3000, function(){
                $(this).empty().show();
            });
            getProducts();
        }
    });
//write your code here to remove the product and call when remove button clicked

}

/*Update Product*/
function editProduct(id) {
 $.ajax({
        url: "http://localhost:3000/product/" + id,
        type: 'PUT',
        dataType: 'json',
        data: getInputData(),
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
        },
        complete: function (data) {
            $('#alert-banner-form').empty();
            $("#alert-banner-form").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Updated Successfully</div>');

            $('#alert-banner-form').slideUp(3000, function(){
                $(this).empty().show();
            });
        getProducts();
        }
    });
    //write your code here to update the product and call when update button clicked

}

    //write your code here to create  the product and call when add button clicked
function createProduct(newData) {

    $.ajax({
        url: "http://localhost:3000/product",
        type: 'POST',
        data: newData,
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
        },
        complete: function () {
              $("#alert-banner-form").empty();
            $("#alert-banner-form").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Product Successfully Saved</div>');
             $('#alert-banner-form').slideUp(3000, function(){
                $(this).empty().show();
            });
            getProducts();
        }
    });
}


/* 
    //Code Block for Drag and Drop Filter

    //Write your code here for making the Category List
    Using jQuery
    From the products list, create a list of unique categories
    Display each category as an individual button, dynamically creating the required HTML Code

    
    //Write your code here for filtering the products list on Drop 
    Using jQuery
    Show the category button with a font-awesome times icon to its right in the filter list
    A category should appear only once in the filter list
    Filter the products list with, products belonging to the selected categories only


    //Write your code to remove a category from the filter list
    Using jQuery
    When the user clicks on the x icon
    Remove the category button from the filter list
    Filter the products list with, products belonging to the selected categories only

 */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}



function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if(initial_drop_id != data) {
    initial_drop_id = data; 
    var categoryName = $('#' + data).val();
    category_list.push(categoryName);

    var test = document.createElement('button');
    test.type = "button";
    test.value = categoryName;
    test.className = "btn btn-success";
    test.innerHTML = categoryName;
    test.id = "drop-" + categoryName;

    var spanElement = document.createElement('i');
    spanElement.className = "fa fa-times-circle";
    spanElement.id = "close-" + categoryName;
    spanElement.style.color = "#a50b0b";
    spanElement.setAttribute("aria-hidden", "true");
    spanElement.appendChild(document.createTextNode("     "))

    ev.target.appendChild(test);
    ev.target.appendChild(spanElement);

    categoryFilter();
    
}

}

//Code block for Free Text Search
$(document).ready(function() {
    $("#searchText").keyup(function() {
        var searchText = $(this).val().toUpperCase();
        
         $("#product-list #test-filter").each(function (key, productListDiv) {
           
            if ($(productListDiv).text().toUpperCase().search(searchText) < 0) {
                $(productListDiv).hide();
            } else {
                $(productListDiv).show();
            }
        });
        /*
            //Write your code here for the Free Text Search
            When the user types text in the search input box. 
            As he types the text filter the products list
            Matching the following fields
                - Name
                - Description
                - Category
                - Price
            
            The search string maybe present in any one of the fields
            anywhere in the content

         */
        
    });

});
function categoryFilter() {

    $.each(category_list, function (i, category_name) {
    
        $("#product-list #test-filter").each(function (key, productListDiv) {
            if ($(productListDiv).text().search(category_name) < 0) {
                $(productListDiv).hide();
            }
        });
    });

    $.each(category_list, function (i, category_name) {
            $("#product-list #test-filter").each(function (key, productListDiv) {
                if ($(productListDiv).text().search(category_name) > 0) {
                    $(productListDiv).show();
                }
            });
        });

        if(category_list.length == 0){
            $("#product-list #test-filter").show();
        }
}

/*
    //Write your Code here for the Image Upload Feature
    Make the product image clickable in the getProducts() method.
    When the user clicks on the product image
    Open the file selector window
    Display the selected image as a preview in the product tile
    
    //Image Upload
    When the user clicks Upload
    Using AJAX
    Update the product image using the following api call
        Call the api
            http://localhost:3000/product/id/ProductImg
            method=PUT
            the data for this call should be as FormData
            eg:
            var formData = new FormData();
            formData.append('file', file, file.name);
    
    Refresh the products list to show the new image
 */
//Code block for Image Upload
function uploadImage(id, file) {
    var formData = new FormData();
    formData.append('file', file);
    console.log(formData.get);
    $.ajax({
        url: "http://localhost:3000/product/" + id + "/ProductImg",
        type: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data, status, jqXmlHttpRequest) {
            $('#alert-banner').empty();
            $("#alert-banner").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Image Uploaded Successfully</div>');
            
            $('#alert-banner').slideUp(3000, function(){
                $(this).empty().show();
            });
        getProducts();
        }
    });
}