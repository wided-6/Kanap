
function getProducts() {
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

getProducts();


