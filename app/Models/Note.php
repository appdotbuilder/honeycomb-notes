<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\Note
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $content
 * @property array|null $tags
 * @property string|null $folder
 * @property array|null $metadata
 * @property bool $is_favorite
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\NoteLink[] $linksFrom
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\NoteLink[] $linksTo
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Note[] $linkedNotes
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Note[] $backlinkedNotes
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Note newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Note newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Note query()
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereTags($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereFolder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereIsFavorite($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Note favorites()
 * @method static \Illuminate\Database\Eloquent\Builder|Note inFolder($folder)
 * @method static \Illuminate\Database\Eloquent\Builder|Note withTag($tag)
 * @method static \Database\Factories\NoteFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Note extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'content',
        'tags',
        'folder',
        'metadata',
        'is_favorite',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
        'is_favorite' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the note.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get links from this note to other notes.
     */
    public function linksFrom(): HasMany
    {
        return $this->hasMany(NoteLink::class, 'from_note_id');
    }

    /**
     * Get links to this note from other notes.
     */
    public function linksTo(): HasMany
    {
        return $this->hasMany(NoteLink::class, 'to_note_id');
    }

    /**
     * Get notes that this note links to.
     */
    public function linkedNotes(): BelongsToMany
    {
        return $this->belongsToMany(Note::class, 'note_links', 'from_note_id', 'to_note_id')
            ->withPivot('link_text')
            ->withTimestamps();
    }

    /**
     * Get notes that link to this note.
     */
    public function backlinkedNotes(): BelongsToMany
    {
        return $this->belongsToMany(Note::class, 'note_links', 'to_note_id', 'from_note_id')
            ->withPivot('link_text')
            ->withTimestamps();
    }

    /**
     * Scope a query to only include favorite notes.
     */
    public function scopeFavorites($query)
    {
        return $query->where('is_favorite', true);
    }

    /**
     * Scope a query to notes in a specific folder.
     */
    public function scopeInFolder($query, $folder)
    {
        return $query->where('folder', $folder);
    }

    /**
     * Scope a query to notes with a specific tag.
     */
    public function scopeWithTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }
}