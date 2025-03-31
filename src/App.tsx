import { useState, useMemo, useCallback } from 'react'
import TodoList from '@/components/TodoList/TodoList';
import { Todo, FilterType } from '@/types';
import { FILTERS, LOCAL_STORAGE_KEY } from '@/constants';
import { generateId } from '@/utils/helpers';
import useLocalStorage from '@/hooks/useLocalStorage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(LOCAL_STORAGE_KEY, []);
  const [filter, setFilter] = useState<FilterType>(FILTERS.ALL);

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, [setTodos]);

  const editTodo = useCallback((id: string, newText: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  }, [setTodos]);

  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, [setTodos]);

  const toggleAll = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);
    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: !areAllCompleted }))
    );
  }, [todos, setTodos]);


  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedCount = useMemo(() => todos.length - activeCount, [todos, activeCount]);
  const areAllCompleted = useMemo(() => todos.length > 0 && activeCount === 0, [todos.length, activeCount]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FILTERS.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTERS.COMPLETED:
        return todos.filter(todo => todo.completed);
      case FILTERS.ALL:
      default:
        return todos;
    }
  }, [todos, filter]);

  const hasTodos = todos.length > 0;

  return (
    <>
      <h1 className="main-title">todos</h1>
      <section className="todoapp" data-testid="todo-app">
        <Header
          onAddTodo={addTodo}
          allCompleted={areAllCompleted}
          onToggleAll={toggleAll}
          hasTodos={hasTodos}
        />
        {hasTodos && (
          <TodoList
            todos={visibleTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        )}
        {hasTodos && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </section>
    </>
  );
}

export default App;