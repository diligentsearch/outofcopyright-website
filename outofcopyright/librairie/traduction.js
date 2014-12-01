var bibliotheque = [];
var traductionData;
/*
    Récupération d'une traduction à  partir de la langue et de l'id de la tracduction que l'on souhaite
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
        try{
            console.log("trad."+formatString(key));
            result = eval("trad."+formatString(key));
        }catch(err){
            result = key;
            console.log('error trad');
        }
    }

    if(result === undefined){
            result = '';
    }

    return result;
}

/*
    Vérification de la cohérence des fichiers de traduction et ménage
*/
function cleaningTraduction(){
    for(var i = 0; i < file.subgraph.length; i++) {
        for(var j = 0; j < file.subgraph[i].nodes.length; j++) {
            var node = file.subgraph[i].nodes[j]
            if(node.type == "final"){

            }
        }
    }
}