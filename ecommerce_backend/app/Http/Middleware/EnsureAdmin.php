<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Admin;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user || ! ($user instanceof Admin)) {
            return response()->json(['message' => 'Forbidden — not an admin'], 403);
        }

        return $next($request);
    }
}
