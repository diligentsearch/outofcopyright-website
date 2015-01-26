<?php

add_filter('wp_nav_menu_items', 'add_login_logout_link', 10, 2);
function add_login_logout_link($items, $args) {
        ob_start();
        wp_loginout('index.php');
        $loginoutlink = ob_get_contents();
        ob_end_clean();
        $items .= '<li>'. $loginoutlink .'</li>';
    return $items;
}

add_filter( 'wp_nav_menu_items', 'qtrans_generateLanguageSelectCode_items', 10, 2);
$_SESSION['countMenu'] = 0;
function qtrans_generateLanguageSelectCode_items($items, $args) {
    try{
        if($_SESSION['countMenu'] == 0){
            $items = qtrans_generateLanguageSelectCode('image').$items;
            $_SESSION['countMenu']++;
        }
    } catch(Exception $e){
        return null;
    }
	

	return $items;
}
