<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Note>
 */
class NoteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Note>
     */
    protected $model = Note::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $folders = ['Personal', 'Work', 'Research', 'Ideas', 'Projects', null, null, null];
        $tagOptions = [
            ['productivity', 'work'],
            ['personal', 'journal'],
            ['research', 'learning'],
            ['ideas', 'brainstorm'],
            ['project', 'development'],
            ['meeting', 'notes'],
            ['books', 'reading'],
            [],
            null
        ];

        $title = $this->faker->sentence(random_int(2, 6), false);
        
        // Create realistic markdown content
        $content = "# {$title}\n\n";
        $content .= $this->faker->paragraph(random_int(2, 4)) . "\n\n";
        
        if (random_int(0, 10) > 7) {
            $content .= "## Key Points\n\n";
            for ($i = 0; $i < random_int(2, 5); $i++) {
                $content .= "- " . $this->faker->sentence() . "\n";
            }
            $content .= "\n";
        }
        
        if (random_int(0, 10) > 8) {
            $linkedNote = $this->faker->words(random_int(2, 3), true);
            $content .= "Related: [[" . ucwords($linkedNote) . "]]\n\n";
        }
        
        $content .= $this->faker->paragraph(random_int(1, 3));

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'content' => $content,
            'tags' => $this->faker->randomElement($tagOptions),
            'folder' => $this->faker->randomElement($folders),
            'is_favorite' => $this->faker->boolean(20), // 20% chance of being favorite
        ];
    }

    /**
     * Indicate that the note is a favorite.
     */
    public function favorite(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_favorite' => true,
        ]);
    }

    /**
     * Indicate that the note is in a specific folder.
     */
    public function inFolder(string $folder): static
    {
        return $this->state(fn (array $attributes) => [
            'folder' => $folder,
        ]);
    }

    /**
     * Indicate that the note has specific tags.
     */
    public function withTags(array $tags): static
    {
        return $this->state(fn (array $attributes) => [
            'tags' => $tags,
        ]);
    }
}