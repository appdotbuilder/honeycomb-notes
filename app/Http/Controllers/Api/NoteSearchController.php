<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteSearchController extends Controller
{
    /**
     * Search notes for autocomplete.
     */
    public function index(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([]);
        }

        $notes = Note::where('user_id', auth()->id())
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('content', 'like', "%{$query}%");
            })
            ->select('id', 'title', 'folder', 'tags')
            ->limit(10)
            ->get();

        return response()->json($notes);
    }
}