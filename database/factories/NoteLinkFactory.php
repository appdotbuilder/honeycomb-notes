<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\NoteLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NoteLink>
 */
class NoteLinkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\NoteLink>
     */
    protected $model = NoteLink::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'from_note_id' => Note::factory(),
            'to_note_id' => Note::factory(),
            'link_text' => $this->faker->words(random_int(2, 4), true),
        ];
    }

    /**
     * Indicate the link is between specific notes.
     */
    public function between(Note $fromNote, Note $toNote): static
    {
        return $this->state(fn (array $attributes) => [
            'from_note_id' => $fromNote->id,
            'to_note_id' => $toNote->id,
            'link_text' => $toNote->title,
        ]);
    }
}