//je Cherche les produits sur mon API avec la méthode fetch
fetch("http://localhost:3000/api/products",{
   method: "get"
})
   .then((res) => res.json())
   .then((data) => 
   {
     
// je fais une boucle pour afficher tous les produits
      data.forEach(product => 
         {
            console.log(product)
            const a = document.createElement("a")
            a.setAttribute("href", `./product.html?id=${product._id}`)
            document.querySelector("#items").appendChild(a)
            a.innerHTML += `
               <article>
                  <img src="${product.imageUrl}" alT="Lorem ipsum dolor sit amet, Kanap name1"/>
                  <h3 class="productName">${product.name}"</h3>
                  <p class="productDescription">${product.description}"</p>
               </article>
            `           
         })
   })
