
function ajoutAuPanier() {
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

function updateTotalQuantity(event) {
    let targetElement = event.target;
    let newQuantity = parseInt(targetElement.value);
    let articleElement = targetElement.closest(".cart__item");
    let currentProductId = articleElement.getAttribute("data-id");

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
                if(product._id == currentProductId) {
                    console.log("Product Found")
                    totalQuantity = totalQuantity + newQuantity;
                    totalPrice = totalPrice + (newQuantity * product.price);
                } else {
                    totalQuantity = totalQuantity + productPanier.quantity;
                    totalPrice = totalPrice + (productPanier.quantity * product.price);
                }
                
                productPanier.quantity = newQuantity;
                totalQuantitySelector.innerText = totalQuantity;
                totalPriceSelector.innerText = totalPrice;

                window.localStorage.setItem("panier", JSON.stringify(panier));
                
            })
        })  
    }
    
}

function deleteProduct(event) {
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


function valider()

	{

    if (document.getElementById('firstName') == ""){
	alert ("Veuillez entrer votre firstName!");
	return false;
    }

    if (document.getElementById('lastName') == ""){
     alert ("Veuillez entrer votre lastName!");
     return false;
    }

    if (document.getElementById('email') == ""){
    alert ("Veuillez entrer votre email!");
      return false;
    }

    if (document.getElementById('order') == ""){
    alert ("Veuillez commander!");
       return false;
    }

}

ajoutAuPanier();
