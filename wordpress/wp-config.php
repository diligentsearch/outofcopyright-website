<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'reloaded');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '3fVA-R90_*Hg.i{z]ITVi2dlR{FO~nu>`<9zgSBED%4IV9;[2gi%iJa|B{,mZwl@');
define('SECURE_AUTH_KEY',  '[L9W,,csO`&e=4wS$W0|+1kx#/OQlc,J]ig+cAQNP4.;Ium,;BE]o;yNu#3quT4:');
define('LOGGED_IN_KEY',    '}qRf$a}S{ie]&hgK];E=BdfE^vL+K-io[O-gjs>dz_RJTLlng&CiNX*N?;6za;os');
define('NONCE_KEY',        '8D0c,c5VWQp;/@wUY!ir_R^XsS^{S]q;#1f|dLgs>n7Sfa8|/~zC?cwNe/a`2# z');
define('AUTH_SALT',        '~Z>6lkOf{fMsI+ug:zt@VVK7DW*,+>rzSksP*xX3w4<ac->V=`1EnHQpt>Aej$Jm');
define('SECURE_AUTH_SALT', '%y/#}rUDP9;*KKO*ciA;];9mpX#P}i1Lg_Md+?k)Gcs|2vH]bI80HS?}s7}N+e:Q');
define('LOGGED_IN_SALT',   '$~D1@Qhwll jl&x4]8jlc>mU:)oTx1skVG=]jYP`^r,TYADo,nJZe6>?`F.JI2]8');
define('NONCE_SALT',       'p>%8iLSpEEn!%0xxV.w_YCAs7VVb&}R83iWA{r-@{Ei4upA3(~@zsH..734*>Wlo');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
