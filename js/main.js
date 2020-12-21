// Desaparecer navbar en scroll

let ubicacionPrincipal = window.pageYOffset; //0

  AOS.init();

window.addEventListener("scroll", function(){
    let desplazamientoActual = window.pageYOffset; //180
    if(ubicacionPrincipal >= desplazamientoActual){ // 200 > 180
        document.getElementsByTagName("nav")[0].style.top = "0px"
    }else{
        document.getElementsByTagName("nav")[0].style.top = "-100px"
    }
    ubicacionPrincipal= desplazamientoActual; //200

})

// Menu

let enlacesHeader = document.querySelectorAll(".enlaces-header")[0];

document.querySelectorAll(".hamburguer")[0].addEventListener("click", function(){
    enlacesHeader.classList.toggle("menudos")
})

let ocultarNav = () =>{
    enlacesHeader.classList.toggle("menudos");
    $(".hamburguer i").css("color", "black ");
}

// Ajax

let datosProducto = [];
$.get("../datos.json", function (data){
    datosProducto = data;
    console.log(datosProducto);  
    mostrarProducto(botonesAgregar, datosProducto); 
});

let botonesAgregar = document.getElementsByClassName("botonAgregar");
console.log(botonesAgregar);    

function mostrarProducto(botonAgregado, datosProducto){
    for (let i = 0; i < botonAgregado.length; i++) {
        let padre = $(botonAgregado[i]).parent();
        console.log(padre);
        for (let j = 0; j < datosProducto.length; j++) {
            if (botonAgregado[i].value == datosProducto[j].code) {
                $(padre)
                .find(".textoProducto")
                .append(
                    "<h4 class='card-title'>" + 
                    datosProducto[j].product +
                    "</h4>" +
                    "<p class='card-text'>" +
                    datosProducto[j].price +
                    "</p>"
                );
            break;
            }
        }
    }
}

// Carrito

var shoppingCart = (function() {
    cart = [];
    
    // Constructor
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
    
    // Guardar carrito
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
    // Cargar carrito
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
    
    // =============================
    // =============================
    var obj = {};
    
    // Agregar al carrito
    obj.addItemToCart = function(name, price, count) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count ++;
          saveCart();
          return;
        }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      saveCart();
    }
    // Contar items
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name === name) {
          cart[i].count = count;
          break;
        }
      }
    };
    // Remover del carrito
    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            cart[item].count --;
            if(cart[item].count === 0) {
              cart.splice(item, 1);
            }
            break;
          }
      }
      saveCart();
    }
  
    // Remover todo del carrito
    obj.removeItemFromCartAll = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
    // Vaciar carrito
    obj.clearCart = function() {
      cart = [];
      saveCart();
    }
  
    // Contar carrito
    obj.totalCount = function() {
      var totalCount = 0;
      for(var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }
  
    // Precio total
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
    // Ordenar carrito
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = item.price * item.count;
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
  
    return obj;
  })();
  
  
  // *****************************************
  // Eventos
  // ***************************************** 
  // Agregar item
  $('.add-to-cart').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
  });
  
  // Vaciar items
  $('.clear-cart').click(function() {
    shoppingCart.clearCart();
    displayCart();
  });
  
  // Mostrar carrito
  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
      output += "<tr>"
        + "<td class='product-name'>" + cartArray[i].name + "</td>" 
        + "<td class='product-price'>$" + cartArray[i].price + "</td>"
        + "<td><div class='input-group product-display'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"    
        + "<input type='number' class='item-count form-control product-input' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"              
        + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"                       
        + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"                                          
        + " = "                                                                                                                                         
        + "<td>$" + cartArray[i].total + "</td>"                                                                                                        
        +  "</tr>";                                                                                                                                     
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }
  
  // Boton borrar
  $('.show-cart').on("click", ".delete-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
  })
  
  // Restar 1
  $('.show-cart').on("click", ".minus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCart(name);
    displayCart();
  })

  // Sumar 1
  $('.show-cart').on("click", ".plus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.addItemToCart(name);
    displayCart();
  })
  
  // Contador de items
  $('.show-cart').on("change", ".item-count", function(event) {
     var name = $(this).data('name');
     var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });
  
displayCart();


   