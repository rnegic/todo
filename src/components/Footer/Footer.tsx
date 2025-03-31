import styles from './Footer.module.css';
import { FILTERS } from '@/constants';
import { FilterType, FooterProps } from '@/types';
import { makePlural } from '@/utils/helpers';

const Footer = ({
    activeCount,
    completedCount,
    filter,
    onFilterChange,
    onClearCompleted,
}: FooterProps) => {
    const itemText = makePlural(activeCount);

    const handleFilterClick = (selectedFilter: FilterType) => {
        if (filter !== selectedFilter) {
            onFilterChange(selectedFilter);
        }
    };

    return (
        <footer className={styles.footer} data-testid="footer">
            <span className={styles.todoCount} data-testid="active-todo-count">
                {activeCount} {itemText} осталось
            </span>
            <ul className={styles.filters} data-testid="filter-list">
                <li>
                    <button
                        className={`${styles.filterButton} ${filter === FILTERS.ALL ? styles.filterButtonSelected : ''}`}
                        onClick={() => handleFilterClick(FILTERS.ALL)}
                        data-testid="filter-all"
                    >
                        Все
                    </button>
                </li>
                <li>
                    <button
                        className={`${styles.filterButton} ${filter === FILTERS.ACTIVE ? styles.filterButtonSelected : ''}`}
                        onClick={() => handleFilterClick(FILTERS.ACTIVE)}
                        data-testid="filter-active"
                    >
                        Невыполненные
                    </button>
                </li>
                <li>
                    <button
                        className={`${styles.filterButton} ${filter === FILTERS.COMPLETED ? styles.filterButtonSelected : ''}`}
                        onClick={() => handleFilterClick(FILTERS.COMPLETED)}
                        data-testid="filter-completed"
                    >
                        Выполненные
                    </button>
                </li>
            </ul>
            <button
                className={`${styles.clearCompletedButton} ${completedCount === 0 ? styles.hidden : ''}`}
                onClick={onClearCompleted}
                disabled={completedCount === 0}
                data-testid="clear-completed-button"
            >
                Очистить выполненные
            </button>
        </footer>
    );
};

export default Footer;