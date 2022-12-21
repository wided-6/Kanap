
function AjoutAuPanier() {
    let panier;
    let panierJson = window.localStorage.getItem("panier");
    if(panierJson != null) {
        panier = JSON.parse(panierJson)
        console.log(panier)

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
        
            });
    
        });

    }

    
}

AjoutAuPanier();