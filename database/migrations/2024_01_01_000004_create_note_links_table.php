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
        Schema::create('note_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_note_id')->constrained('notes')->cascadeOnDelete();
            $table->foreignId('to_note_id')->constrained('notes')->cascadeOnDelete();
            $table->string('link_text')->comment('The text used in the [[link]] syntax');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('from_note_id');
            $table->index('to_note_id');
            $table->unique(['from_note_id', 'to_note_id', 'link_text']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_links');
    }
};