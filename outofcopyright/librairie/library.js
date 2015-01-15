var file;

//Introduit le JSON en mémoire
function parseJSON(content){

	file = JSON.parse(content);

}

//Construit un objet avec les informations général
function generalInformation(){
	var informations = new Object();
	informations.country = file.country;
	informations.contributors = file.contributors;
	informations.language = file.language;
	informations.default_language = file.default_language;

	return informations;
}

//Initialisation d'un fichier avec les informations de base.
function initializeNewCountry(country, contributors, languages, default_language){
	file = {
	    "country":country,
	    "contributors":contributors,
	    "language":languages,
	    "default_language": default_language,
	    "subgraph":[],
	    "datapoints":[]
	};
}

//Assignation d'un pays
function setCountry(country){
	file.country = country;
}

//Récupération du pays
function getCountry(){
	return file.country;
}

//Assignation des contributeurs
function setCountributors(contributors){
	file.contributors = contributors;
}

//Récupération des contributeurs
function getCountributors(){
	return file.contributors;
}

//Assignations des langues
function setLanguages(language){
	file.language = language;
}

//Récupération des langues
function getLanguages(){
	return file.language;
}

//Assignation de la langue par défaut
function setDefaultLanguage(default_language){
	file.default_language = default_language;
}

//Récupération de la langue par défaut
function getDefaultLanguage(){
	return file.default_language;
}

//Récupération de la liste des noms des différents diagramme
function getListSubgraph(){
	var result = [];
	for(var i = 0; i < file.subgraph.length; i++){
		result.push(file.subgraph[i].graphName);
	}
	return result;
}

function getListSubgraphByName(subgraphName){

	for(var i = 0; i < file.subgraph.length; i++){
		if(file.subgraph[i].graphName == subgraphName)
		{
			return i;
		}
	}

}

//Ajout d'un nouveau diagramme.
function addNewTypeOfWork(name){
	file.subgraph.push({
		"graphName":name,
            "nodes":
            	[
            		{
	                    "id": newNodeId(), 
	                    "type":null, 
	                    "text":"",
	                    "inputs":[], 
	                    "start":true, 
	                    "responses":[]
                	}
            	]
	})
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatString(string){
	var str = string.replace(/\!/g,'');
	str = str.replace(/\?/g,'');
	str = str.replace(/ /g,'_');
	str = str.replace(/'/g,'_');
	str = str.replace(/-/g,'_');
	str = str.replace(/,/g,'_');
	str = str.replace(/\//g,'_');
	str = str.replace(/\\/g,'_');
	str = str.replace(/\\/g,'_');
	str = str.replace(/\(/g,'_');
	str = str.replace(/\)/g,'_');
	str = str.replace(/"/g,'_');
	return str;
}

function formatStringInput(string){
	var str = string.replace(/"/g,'\\"');

	return str;
}

//Retourne le sha du premier commit commun entre deux branches
function linkCommits(commitsMaster, commitsChild){
    for(var i = 0; i < commitsMaster.length; i++){
        for(var j = 0; j < commitsChild.length; j++){
            if(commitsChild[i].sha == commitsMaster[j].sha){
                return commitsChild[i].sha;
            }
        }
    }
}
