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

export interface HeaderProps {
    onAddTodo: (text: string) => void;
    allCompleted: boolean;
    onToggleAll: () => void;
    hasTodos: boolean;
}

export interface FooterProps {
    activeCount: number;
    completedCount: number;
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    onClearCompleted: () => void;
}