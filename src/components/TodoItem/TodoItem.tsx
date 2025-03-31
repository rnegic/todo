import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './TodoItem.module.css';
import { TodoItemProps } from '@/types';
import { ESCAPE_KEY, ENTER_KEY } from '@/constants';
import { motion } from 'framer-motion';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const editInputRef = useRef<HTMLInputElement>(null);

    const handleDoubleClick = useCallback(() => {
        setIsEditing(true);
        setEditText(todo.text);
    }, [todo.text]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditText(event.target.value);
    };

    const handleBlur = useCallback(() => {
        const newText = editText.trim();
        if (newText) {
            onEdit(todo.id, newText);
        } else {
            onDelete(todo.id);
        }
        setIsEditing(false);
    }, [editText, todo.id, onEdit, onDelete]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ENTER_KEY) {
            handleBlur();
        } else if (event.key === ESCAPE_KEY) {
            setEditText(todo.text);
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.setSelectionRange(editText.length, editText.length);
        }
    }, [isEditing, editText.length]);

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
    };

    return (
        <motion.li
            className={`${styles.item} ${todo.completed ? styles.completed : ''} ${isEditing ? styles.editing : ''}`}
            data-testid={`todo-item-${todo.id}`}
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            {isEditing ? (
                <input
                    ref={editInputRef}
                    className={styles.editInput}
                    type="text"
                    value={editText}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    data-testid="edit-input"
                />
            ) : (
                <>
                    <input
                        id={`toggle-${todo.id}`}
                        className={styles.toggle}
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo.id)}
                        data-testid="todo-item-toggle"
                    />
                    <label
                        htmlFor={`toggle-${todo.id}`}
                        className={styles.label}
                        onDoubleClick={handleDoubleClick}
                        data-testid="todo-item-label"
                    >
                        {todo.text}
                    </label>
                    <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(todo.id)}
                        data-testid="delete-button"
                    />
                </>
            )}
        </motion.li>
    );
};

export default TodoItem;