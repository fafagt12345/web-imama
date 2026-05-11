<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->nullable();
            $table->string('hero_subtitle')->nullable();
            $table->text('about_intro')->nullable();
            $table->text('about_history')->nullable();
            $table->text('about_vision')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_instagram')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('site_contents'); }
};