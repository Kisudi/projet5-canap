//Je recupère les produits sur le localstorage
const iscart = ! localStorage.getItem("products");
if (iscart){
    document.querySelector("h1").innerText = "il n'y a pas d'article"
    document.querySelector(".cart").remove();
}else {
    // L'affichage des produits
    fetch(`http://localhost:3000/api/products`)
   .then((res) => res.json())
   .then((data) =>
   {
    const products = buildcompleteliste(data, JSON.parse(localStorage.getItem("products")));
    display(products)
    listenforqtychange(products)
    displaycarttotal(products)
    deletefromcart(products)
    saveorder(products) 
   
   });
}
//La mise à jour des données 
function buildcompleteliste(all, cart) {
    const list = [];
    cart.forEach(item => {
        const product = all.find(a=>a._id == item.id);
        const article ={ ...product };
        article.qty = Number(item.qty);
        article.color = item.color
        list.push(article)
    });
    return list;
}
//L'enregistrement dans le localstorage
function display(products) {
    products.forEach(product =>{
        document.querySelector("#cart__items").innerHTML +=`
        <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${formatPrice(product.price)} </p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                       <p>Qté : </p>
                       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                       <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article> 
        
        `
    })
    
}
//La recuperation des articles dans le localstorage
function listenforqtychange(products) {
    products.forEach(product =>{
        const input = document.querySelector(`.cart__item[ data-id="${product._id}"][data-color="${product.color}"] .itemQuantity`)
        input.addEventListener("input", (e)=>
        {
            const newqty = e.target.value;
            const cart = JSON.parse(localStorage.getItem("products"));
            const item = cart.find(a=>a._id== product.id && a.color == product.color);
            item.qty =Number(newqty);
            localStorage.setItem("products", JSON.stringify(cart))
            location.reload();

        })
    })
    
}

//La fonction permet de supprimer des articles dans le panier
function deletefromcart(products) {
    products.forEach(product =>{
        const button = document.querySelector(`.cart__item[ data-id="${product._id}"][data-color="${product.color}"] .deleteItem `)
        button.addEventListener("click", (e)=>
        {
            const cart = JSON.parse(localStorage.getItem("products"));
            const index = cart.find(a=>a._id== product.id && a.color == product.color);
            cart.splice(index, 1)
            localStorage.setItem("products", JSON.stringify(cart))
            location.reload();
        })
    })
    
}

//L'affichage de total panier et la quantité 
function displaycarttotal(products) 
{
    const totalprice=products.reduce(( total, product) => total + Number(product.price) * Number(product.qty), 0)
    const totalQty = products.reduce(( total, product) => total + Number(product.qty), 0)
    document.querySelector("#totalPrice").innerText =formatPrice(totalprice)
    document.querySelector("#totalQuantity").innerText =totalQty  
}

//Je veux écouter le bouton commandé et faire le controle du formulaire
function saveorder(products) 
{ 
    const order = document.querySelector("#order").addEventListener("click", (e)=>
    {
        e.preventDefault()
        hideError('firstName');
        hideError("lastName");
        hideError("address");
        hideError("city");
        hideError("email");
        if (!isfirstNamevalid()){
            showError("firstName","Merci de corriger le champs ci-dessus");
            return;      
        }
        if (!islastNamevalid()){
            showError("lastName","Merci de corriger le champs ci-dessus");
            return;      
        }
        if (!isaddressvalid()){
            showError("address","Merci de corriger le champs ci-dessus");
            return;      
        }
        if (!iscityvalid()){
            showError("city","Merci de corriger le champs ci-dessus");
            return;      
        }
        if (!isemailvalid()){
            showError("email","Merci de corriger le champs ci-dessus");
            return;      
        } 
        //
        const contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value, 
            city : city.value, 
            email:email.value
        };
        const ids = JSON.parse(localStorage.getItem("products")).map(a => a.id)
        const payload = {
            contact : contact,
            products: ids
        }
        fetch("http://localhost:3000/api/products/order",{
            method: "POST",
            body: JSON.stringify(payload ),
            headers:{
                "content-type" : "application/json"
            }
        })
            .then((res)=> res.json())
            .then((data) =>
            {
                console.log(data);
                window.location.href ="confirmation.html?order=" + data.orderId
            })
                  
    })  
    
}

function getids() {
    const numberofproducts = localStorage.length
    console.log(numberofproducts);
    const ids = []
    for (let i = 0;i< numberofproducts; i++){
        const key = localStorage.key(i)
        const id = key.split("-")[0]
        ids.push(id)
    }
}

//La fonction me permet d'afficher le message d'erreur si le champ est mal saisie
function hideError(fieldName){
    document.querySelector('p#' + fieldName + 'ErrorMsg').innerText = ""
} 
function showError (fieldName, message){
    document.querySelector('p#' + fieldName + 'ErrorMsg').innerText = message
}

/* j'ai utilisée le regex pour controler le noms et le mail
   - Et si le champ est mal saisie le message d'erreur devra s'affiché 
   -Et sinon le curseur passera au suivant, ou le formulaire va s'enregistrer*/

function isfirstNamevalid() {
    const firstName = document.querySelector("#firstName").value.trim(" ")
    
    if (firstName.length < 3){
        return false
    }
    return true;
}
function islastNamevalid() {
    const lastName = document.querySelector("#lastName").value.trim(" ")
    if (lastName.length < 3){
        return false
    }
    return true;
}
function isaddressvalid() {
    const address = document.querySelector("#address").value.trim(" ")
    if (address.length < 3){
        return false
    }
    return true;
}
function iscityvalid() {
    const city = document.querySelector("#city").value.trim(" ")
    if (city.length < 3){
        return false
    }
    return true;
}
function isemailvalid(){
    
    const email = document.querySelector("#email").value.trim(" ")
    let regex =/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (regex.test(email)=== false){
        
        return false
    }
    return true;
}
    
