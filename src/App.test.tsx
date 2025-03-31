import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const formatTodoCountText = (count: number): string => {
    if (count === 1) {
        return `${count} todo осталось`;
    }
    return `${count} todos осталось`;
};

beforeEach(() => {
    window.localStorage.clear();
});

describe('<App /> Core Functionality (Russian UI)', () => {

    it('add a new todo item', async () => {
        const user = userEvent.setup();
        render(<App />);
        const input = screen.getByPlaceholderText('Напишите вашу первую заметку!');
        const todoText = 'Первая заметка';
        await user.type(input, `${todoText}{enter}`);
        expect(screen.getByText(todoText)).toBeInTheDocument();
        expect(input).toHaveValue('');
        expect(screen.getByTestId('active-todo-count')).toHaveTextContent(formatTodoCountText(1));
    });

    it('toggle a todo item completion status', async () => {
        const user = userEvent.setup();
        render(<App />);
        const input = screen.getByPlaceholderText('Напишите вашу первую заметку!');
        const todoText = 'Отметить меня';

        await user.type(input, `${todoText}{enter}`);
        const listItem = screen.getByText(todoText).closest('li');
        expect(listItem).toBeInTheDocument();
        const checkbox = within(listItem!).getByRole('checkbox');

        // начальное состояние: не выполнено
        expect(checkbox).not.toBeChecked();
        expect(listItem!.className).not.toMatch(/completed/);
        expect(screen.getByTestId('active-todo-count')).toHaveTextContent(formatTodoCountText(1));

        // отмечаем как выполненное
        await user.click(checkbox);
        expect(checkbox).toBeChecked();

        expect(listItem!.className).toMatch(/completed/);
        expect(screen.getByTestId('active-todo-count')).toHaveTextContent(formatTodoCountText(0));

        // снимаем отметку
        await user.click(checkbox);
        expect(checkbox).not.toBeChecked();

        expect(listItem!.className).not.toMatch(/completed/);
        expect(screen.getByTestId('active-todo-count')).toHaveTextContent(formatTodoCountText(1));
    });

    it('should delete a todo item', async () => {
        const user = userEvent.setup();
        render(<App />);
        const input = screen.getByPlaceholderText('Напишите вашу первую заметку!');
        const todoText = 'Удалить меня';
        await user.type(input, `${todoText}{enter}`);
        expect(screen.getByText(todoText)).toBeInTheDocument();
        const listItem = screen.getByText(todoText).closest('li');
        const deleteButton = within(listItem!).getByTestId('delete-button');
        await user.click(deleteButton);
        await waitFor(() => {
            expect(screen.queryByText(todoText)).not.toBeInTheDocument();
        });
        expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });

    it('should clear completed todos', async () => {
        const user = userEvent.setup();
        render(<App />);
        const input = screen.getByPlaceholderText('Напишите вашу первую заметку!');
        const activeTodo = 'Активная';
        const completedTodo = 'Завершенная';

        await user.type(input, `${activeTodo}{enter}`);
        await user.type(input, `${completedTodo}{enter}`);

        const completedListItem = screen.getByText(completedTodo).closest('li');
        const completedCheckbox = within(completedListItem!).getByRole('checkbox');
        await user.click(completedCheckbox);

        const clearButton = screen.getByText('Очистить выполненные');
        // проверяем, что строка классов не содержит подстроку hidden
        expect(clearButton.className).not.toMatch(/hidden/);
        await user.click(clearButton);

        expect(screen.getByText(activeTodo)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText(completedTodo)).not.toBeInTheDocument();
        });
        // теперь содержит hidden
        expect(clearButton.className).toMatch(/hidden/);
        expect(screen.getByTestId('active-todo-count')).toHaveTextContent(formatTodoCountText(1));
    });

    it('should filter todo items', async () => {
        const user = userEvent.setup();
        render(<App />);
        const input = screen.getByPlaceholderText('Напишите вашу первую заметку!');
        const activeTodoText = 'Невыполненная задача';
        const completedTodoText = 'Выполненная задача';

        await user.type(input, `${activeTodoText}{enter}`);
        await user.type(input, `${completedTodoText}{enter}`);

        const completedListItem = screen.getByText(completedTodoText).closest('li');
        const completedCheckbox = within(completedListItem!).getByRole('checkbox');
        await user.click(completedCheckbox);

        // проверка фильтра "Невыполненные"
        await user.click(screen.getByText('Невыполненные'));
        expect(screen.getByText(activeTodoText)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText(completedTodoText)).not.toBeInTheDocument();
        });

        // проверка фильтра "Выполненные"
        await user.click(screen.getByText('Выполненные'));
        await waitFor(() => {
            expect(screen.queryByText(activeTodoText)).not.toBeInTheDocument();
        });
        expect(screen.getByText(completedTodoText)).toBeInTheDocument();

        // проверка фильтра "Все"
        await user.click(screen.getByText('Все'));
        await waitFor(() => {
            expect(screen.getByText(activeTodoText)).toBeInTheDocument();
            expect(screen.getByText(completedTodoText)).toBeInTheDocument();
        });
    });

});