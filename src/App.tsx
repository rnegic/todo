import { useState, useMemo, useCallback } from 'react'
import TodoList from '@/components/TodoList/TodoList';
import { Todo } from '@/types';
import { FILTERS, LOCAL_STORAGE_KEY } from '@/constants';
import useLocalStorage from '@/hooks/useLocalStorage';

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(LOCAL_STORAGE_KEY, []);

  // const addTodo

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


  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);

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
  }, [todos]);

  const hasTodos = todos.length > 0;

  return (
    <>
      <h1 className="main-title">todos</h1>
      <section className="todoapp" data-testid="todo-app">
        {hasTodos && (
          <TodoList
            todos={visibleTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        )}
      </section>
    </>
  );
}

export default App;