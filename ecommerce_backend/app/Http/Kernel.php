<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Route middleware aliases.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        // فقط middleware الخاص بالـ Admin
        'ensure.admin' => \App\Http\Middleware\EnsureAdmin::class,
        'auth' => \App\Http\Middleware\Authenticate::class, // لو محتاج auth:sanctum
    ];
}