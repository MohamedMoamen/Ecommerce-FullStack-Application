<?php

use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Route::get('/', [LoginController::class, 'showLoginForm'])->name('login.form');
// Route::post('/login', [LoginController::class, 'login'])->name('login.submit');


Route::get('/', function () {
    return ("World");
});






