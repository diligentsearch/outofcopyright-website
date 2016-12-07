OutOfCopyright Configuration
==========


## Apache configuration

In order to make the project work locally, a specific Apache configuration is needed

### Linux and Apache2

Go to /etc/apache2/sites-available
Activate your Root access if not already done



Get the default configuration pattern and create a new one from it and edit it (for example 001-diligentsearch.conf)

	mv 000-default.conf 001-diligentsearch.conf

Enable serverName 
	
	serverName diligentsearch.local

Set the DirectoryRoot to the location of the index.html master main file of project
	
	DocumentRoot /home/user/diligent-search
	<Directory /home/user/diligent-search>
	        Require all granted
	</Directory>
	ProxyPass "/node" "http://localhost:8000/"
	ProxyPassReverse "/node" "http://localhost:8000/"

*There is no final slash '/' at the end of the DocumentRoot*

The 8000 port is used by default in several nodeJS servers.

The '/node' route is required to perform POST requests to the Github api on the given repo.

Enable this new apache2 configuration with the following commands

	a2ensite 001-diligentsearch.conf

	service apache2 reload


Set the serverName used as a valid IP address

	nano /etc/hosts
	127.0.0.1	diligentsearch.local

The index.html file located in /home/user/diligent-search will be available at the diligentsearch.local URL


## Github Configuration

The project is based on the GitHub API, requires you to have a GitHub account with an associated token.

You also need to have forked at least the outofcopyright-files repo as you will pull data from its different branches

### API Access 

Create a file under named 'credential_github.js' inside the folder outofcopyright/js/lib/github/
This file will have the following content :

	TOKEN 		= "776378.......43b4";
	AUTH		= "oauth";
	USERNAME	= "your_username";
	REPONAME	= "outofcopyright-files";
	BRANCH 		= "Netherlands"

### Test your GitHub API access

Run the nodeJS server handling the route '/node'

	cd outofcopyright/js/ && node github_app.js

Go to diligentsearch.local/node : 

	'Github Management' and further information will be displayed

Go to diligentsearch.local and select the first link Countries list :

	a list of countries will be displayed in the left panel and a changelog on the right side of the screen.	