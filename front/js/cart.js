
function ajoutAuPanier() { // On récupére depuis la page panier le panier via localstorage et on insére les elemnets dans la page panier
    let panier;
    let panierJson = window.localStorage.getItem("panier");
    if(panierJson != null) {
        panier = JSON.parse(panierJson)
        console.log(panier)
        let totalQuantitySelector = document.getElementById("totalQuantity");
        let totalPriceSelector = document.getElementById("totalPrice");
        let totalQuantity = 0;
        let totalPrice = 0;
        panier.forEach(function (productPanier) {

            fetch("http://localhost:3000/api/products/" + productPanier.id)
            .then(function (response) {
                return response.json()
            }).then(function (product) {
                let cartItemsSelector = document.getElementById("cart__items");
                let productArticleSelector = document.createElement("article");
                productArticleSelector.setAttribute("class", "cart__item");
                productArticleSelector.setAttribute("data-id", productPanier.id);
                productArticleSelector.setAttribute("data-color", productPanier.color);
                cartItemsSelector.appendChild(productArticleSelector);

                let productDivImgSelector = document.createElement("div");
                productDivImgSelector.setAttribute("class", "cart__item__img");
                let productImgSelector = document.createElement("img");
                productImgSelector.src = product.imageUrl;
                productImgSelector.alt = product.altTxt;
                productDivImgSelector.appendChild(productImgSelector);

                productArticleSelector.appendChild(productDivImgSelector);

                let cartItemContentSelector = document.createElement("div");
                cartItemContentSelector.setAttribute("class", "cart__item__content");

                let cartItemDescriptionSelector = document.createElement("div");
                cartItemDescriptionSelector.setAttribute("class", "cart__item__content__description");

                let cartItemProductNameSelector = document.createElement("h2");
                cartItemProductNameSelector.innerText = product.name;
                let cartItemProductColorSelector = document.createElement("p");
                cartItemProductColorSelector.innerText = productPanier.color;
                let cartItemProductPriceSelector = document.createElement("p");
                cartItemProductPriceSelector.innerText = product.price;
                cartItemDescriptionSelector.appendChild(cartItemProductNameSelector);
                cartItemDescriptionSelector.appendChild(cartItemProductColorSelector);
                cartItemDescriptionSelector.appendChild(cartItemProductPriceSelector);
                cartItemContentSelector.appendChild(cartItemDescriptionSelector);
                
                let cartItemContentSettingsSelector = document.createElement("div");
                cartItemContentSettingsSelector.setAttribute("class", "cart__item__content__settings");
                
                let cartItemContentSettingsQuantitySelector = document.createElement("div");
                cartItemContentSettingsQuantitySelector.setAttribute("class", "cart__item__content__settings__quantity");

                let cartItemProductQuantitySelector = document.createElement("p");
                cartItemProductQuantitySelector.innerText = "Qté : "
                let cartItemProductInputSelector = document.createElement("input");
                cartItemProductInputSelector.setAttribute("type", "number");
                cartItemProductInputSelector.setAttribute("class", "itemQuantity");
                cartItemProductInputSelector.setAttribute("name", "itemQuantity");
                cartItemProductInputSelector.setAttribute("min", "1");
                cartItemProductInputSelector.setAttribute("max", "100");
                cartItemProductInputSelector.setAttribute("value", productPanier.quantity);
                cartItemProductInputSelector.setAttribute("oninput", "validity.valid||(value='');");

                cartItemContentSettingsQuantitySelector.appendChild(cartItemProductQuantitySelector);
                cartItemContentSettingsQuantitySelector.appendChild(cartItemProductInputSelector);

                let cartItemContentSettingsDeleteSelector = document.createElement("div");
                cartItemContentSettingsDeleteSelector.setAttribute("class", "cart__item__content__settings__delete");
                let deleteItemSelector = document.createElement("p");
                deleteItemSelector.setAttribute("class", "deleteItem");
                deleteItemSelector.innerText = "Supprimer";
                cartItemContentSettingsDeleteSelector.appendChild(deleteItemSelector);

                cartItemContentSettingsSelector.appendChild(cartItemContentSettingsQuantitySelector);
                cartItemContentSettingsSelector.appendChild(cartItemContentSettingsDeleteSelector);

                cartItemDescriptionSelector.appendChild(cartItemContentSettingsSelector);

                productArticleSelector.appendChild(cartItemContentSelector);

                totalQuantity = totalQuantity + productPanier.quantity;
                totalPrice = totalPrice + (productPanier.quantity * product.price);
                totalQuantitySelector.innerText = totalQuantity;
                totalPriceSelector.innerText = totalPrice;

                cartItemProductInputSelector.addEventListener('change', function (event) {
                    updateTotalQuantity(event);
                });

                deleteItemSelector.addEventListener('click', function (event) {
                    deleteProduct(event);
                });
                
            });
    
        });
        
    }

    
}

