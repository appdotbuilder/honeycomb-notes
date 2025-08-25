<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Note::where('user_id', auth()->id())
            ->with(['linksFrom.toNote', 'linksTo.fromNote'])
            ->latest();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Filter by folder
        if ($request->filled('folder')) {
            $query->inFolder($request->get('folder'));
        }

        // Filter by tag
        if ($request->filled('tag')) {
            $query->withTag($request->get('tag'));
        }

        // Filter favorites
        if ($request->boolean('favorites')) {
            $query->favorites();
        }

        $notes = $query->paginate(20);

        // Get all folders and tags for filters
        $folders = Note::where('user_id', auth()->id())
            ->whereNotNull('folder')
            ->distinct()
            ->pluck('folder')
            ->filter()
            ->sort()
            ->values();

        $allTags = Note::where('user_id', auth()->id())
            ->whereNotNull('tags')
            ->get()
            ->pluck('tags')
            ->flatten()
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('notes/index', [
            'notes' => $notes,
            'folders' => $folders,
            'tags' => $allTags,
            'filters' => $request->only(['search', 'folder', 'tag', 'favorites'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $folders = Note::where('user_id', auth()->id())
            ->whereNotNull('folder')
            ->distinct()
            ->pluck('folder')
            ->filter()
            ->sort()
            ->values();

        $tags = Note::where('user_id', auth()->id())
            ->whereNotNull('tags')
            ->get()
            ->pluck('tags')
            ->flatten()
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('notes/create', [
            'folders' => $folders,
            'tags' => $tags
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNoteRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $note = Note::create($data);

        // Process bidirectional links
        $this->processBidirectionalLinks($note, $data['content']);

        return redirect()->route('notes.show', $note)
            ->with('success', 'Note created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to note.');
        }

        $note->load([
            'linksFrom.toNote',
            'linksTo.fromNote',
            'linkedNotes',
            'backlinkedNotes'
        ]);

        return Inertia::render('notes/show', [
            'note' => $note
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to note.');
        }

        $folders = Note::where('user_id', auth()->id())
            ->whereNotNull('folder')
            ->distinct()
            ->pluck('folder')
            ->filter()
            ->sort()
            ->values();

        $tags = Note::where('user_id', auth()->id())
            ->whereNotNull('tags')
            ->get()
            ->pluck('tags')
            ->flatten()
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('notes/edit', [
            'note' => $note,
            'folders' => $folders,
            'tags' => $tags
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNoteRequest $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to note.');
        }

        $data = $request->validated();
        $note->update($data);

        // Update bidirectional links
        $this->processBidirectionalLinks($note, $data['content']);

        return redirect()->route('notes.show', $note)
            ->with('success', 'Note updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to note.');
        }

        $note->delete();

        return redirect()->route('notes.index')
            ->with('success', 'Note deleted successfully.');
    }

    /**
     * Process bidirectional links in note content.
     */
    protected function processBidirectionalLinks(Note $note, string $content): void
    {
        // Remove existing links from this note
        $note->linksFrom()->delete();

        // Find all [[Note Title]] patterns
        preg_match_all('/\[\[([^\]]+)\]\]/', $content, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $linkText) {
                // Find or create the target note
                $targetNote = Note::where('user_id', $note->user_id)
                    ->where('title', $linkText)
                    ->first();

                if (!$targetNote) {
                    // Create a new note with the linked title
                    $targetNote = Note::create([
                        'user_id' => $note->user_id,
                        'title' => $linkText,
                        'content' => "# {$linkText}\n\nThis note was automatically created from a link.",
                        'tags' => ['auto-generated'],
                    ]);
                }

                // Create the link if it doesn't exist
                $note->linksFrom()->firstOrCreate([
                    'to_note_id' => $targetNote->id,
                    'link_text' => $linkText,
                ]);
            }
        }
    }
}