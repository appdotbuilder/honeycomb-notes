export interface Note {
    id: number;
    title: string;
    content: string;
    tags: string[] | null;
    folder: string | null;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
    links_from?: Array<{id: number; to_note_id: number; link_text: string}>;
    links_to?: Array<{id: number; from_note_id: number; link_text: string}>;
    linked_notes?: Note[];
    backlinked_notes?: Note[];
}