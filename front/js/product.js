//Je recupere les informations du produit pour l'afficher sur la page
const id = getFromUrl ('id');
//J'utilise à nouveau la méthode fetch pour afficher les informations de la page produit
fetch(`http://localhost:3000/api/products/${id}`)
   .then((res) => res.json())
   .then((product) =>
    {
      console.log("product", product)
      
      display(product)
      listenforcart(product)
      
    })
//J'utilise la méthode catch en cas de rupture de stock
  .catch(e=>{
    document.querySelector("main").remove()
    alert('Ce produit n\'existe pas, vous serez rediriger vers la page d\'accueil')
    window.location.href ="index.html"
  })
// La fonction me permet de recuperer les infomation du produit sur API
function display(product){
      const image = document.querySelector(".item__img")
      image.innerHTML = `
      <img src="${product.imageUrl}" alt="Photographie d'un canapé">` 
      document.querySelector("#title").innerHTML = product.name
      document.querySelector("#description").innerHTML = product.description  
      document.querySelector("#price").innerHTML = product.price
      // Ici la boucle permet d'afficher la couleur de chaque article
      const select = document.querySelector("#colors")
      product.colors.forEach(color =>
           {
            select.innerHTML += `<option value ="${color}">${color}</option>`
            product.colors.value = color 
            
           })  
    }
//La foction reprend toutes les conditions pour ne pas qu'il ait la repetion des articles dans le panier
function listenforcart(product)
//j'écoute le bouton pour selectionner la couleur et la quantité
    {
      document.querySelector("#addToCart").addEventListener("click",() =>
      {
        const color = document.querySelector("#colors").value
        const quant =document.querySelector("#quantity").value
        //La condition renvoie une alerte pour que l'utilisateur selectonne au moins une couleur et une quantiter 
        if(color.length ===0){
          alert('selectionner une couleur')
          return
        }
        if (quant < 1 || quant> 100)
        {
          alert('Ajouer un produit entre 1 et 100')
          return
        }
        /*La condition permet à ce que le panier soit bien structurer, 
        en regroupant les article de même couleur par quantité demandé*/
        let products;
        if (!localStorage.getItem("products"))
        {
          products = [];
          const item ={
            id: product._id,
            qty: quant,
            color: color
          }
  
          products.push(item)
        }else{
          products = JSON.parse(localStorage.getItem("products"))
          const existingproduct = products.find (i => i.id === id && i.color === color);
          

          if (existingproduct){
            existingproduct.qty = Number(existingproduct.qty)+ Number(quant)
          }else{
            const item ={
              id: product._id,
              qty: quant,
              color: color
            }
    
            products.push(item)

          }
        }
        //Ici je sauvegarde les produits commandés pour l'afficher par la suite sur la page panier
        localStorage.setItem("products", JSON.stringify(products))
        alert('vous serez dirigé vers la page produit')
        window.location.href ="cart.html"

       
      })  
        

      
    }
 
  


  

 
  

     
         
  
