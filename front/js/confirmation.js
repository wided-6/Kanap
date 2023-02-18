const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const orderId = urlParams.get('id');

let orderIdSelector = document.getElementById('orderId');
orderIdSelector.innerText= orderId;  // affichage du numéro de commande dans la page de confirmation
