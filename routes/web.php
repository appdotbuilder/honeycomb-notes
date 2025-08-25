<?php

use App\Http\Controllers\Api\NoteSearchController;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Main note-taking app on home page
Route::get('/', function () {
    if (auth()->check()) {
        return app(NoteController::class)->index(request());
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Notes resource routes
    Route::resource('notes', NoteController::class);
    
    // API routes for search and autocomplete
    Route::get('api/notes/search', [NoteSearchController::class, 'index'])->name('notes.search');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
