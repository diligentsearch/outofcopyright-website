if (typeof require !== 'undefined') {
    var Github = module.exports;
}

var github = new Github({
  token: TOKEN,
  auth: AUTH
});

var content = '';    

var repo = github.getRepo(USERNAME, REPONAME);

// Update a specific remote file on a specific remote branch
function updateFile(pays, fileName, content, commitText){
    console.log("update");
    console.log(content);
    repo.write(BRANCH, 
        pays+'/'+fileName, 
        content, 
        commitText, 
        function(err) { 
            console.log("err ");
            console.log(err);
            if(err != null){
                console.log("err.error ");
                console.log(err.error);
                if(err.error == 409){
                    console.log('Try second');
                    console.log(pays+'/'+fileName);
                    console.log(content);
                    console.log(commitText);
                    repo.write(BRANCH, pays+'/'+fileName, content, commitText, function(err) {
                        console.log("err 2 ");
                        console.log(err);
                    });
                }
            }
            
        });
}

// Used to get back files preseting diagrams / country / traduction data
function readFile(pays, fileName, callback){
    console.log("read");
    repo.read(BRANCH, pays+'/'+fileName, 
        function(err, data) {
            callback(data);
        }
    );
    
}

function readFileOnly(repName, fileName, callback){
    console.log("readOnly");
    var repoOnly = github.getRepo(USERNAME, repName);
    repoOnly.read(BRANCH, fileName, 
        function(err, data) {
            callback(data);
        }
    );  
}

// Write new file and commit push
function writeFile(pays, fileName, content, commitText){
    console.log("write");
    repo.write(BRANCH, pays+'/'+fileName, content, commitText, function(err) {
        console.log("err ");
        console.log(err);
        console.log("err.error ");
        console.log(err.error);
        if(err.error == 409){
            console.log('Try second');
            console.log(pays+'/'+fileName);
            console.log(content);
            console.log(commitText);
            repo.write(BRANCH, pays+'/'+fileName, content, commitText, function(err) {
                console.log("err 2 ");
                console.log(err);
            });
        }
    });
}

// Delete file on remote side
function deleteFile(pays, fileName){
    repo.remove(BRANCH, pays+'/'+fileName, function(err) {});
}
// Get back repository information
function repoShow(){
    repo.show(BRANCH, function(err, repo) {console.log(repo);});
}

// Get back the Git Tree (all he files ofa specific branch)
function getTree(){
    repo.getTree(BRANCH, function(err, tree) {console.log(tree);});
}

// Get back countries based on the name of the branch
function getCountries(callback){
    repo.listBranches(function(err, tree) {
        var listCountries = [];
        console.log(tree);
        for(var i = 0; i < tree.length; i++){
            if(tree[i] != "master"){
                listCountries.push(tree[i]);
            }
        }
        callback(listCountries);
    });
}


function getGist(){
    var user = github.getUser();
    user.userGists(USERNAME, function(err, gists) { console.log(gists);});
}

// Read issues published on the Git repository
function readIssues(){
    var issues = github.getIssues(USERNAME, REPONAME);
    issues.list(options, function(err, issues) { console.log(issues); });
}

// Get back commits related to a specific file
function commits(pays, fileName, callback){
    repo.commits(pays+'/'+fileName, function(err, commits){ 
        callback(commits);
    });
}

// Merge a child branch into its parent
function merge(branch, child_branch, message){
    repo.merge(branch, child_branch, message);
}

