sudo cp -R outofcopyright/* /var/www/html/outofcopyright/;

sudo cp wordpress/wp-content/themes/govpress/header.php /var/www/html/wordpress/wp-content/themes/govpress/header.php;

sudo cp wordpress/wp-content/themes/govpress/templates/countries-list.php /var/www/html/wordpress/wp-content/themes/govpress/templates/countries-list.php;

sudo cp wordpress/wp-content/themes/govpress/templates/diagram-editor.php /var/www/html/wordpress/wp-content/themes/govpress/templates/diagram-editor.php;

cd /var/www/html/outofcopyright/api/;
forever stop server.js;
forever start server.js;

cd /var/www/html/outofcopyright/management_file/;
forever stop github.js;
forever start github.js;

cd /home/jj/outofcopyright-website/;

