<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $fillable = [
        'hero_title', 'hero_subtitle', 'about_intro', 
        'about_history', 'about_vision', 'contact_email', 'contact_instagram'
    ];
}