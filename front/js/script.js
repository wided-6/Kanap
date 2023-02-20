
/*function getProducts() {
    fetch("http://localhost:3000/api/products")
        .then(function(response){
            return response.json()
        }).then(function(data) {
            console.log(data);
            const items = document.getElementById("items");

            let produitshtml = '';
            for(let i=0; i<data.length; i++) {
               produitshtml = produitshtml + "<a href=\"./product.html?id=" + data[i].id + "\">" +
               "<article>" +
               "<img src="+ data[i].imageUrl +" alt=" + data[i].alt + "\">" + 
               "<h3 class=\"productName\">" + data[i].name + "</h3>" +
               "<p class=\"productDescription\">" + data[i].description + "</p>"
               "</article>" +
               "</a>";
            }

            items.innerHTML = produitshtml;
            
        });
}

getProducts();*/

const itemsSelector = document.getElementById("items");


/**
 * Get the products.
 */
function getProducts() {    // On récupére les produits de l'API et on les insére dans la page d'accueil
    fetch("http://localhost:3000/api/products")
        .then(function (response) {
            return response.json()
        }).then(function (products) {

             products.forEach(function (product) {

                 let productLinkSelector = document.createElement("a");
                 productLinkSelector.href = "product.html?id=" + product._id
                 let productArticleSelector = document.createElement("article");
                 let productImageSelector = document.createElement("img");
                 productImageSelector.src = product.imageUrl;
                 productImageSelector.alt = product.altTxt;
                 let productNameSelector = document.createElement("h3");
                 productNameSelector.classList.add("productName");
                 productNameSelector.innerText = product.name;
                 let productDescriptionSelector = document.createElement("p");
                 productDescriptionSelector.classList.add("productDescription");
                 productDescriptionSelector.innerText = product.description;
                 productArticleSelector.appendChild(productImageSelector);
                 productArticleSelector.appendChild(productNameSelector);
                 productArticleSelector.appendChild(productDescriptionSelector);
                 productLinkSelector.appendChild(productArticleSelector);
                 itemsSelector.appendChild(productLinkSelector);

             });


           /* let productsHTML = '';

            products.forEach(function (product) {
                productsHTML += `<a href="./product.html?id=${product._id}">
                <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
                </article>
              </a>`
            });

            items.innerHTML = productsHTML; */

        }).catch((e) => {

            let message = "Une erreur est survenue lors de la récupération des produits.";
            alert(message);
            console.log(message);
            let errorSelector = document.createElement("p");
            errorSelector.innerHTML = message;
            errorSelector.style.color = "red";
            itemsSelector.appendChild(errorSelector);

        });
}

getProducts();


