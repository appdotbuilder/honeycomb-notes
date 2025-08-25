<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\NoteLink;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(User $user = null): void
    {
        // Use the provided user or get the first one if none provided (for standalone seeding)
        if (!$user) {
            $user = User::first();
        }
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Default Seeder User',
                'email' => 'seeder@example.com'
            ]);
        }

        // Create sample notes with realistic content for the given user
        $welcomeNote = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Welcome to ObsidianFlow',
            'content' => "# Welcome to ObsidianFlow 📝

Congratulations! You've successfully set up your personal knowledge management system.

## Getting Started

ObsidianFlow is designed to help you:
- **Capture** your thoughts and ideas
- **Connect** related concepts with bidirectional links
- **Discover** insights through your personal knowledge graph

## Key Features

### Bidirectional Links
Use the `[[Note Name]]` syntax to create links between notes. For example, you can link to your [[Project Ideas]] or [[Daily Journal]].

### Organization
- Use **folders** to organize notes by topic
- Add **tags** to categorize and filter notes
- Mark important notes as **favorites** ⭐

### Search & Discovery
- Full-text search across all your notes
- Visual graph view to see connections
- Backlinks to see what references each note

## Next Steps

1. Create your first note using the \"✨ New\" button
2. Try linking to this note from another note
3. Explore the graph view to visualize connections
4. Use tags to organize your growing knowledge base

Happy note-taking! 🚀",
            'tags' => ['getting-started', 'welcome'],
            'folder' => 'Getting Started',
            'is_favorite' => true
        ]);

        $projectIdeas = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Project Ideas',
            'content' => "# Project Ideas 💡

## Web Development
- Personal portfolio website
- Task management app
- Weather dashboard
- Recipe organizer

## Learning Projects
- [[Learning React]] - Modern frontend development
- [[Database Design]] - PostgreSQL and optimization
- [[API Development]] - RESTful services

## Creative Projects
- Photography blog
- Music practice tracker
- Garden planning app

## Notes
- Keep this list updated with new ideas
- Link to related [[Research Notes]] when starting a project
- Use tags to categorize by difficulty and technology",
            'tags' => ['projects', 'ideas', 'development'],
            'folder' => 'Personal',
            'is_favorite' => false
        ]);

        $learningReact = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Learning React',
            'content' => "# Learning React ⚙️

## Current Progress
- ✅ JSX syntax and components
- ✅ State management with hooks
- 🔄 Context API and providers
- 🕒 Advanced patterns and performance

## Key Concepts

### Hooks
- `useState` for component state
- `useEffect` for side effects
- `useContext` for shared state
- Custom hooks for reusable logic

### Best Practices
- Component composition over inheritance
- Lift state up when needed
- Keep components small and focused
- Use TypeScript for better development experience

## Resources
- [Official React Documentation](https://reactjs.org)
- [[Project Ideas]] - Apply learning to real projects
- [[Development Setup]] - Tools and environment

## Next Steps
1. Build a small project using React
2. Learn about state management libraries
3. Explore testing strategies",
            'tags' => ['learning', 'react', 'development', 'frontend'],
            'folder' => 'Learning',
            'is_favorite' => true
        ]);

        $dailyJournal = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Daily Journal',
            'content' => "# Daily Journal 📅

*A place to reflect on daily experiences and thoughts*

## Today's Highlights
- Completed the note-taking app setup
- Had a productive meeting about [[Project Ideas]]
- Spent time learning about [[Learning React]] patterns

## Thoughts & Reflections
The knowledge management system is coming together nicely. Being able to link notes creates a web of connected thoughts that's much more powerful than isolated documents.

## Tomorrow's Goals
- Continue working on the React learning path
- Add more structure to [[Project Ideas]]
- Explore the graph visualization features

## Random Ideas
- Could use this system for planning travel
- Might be useful for recipe collection with tags
- Great for book notes and quotes

---
*Remember to link related thoughts and ideas as they come up.*",
            'tags' => ['journal', 'personal', 'reflection'],
            'folder' => 'Personal',
            'is_favorite' => false
        ]);

        $databaseDesign = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Database Design',
            'content' => "# Database Design 🗃️

## Fundamental Principles

### Normalization
- **1NF**: Eliminate repeating groups
- **2NF**: Eliminate redundant data
- **3NF**: Eliminate columns not dependent on key

### Relationships
- One-to-One: User profiles
- One-to-Many: Users and their notes
- Many-to-Many: Tags and notes (requires junction table)

## PostgreSQL Specific

### Data Types
- `SERIAL` for auto-incrementing IDs
- `JSONB` for flexible document storage
- `TIMESTAMP` for date/time with timezone
- `TEXT` for variable-length strings

### Performance
- Create indexes on frequently queried columns
- Use `EXPLAIN ANALYZE` to understand query performance
- Consider partial indexes for conditional queries

## Related Notes
- [[API Development]] - How to expose data
- [[Learning React]] - Frontend data consumption
- [[Project Ideas]] - Applications of these concepts

## Best Practices
1. Always use foreign key constraints
2. Choose appropriate data types
3. Document your schema decisions
4. Plan for data migration strategies",
            'tags' => ['database', 'postgresql', 'design', 'backend'],
            'folder' => 'Learning',
            'is_favorite' => false
        ]);

        // Create some additional notes for the user
        Note::factory(random_int(5, 10))->create([
            'user_id' => $user->id,
        ]);

        // Create some bidirectional links for the user's notes
        NoteLink::factory()->between($welcomeNote, $projectIdeas)->create();
        NoteLink::factory()->between($projectIdeas, $learningReact)->create();
        NoteLink::factory()->between($projectIdeas, $databaseDesign)->create();
        NoteLink::factory()->between($dailyJournal, $projectIdeas)->create();
        NoteLink::factory()->between($dailyJournal, $learningReact)->create();
        NoteLink::factory()->between($learningReact, $databaseDesign)->create();

        $this->command->info("Created sample notes with realistic content and links for user: {$user->email}");
    }
}