//L'affichage de numero de commande
const id = getFromUrl('order');
display(id)
localStorage.clear();

function display(orderId){
    const orderIdelement = document.querySelector("#orderId")
    orderIdelement.textContent = orderId
}