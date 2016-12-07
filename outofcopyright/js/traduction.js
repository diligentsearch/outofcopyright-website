// depends of library.js / string-utils.js


var bibliotheque = [];
var traductionData;
/*
    Récupération d'une traduction à  partir de la langue et de l'id de la tracduction que l'on souhaite
*/
function getTraduction(langue, key, server){
    var trad;
    var result;

    if( typeof key === 'boolean' ){
        if(key){
            key = 'True';
        }else{
            key = 'False';
        }
    }

    trad = traductionData;
    if(server == true){
            trad = JSON.parse(trad);
    }
    
    bibliotheque[langue] = trad;
   
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
function cleaningTranslation(tradData){
    var listTraduction = translationNecessary();

    var traduData = Object.keys(tradData);

    for(var i = 0; i < traduData.length; i++) {
        if(jQuery.inArray( traduData[i], listTraduction ) == -1){
            delete tradData[traduData[i]];
        }

    }

    return tradData;

}

function missingTranslation(tradData){
    var listTraduction = translationNecessary();
    var missingTraduction=[];

    tradData = Object.keys(tradData);

    for(var i = 0; i < listTraduction.length; i++) {
        if(jQuery.inArray( listTraduction[i], tradData ) == -1){
            if(listTraduction[i].substring(0, 4) == 'hint'){
                try{
                    eval("bibliotheque['"+languageChoosen+"']."+listTraduction[i]+" = ''");
                }catch(err){
                    console.log('catch error hint insert');
                }
            }else{
                if(listTraduction[i] != ""){
                    missingTraduction.push(listTraduction[i]);
                }  
            }
            
        }
    }
    return missingTraduction;
}

/*
    Traduction nécessaire au bon fonctionnement
*/
function translationNecessary(){
    var listTraduction = [];
    listTraduction.push("True");
    listTraduction.push("False");
    listTraduction.push("labelLangue");
    listTraduction.push("labelTypeOfWork");
    listTraduction.push("labelWarning");
    listTraduction.push("labelResponseIsNotANumber");
    for(var i = 0; i < file.subgraph.length; i++) {
        for(var j = 0; j < file.subgraph[i].nodes.length; j++) {
            var node = file.subgraph[i].nodes[j]
            if(jQuery.inArray( node.text, listTraduction ) == -1){
                listTraduction.push(node.text);
            }
        }
    }

    for(var i = 0; i < file.datapoints.length; i++) {
        var datapoint = file.datapoints[i];
        listTraduction.push("question_"+datapoint.id);
        listTraduction.push("hint_"+datapoint.id);
        if(file.datapoints[i].set !== undefined && file.datapoints[i].set !== null && file.datapoints[i].type == "list"){
            for(var j = 0; j < file.datapoints[i].set.length; j++) {
                var set = file.datapoints[i].set[j];
                var formatStr = formatString(set);
                if(jQuery.inArray( formatStr, listTraduction ) == -1){
                    listTraduction.push(formatStr);
                }
            }
        }
    }
    return listTraduction;
}

function getKeyByTrad(trad){
    getTraduction(file.default_language, "", true);
    console.log(bibliotheque[file.default_language]);
    var traduData = Object.keys(bibliotheque[file.default_language]);
    console.log("traduData");
    console.log(traduData);
    for(var i = 0; i < traduData.length; i++) {
        try{
            if(eval("bibliotheque[file.default_language]."+traduData[i]+" == '"+trad+"'")){
                return traduData[i];
            }
        }catch(err){
            console.log('error getKeyByTrad');
        }
    }
}

function KeyUnique(trad){
    var listTraduction = translationNecessary();
    var ok = false;
    var i = 0;
    while(!ok){
        if(jQuery.inArray( trad, listTraduction ) == -1){
            ok = true;
            return trad;
        }else{
            i++;
            trad = trad + i;
        }
    }
    
}
