<?php
/**
 * subday — Authentication & CSRF
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function is_admin(): bool {
    return !empty($_SESSION['admin_logged_in']);
}

function require_admin(): void {
    if (!is_admin()) {
        header('Location: /admin/login.php');
        exit;
    }
}

function admin_login(string $user, string $pass): bool {
    if ($user === ADMIN_USER && password_verify($pass, get_admin_hash())) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $user;
        return true;
    }
    return false;
}

function admin_logout(): void {
    $_SESSION = [];
    session_destroy();
}

function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(?string $token): bool {
    if (empty($token) || empty($_SESSION['csrf_token'])) return false;
    return hash_equals($_SESSION['csrf_token'], $token);
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}
