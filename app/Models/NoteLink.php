<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\NoteLink
 *
 * @property int $id
 * @property int $from_note_id
 * @property int $to_note_id
 * @property string $link_text
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Note $fromNote
 * @property-read \App\Models\Note $toNote
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink query()
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink whereFromNoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink whereToNoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink whereLinkText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NoteLink whereUpdatedAt($value)
 * @method static \Database\Factories\NoteLinkFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class NoteLink extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'from_note_id',
        'to_note_id',
        'link_text',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the note this link originates from.
     */
    public function fromNote(): BelongsTo
    {
        return $this->belongsTo(Note::class, 'from_note_id');
    }

    /**
     * Get the note this link points to.
     */
    public function toNote(): BelongsTo
    {
        return $this->belongsTo(Note::class, 'to_note_id');
    }
}