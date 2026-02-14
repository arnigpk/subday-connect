<?php
/**
 * subday — Configuration
 */

define('SITE_NAME', 'subday');
define('BASE_PATH', dirname(__DIR__));
define('DATA_PATH', BASE_PATH . '/data');
define('UPLOADS_PATH', BASE_PATH . '/uploads');
define('UPLOADS_URL', '/uploads');

// Default admin credentials — CHANGE PASSWORD after first login!
define('ADMIN_USER', 'admin');
// Default password: admin123
define('ADMIN_PASS_HASH', '$2y$10$YourHashHere');

// To generate a new hash, visit /admin/login.php and use the temp tool,
// or run: php -r "echo password_hash('YOUR_PASSWORD', PASSWORD_DEFAULT);"
// Then replace ADMIN_PASS_HASH above.

// Fallback: if hash looks like placeholder, accept "admin123"
function get_admin_hash(): string {
    if (str_contains(ADMIN_PASS_HASH, 'YourHashHere')) {
        return password_hash('admin123', PASSWORD_DEFAULT);
    }
    return ADMIN_PASS_HASH;
}

define('LANGUAGES', ['ru', 'kz']);
define('DEFAULT_LANG', 'ru');
