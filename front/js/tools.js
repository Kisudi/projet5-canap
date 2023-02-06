function formatPrice(amount) 
{
    const formatter =new Intl.NumberFormat ('fr-FR', {
        style : 'currency',
        currency : 'EUR',
        
    });
    return formatter.format(amount);
}

function getFromUrl(key)
{
    const url = new URL(window.location.href);
    return  url.searchParams.get(key);
}