function updateTotalQuantity(event) {  // Mise à jour de la quantité totale et le prix total  des produits
    let targetElement = event.target;
    let newQuantity = parseInt(targetElement.value);
    let articleElement = targetElement.closest(".cart__item");
    let currentProductId = articleElement.getAttribute("data-id");
    let currentProductColor = articleElement.getAttribute("data-color");

    console.log("Appel reçu suite changement qunatity");
    console.log(targetElement);
    console.log(newQuantity);

    let panier;
    let panierJson = window.localStorage.getItem("panier");
    if(panierJson != null) {
        panier = JSON.parse(panierJson)
        let totalQuantitySelector = document.getElementById("totalQuantity");
        let totalPriceSelector = document.getElementById("totalPrice");
        let totalQuantity = 0;
        let totalPrice = 0;
        panier.forEach(function (productPanier) {

            fetch("http://localhost:3000/api/products/" + productPanier.id)
            .then(function (response) {
                return response.json()
            }).then(function (product) {
                if(product._id == currentProductId && productPanier.color == currentProductColor) {
                    console.log("Product Found")
                    totalQuantity = totalQuantity + newQuantity;
                    totalPrice = totalPrice + (newQuantity * product.price);
                    productPanier.quantity = newQuantity;
                } else {
                    totalQuantity = totalQuantity + productPanier.quantity;
                    totalPrice = totalPrice + (productPanier.quantity * product.price);
                }
                
                totalQuantitySelector.innerText = totalQuantity;
                totalPriceSelector.innerText = totalPrice;

                window.localStorage.setItem("panier", JSON.stringify(panier));
                
            })
        })  
    }
    
}

function deleteProduct(event) {   // Mise à jour de la quantité totale et le prix total du produits suite à une suppression des uns
    let targetElement = event.target;
    let articleElement = targetElement.closest(".cart__item");
    let productId = articleElement.getAttribute("data-id");
    let productColor = articleElement.getAttribute("data-color");
    console.log("Appel reçu suite suppresion produit");
    console.log(productId);
    console.log(productColor);
    let productQuantitySelector = articleElement.querySelector('.itemQuantity');
    let productDescriptionSelector = articleElement.querySelector('.cart__item__content__description');
    let productPriceSelector = productDescriptionSelector.children[2];
    let totalQuantitySelector = document.getElementById("totalQuantity");
    let totalPriceSelector = document.getElementById("totalPrice");
    let totalPrice = parseInt(totalPriceSelector.innerText) - (parseInt(productQuantitySelector.value) * parseInt(productPriceSelector.textContent));
    let totalQuantity = parseInt(totalQuantitySelector.innerText) - parseInt(productQuantitySelector.value);

    totalQuantitySelector.innerText = totalQuantity;
    totalPriceSelector.innerText = totalPrice;
    let panierJson = window.localStorage.getItem("panier");
    let panier = JSON.parse(panierJson);
    let updatedPanier = new Array();
    panier.forEach(function (product) {
        if(product.id !== productId && product.color !== productColor) {
            updatedPanier.push(product);
        }
    });
    window.localStorage.setItem("panier", JSON.stringify(updatedPanier));
    articleElement.remove();
}

