sudo cp -R outofcopyright/* /var/www/html/outofcopyright/;

sudo cp -R outofcopyright/js /var/www/html/wordpress/wp-content/themes/govpress-child/;

sudo cp -R outofcopyright/css /var/www/html/wordpress/wp-content/themes/govpress-child/;

sudo cp -R outofcopyright/librairie /var/www/html/wordpress/wp-content/themes/govpress-child/;

sudo cp -R govpress-child/* /var/www/html/wordpress/wp-content/themes/govpress-child/;

sudo cp print-diagram.html /var/www/html/wordpress/

cd /var/www/html/outofcopyright/api/;
forever stop server.js;
forever start server.js;

cd /var/www/html/outofcopyright/management_file/;
forever stop github.js;
forever start github.js;

cd ~/outofcopyright-website/;

