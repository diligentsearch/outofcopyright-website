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

//Récupération de la liste des nomns des différents diagramme
function getListSubgraph(){
	var result = [];
	for(var i = 0; i < file.subgraph.length; i++){
		result.push(file.subgraph[i].graphName);
	}
	return result;
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