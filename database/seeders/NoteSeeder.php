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
    public function run(): void
    {
        // Get the first user or create one
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Demo User',
                'email' => 'demo@example.com'
            ]);
        }

        // Create sample notes with realistic content
        $welcomeNote = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Welcome to ObsidianFlow',
            'content' => "# Welcome to ObsidianFlow 📝\n\nCongratulations! You've successfully set up your personal knowledge management system.\n\n## Getting Started\n\nObsidianFlow is designed to help you:\n- **Capture** your thoughts and ideas\n- **Connect** related concepts with bidirectional links\n- **Discover** insights through your personal knowledge graph\n\n## Key Features\n\n### Bidirectional Links\nUse the `[[Note Name]]` syntax to create links between notes. For example, you can link to your [[Project Ideas]] or [[Daily Journal]].\n\n### Organization\n- Use **folders** to organize notes by topic\n- Add **tags** to categorize and filter notes\n- Mark important notes as **favorites** ⭐\n\n### Search & Discovery\n- Full-text search across all your notes\n- Visual graph view to see connections\n- Backlinks to see what references each note\n\n## Next Steps\n\n1. Create your first note using the \"✨ New\" button\n2. Try linking to this note from another note\n3. Explore the graph view to visualize connections\n4. Use tags to organize your growing knowledge base\n\nHappy note-taking! 🚀",
            'tags' => ['getting-started', 'welcome'],
            'folder' => 'Getting Started',
            'is_favorite' => true
        ]);

        $projectIdeas = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Project Ideas',
            'content' => "# Project Ideas 💡\n\n## Web Development\n- Personal portfolio website\n- Task management app\n- Weather dashboard\n- Recipe organizer\n\n## Learning Projects\n- [[Learning React]] - Modern frontend development\n- [[Database Design]] - PostgreSQL and optimization\n- [[API Development]] - RESTful services\n\n## Creative Projects\n- Photography blog\n- Music practice tracker\n- Garden planning app\n\n## Notes\n- Keep this list updated with new ideas\n- Link to related [[Research Notes]] when starting a project\n- Use tags to categorize by difficulty and technology",
            'tags' => ['projects', 'ideas', 'development'],
            'folder' => 'Personal',
            'is_favorite' => false
        ]);

        $learningReact = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Learning React',
            'content' => "# Learning React ⚛️\n\n## Current Progress\n- ✅ JSX syntax and components\n- ✅ State management with hooks\n- 🔄 Context API and providers\n- ⏳ Advanced patterns and performance\n\n## Key Concepts\n\n### Hooks\n- `useState` for component state\n- `useEffect` for side effects\n- `useContext` for shared state\n- Custom hooks for reusable logic\n\n### Best Practices\n- Component composition over inheritance\n- Lift state up when needed\n- Keep components small and focused\n- Use TypeScript for better development experience\n\n## Resources\n- [Official React Documentation](https://reactjs.org)\n- [[Project Ideas]] - Apply learning to real projects\n- [[Development Setup]] - Tools and environment\n\n## Next Steps\n1. Build a small project using React\n2. Learn about state management libraries\n3. Explore testing strategies",
            'tags' => ['learning', 'react', 'development', 'frontend'],
            'folder' => 'Learning',
            'is_favorite' => true
        ]);

        $dailyJournal = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Daily Journal',
            'content' => "# Daily Journal 📅\n\n*A place to reflect on daily experiences and thoughts*\n\n## Today's Highlights\n- Completed the note-taking app setup\n- Had a productive meeting about [[Project Ideas]]\n- Spent time learning about [[Learning React]] patterns\n\n## Thoughts & Reflections\nThe knowledge management system is coming together nicely. Being able to link notes creates a web of connected thoughts that's much more powerful than isolated documents.\n\n## Tomorrow's Goals\n- Continue working on the React learning path\n- Add more structure to [[Project Ideas]]\n- Explore the graph visualization features\n\n## Random Ideas\n- Could use this system for planning travel\n- Might be useful for recipe collection with tags\n- Great for book notes and quotes\n\n---\n*Remember to link related thoughts and ideas as they come up.*",
            'tags' => ['journal', 'personal', 'reflection'],
            'folder' => 'Personal',
            'is_favorite' => false
        ]);

        $databaseDesign = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Database Design',
            'content' => "# Database Design 🗃️\n\n## Fundamental Principles\n\n### Normalization\n- **1NF**: Eliminate repeating groups\n- **2NF**: Eliminate redundant data\n- **3NF**: Eliminate columns not dependent on key\n\n### Relationships\n- One-to-One: User profiles\n- One-to-Many: Users and their notes\n- Many-to-Many: Tags and notes (requires junction table)\n\n## PostgreSQL Specific\n\n### Data Types\n- `SERIAL` for auto-incrementing IDs\n- `JSONB` for flexible document storage\n- `TIMESTAMP` for date/time with timezone\n- `TEXT` for variable-length strings\n\n### Performance\n- Create indexes on frequently queried columns\n- Use `EXPLAIN ANALYZE` to understand query performance\n- Consider partial indexes for conditional queries\n\n## Related Notes\n- [[API Development]] - How to expose data\n- [[Learning React]] - Frontend data consumption\n- [[Project Ideas]] - Applications of these concepts\n\n## Best Practices\n1. Always use foreign key constraints\n2. Choose appropriate data types\n3. Document your schema decisions\n4. Plan for data migration strategies",
            'tags' => ['database', 'postgresql', 'design', 'backend'],
            'folder' => 'Learning',
            'is_favorite' => false
        ]);

        // Create some additional notes
        Note::factory(15)->create([
            'user_id' => $user->id,
        ]);

        // Create some bidirectional links
        NoteLink::factory()->between($welcomeNote, $projectIdeas)->create();
        NoteLink::factory()->between($projectIdeas, $learningReact)->create();
        NoteLink::factory()->between($projectIdeas, $databaseDesign)->create();
        NoteLink::factory()->between($dailyJournal, $projectIdeas)->create();
        NoteLink::factory()->between($dailyJournal, $learningReact)->create();
        NoteLink::factory()->between($learningReact, $databaseDesign)->create();

        $this->command->info('Created sample notes with realistic content and links.');
    }
}