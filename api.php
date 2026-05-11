<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

/*
| Route untuk sinkronisasi admin.js
*/

Route::get('/export-all', [ApiController::class, 'getData']);
Route::post('/bulk-import', [ApiController::class, 'saveData']);