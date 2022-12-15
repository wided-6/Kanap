const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');

/**
 * Get the product.
 */
function getProduct() {
    fetch("http://localhost:3000/api/products/" + productId)
        .then(function (response) {
            return response.json()
        }).then(function (product) {

            document.title = product.name;

            let itemImgSelector = document.getElementsByClassName("item__img");
            let productImageSelector = document.createElement("img");
            productImageSelector.src = product.imageUrl;
            productImageSelector.alt = product.altTxt;
            itemImgSelector[0].appendChild(productImageSelector);

            let itemTitleSelector = document.getElementById("title");
            itemTitleSelector.innerText = product.name;

            let itemPriceSelector = document.getElementById("price");
            itemPriceSelector.innerText = product.price;

            let itemDescriptionSelector = document.getElementById("description");
            itemDescriptionSelector.innerText = product.description;

            let itemColorsSelector = document.getElementById("colors");
            product.colors.forEach(function (productColor) {
                let itemColorOptionSelector = document.createElement("option");
                itemColorOptionSelector.value = productColor;
                itemColorOptionSelector.innerText = productColor;
                itemColorsSelector.appendChild(itemColorOptionSelector);
            });


        }).catch((e) => {
            document.title = "Nom du produit";
            let message = "Ce produit n'exstite pas ou n'est pas disponible pour le moment"
            let itemSelector = document.getElementsByClassName("item");
            itemSelector[0].innerHTML = message;
        });
}

function addProductToCart() {
    let addToCartSelector = document.getElementById("addToCart");
    addToCartSelector.addEventListener("click", function (e) {
        e.preventDefault();
        let productColorSelector = document.getElementById("colors");
        let productQuantitySelector = document.getElementById("quantity");

        let productColor = productColorSelector.value;
        let productQuantity = parseInt(productQuantitySelector.value);

        if (productColor == "" || productColor == undefined) {
            alert("Veuillez sélectionner une couleur valide avant d'ajouter le produit au panier");
            return;
        }

        if (productQuantity <= 0 || productQuantity > 100 || productColor == undefined) {
            alert("Veuillez sélectionner une quantité valide (comprise entre 1 et 100) avant d'ajouter le produit au panier");
            return;
        }

        console.log(productColor, productQuantity);

        let newProduct =  {
            "id": productId,
            "quantity": productQuantity,
            "color": productColor
          };

        let panier;
        let panierJson = window.localStorage.getItem("panier");
        
        if(panierJson == null) {
            panier = new Array();
            panier.push(newProduct);
        } else {
            panier = JSON.parse(panierJson)
            let productExist = false;
            panier.forEach(function (product) {
                if(product.id == newProduct.id && product.color == newProduct.color) {
                    product.quantity = product.quantity  + newProduct.quantity
                    productExist = true;
                }
            });
            if(productExist == false) {
                panier.push(newProduct);
            }  
        }
        window.localStorage.setItem("panier", JSON.stringify(panier));

        alert("Produit ajouté au panier !");

    });

}

getProduct();

addProductToCart();