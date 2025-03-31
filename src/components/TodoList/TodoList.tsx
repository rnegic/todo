import { AnimatePresence } from 'framer-motion';
import TodoItem from '@/components/TodoItem/TodoItem';
import styles from './TodoList.module.css';
import { Todo, TodoItemProps } from '@/types';

interface TodoListProps extends Omit<TodoItemProps, 'todo'> {
    todos: Todo[];
}

const TodoList = ({ todos, onToggle, onDelete, onEdit }: TodoListProps) => {
    return (
        <section className={styles.main} data-testid="todo-list-section">
            <ul className={styles.todoList} data-testid="todo-list">
                <AnimatePresence initial={false}>
                    {todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </AnimatePresence>
            </ul>
        </section>
    );
};

export default TodoList;