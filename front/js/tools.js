// La fonction me permet d'afficher le montant en euro
function formatPrice(amount) 
{
    const formatter =new Intl.NumberFormat ('fr-FR', {
        style : 'currency',
        currency : 'EUR',
        
    });
    return formatter.format(amount);
}
//la fonction est repris sur produit.js et confirmation.js
function getFromUrl(key)
{
    const url = new URL(window.location.href);
    return  url.searchParams.get(key);
}