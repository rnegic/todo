import { useState, KeyboardEvent } from 'react';
import styles from './Header.module.css';
import { ENTER_KEY } from '@/constants';
import { HeaderProps } from '@/types';

const Header = ({ onAddTodo, allCompleted, onToggleAll, hasTodos }: HeaderProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ENTER_KEY) {
            const text = inputValue.trim();
            if (text) {
                onAddTodo(text);
                setInputValue('');
            }
        }
    };

    return (
        <header className={styles.header}>
            {hasTodos && (
                <button
                    className={`${styles.toggleAll} ${allCompleted ? styles.toggleAllActive : ''}`}
                    onClick={onToggleAll}
                    data-testid="toggle-all-button"
                >
                    ❯
                </button>
            )}
            <input
                className={styles.newTodoInput}
                type="text"
                placeholder="Напишите вашу первую заметку!"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                data-testid="new-todo-input"
            />
        </header>
    );
};

export default Header;