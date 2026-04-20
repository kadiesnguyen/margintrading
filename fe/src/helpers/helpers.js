function formatPrice(value, minimum) {
    try{
        var formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minimum
        });
        return formatter.format(value);
    }
    catch{
        return value;
    }
   
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function checkRole(role){
    try{
        const token = localStorage.getItem("token");
        // console.log(parseJwt(token));
        return parseJwt(token).result.permissions.includes(role) || parseJwt(token).result.x == 1;
        
    }
    catch(err){
        return false;
    }
}

export { formatPrice, parseJwt, checkRole }