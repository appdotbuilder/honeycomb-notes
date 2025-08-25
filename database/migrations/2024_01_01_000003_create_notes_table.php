<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->json('tags')->nullable()->comment('Array of tags associated with the note');
            $table->string('folder')->nullable()->comment('Folder path for organization');
            $table->json('metadata')->nullable()->comment('Additional metadata for the note');
            $table->boolean('is_favorite')->default(false);
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index('title');
            $table->index('folder');
            $table->index('is_favorite');
            // Full-text search index (commented out for SQLite compatibility)
            // $table->fullText(['title', 'content']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};