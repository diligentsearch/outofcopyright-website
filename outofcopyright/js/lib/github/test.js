var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "github.my-GHE-enabled-company.com",
    pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000
});
github.user.getFollowingFromUser({
    // optional:
    // headers: {
    //     "cookie": "blahblah"
    // },
    user: "mikedeboer"
}, function(err, res) {
    console.log(JSON.stringify(res));
});