var bibliotheque = [];
var traductionData;
/*
        Récupération d'une traduction ?|  partir de la langue et de l'id de la tracduction que l'on souhaite
*/
function getTraduction(langue, key, server){
    var trad;
    var result;

    if(bibliotheque[langue] == undefined){

            trad = traductionData;
            if(server == true){
                    trad = JSON.parse(trad);
            }
            
            bibliotheque[langue] = trad;
    }else
    {
            trad = bibliotheque[langue];
    }
    if(key != ""){
            result = eval("trad."+key);
    }

    if(result === undefined){
            result = '';
    }

    return result;
}
