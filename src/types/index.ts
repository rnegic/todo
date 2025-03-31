export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newText: string) => void;
}