function passerCommande(event) { // On récupére et on analyse les données saisies par l'utilisateur dans le formulaire 
  let firstNameSelector = document.getElementById("firstName"); 
  let firstNameErrorMsgSelector = document.getElementById("firstNameErrorMsg")
  let lastNameSelector = document.getElementById("lastName");
  let lastNameErrorMsgSelector = document.getElementById("lastNameErrorMsg")
  let addressSelector = document.getElementById("address");
  let addressErrorMsgSelector = document.getElementById("addressErrorMsg")
  let citySelector = document.getElementById("city");
  let cityErrorMsgSelector = document.getElementById("cityErrorMsg")
  let emailSelector = document.getElementById("email");
  let emailErrorMsgSelector = document.getElementById("emailErrorMsg")
  
  let error = false;

  if (validateName(firstNameSelector.value)) {
    firstNameErrorMsgSelector.innerText = "";
  } else {
    firstNameErrorMsgSelector.innerText = "merci de saisir le prénom";
    error = true;
  }
 
  if (validateName(lastNameSelector.value)){
    lastNameErrorMsgSelector.innerText = "";
  } else {
    lastNameErrorMsgSelector.innerText = "merci de saisir le nom";
    error = true;
  }
  if (validateInputNotEmpty(addressSelector.value)){
    addressErrorMsgSelector.innerText = "";
  } else {
    addressErrorMsgSelector.innerText = "merci de saisir l \'address";
    error = true;
  }
  if (validateInputNotEmpty(citySelector.value)){
    cityErrorMsgSelector.innerText = "";
  } else {
    cityErrorMsgSelector.innerText = "merci de saisir le city";
    error = true;
  }
  if (emailSelector.value == '') {
    emailErrorMsgSelector.innerText = "merci de saisir l \'email";
    error = true;
  } else if(validateEmail(emailSelector.value)) {
    emailErrorMsgSelector.innerText = "";
  } else {
    emailErrorMsgSelector.innerText = "veuillez inserer  une adresse email valide";
    error = true;
  }
  
  if(error == true) {
    event.preventDefault();
    return false;
  }
  let panierJson = window.localStorage.getItem("panier");
  let panier = JSON.parse(panierJson);
  let productIds = [];
  panier.forEach(function (productPanier) {
    productIds.push(productPanier.id);
  })
  let commandeDetails = {  // On cré l'objet contact et un tableau de  produits 
    "contact": { 
        "firstName": firstNameSelector.value,
        "lastName": lastNameSelector.value,
        "address": addressSelector.value,
        "city": citySelector.value,
        "email": emailSelector.value
      },
    "products": productIds 
  }
  submit(commandeDetails);
}

let commanderSelector = document.getElementById("order");
commanderSelector.addEventListener('click', function (event) {
    passerCommande(event);
});


function validateInputNotEmpty(text) {
  text = text.replace(/\s/g, '');
  let  regexEmpty = "^\s*$";
  if(text.match(regexEmpty) == null) {
    return true;  
  } else {
    return false;
  }
}

function validateName(text) {
  const inputRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
  if(inputRegex.test(text)) {
    return true;  
  } else {
    return false;
  }
}

function validateEmail(email) {  // On vérifie les données saisie par l'utilsateur pour le champ email du formulaire
  let regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(regexemail) == null) {
      return false;  
  } else {
      return true;
  }
}

function submit(commandeDetails) {  // On effectue une requete POST sur l'API, on récpére l'id du commande et on se redirige vers la page de confirmation qui affiche le numéro du commande 
    fetch('http://localhost:3000/api/products/order', 
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body: JSON.stringify(commandeDetails)
        })
        .then(response => response.json())
        .then(result => {
            window.localStorage.removeItem("panier");
            location.href = 'confirmation.html?id=' + result.orderId;
        });
}

ajoutAuPanier();
