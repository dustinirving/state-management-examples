import React from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TodoItem } from '../components/TodoItem'
import { TodoFilter } from '../components/TodoFilter'
import { AddTodo } from '../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

interface TodoStore {
  todos: Todo[]
  filter: Filter
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  setFilter: (filter: Filter) => void
  clearCompleted: () => void
  filteredTodos: () => Todo[]
}

const useTodoStore = create<TodoStore>()(
  devtools((set, get) => ({
    todos: [
      { id: '1', text: 'Learn Zustand', completed: false },
      { id: '2', text: 'Build todo app', completed: true },
      { id: '3', text: 'Compare state managers', completed: false }
    ],
    filter: 'all',
    
    addTodo: (text: string) =>
      set((state) => ({
        todos: [...state.todos, {
          id: Date.now().toString(),
          text,
          completed: false
        }]
      }), false, 'addTodo'),
    
    toggleTodo: (id: string) =>
      set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      }), false, 'toggleTodo'),
    
    deleteTodo: (id: string) =>
      set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      }), false, 'deleteTodo'),
    
    setFilter: (filter) =>
      set({ filter }, false, 'setFilter'),
    
    clearCompleted: () =>
      set((state) => ({
        todos: state.todos.filter(todo => !todo.completed)
      }), false, 'clearCompleted'),
    
    filteredTodos: () => {
      const { todos, filter } = get()
      switch (filter) {
        case 'active': return todos.filter(t => !t.completed)
        case 'completed': return todos.filter(t => t.completed)
        default: return todos
      }
    }
  }))
)

export const ZustandTodoApp: React.FC = () => {
  const store = useTodoStore()
  const filteredTodos = store.filteredTodos()
  
  return (
    <div className="todo-app">
      <h2>Zustand Todo App</h2>
      <div className="todo-stats">
        <span>Total: {store.todos.length}</span>
        <span>Active: {store.todos.filter(t => !t.completed).length}</span>
        <span>Completed: {store.todos.filter(t => t.completed).length}</span>
      </div>
      
      <AddTodo onAdd={store.addTodo} />
      
      <TodoFilter 
        currentFilter={store.filter}
        onFilterChange={store.setFilter}
      />
      
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={store.toggleTodo}
            onDelete={store.deleteTodo}
          />
        ))}
      </div>
      
      {store.todos.some(t => t.completed) && (
        <button onClick={store.clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Zustand Implementation Notes:</h3>
        <ul>
          <li>✅ Minimal boilerplate - single store definition</li>
          <li>✅ Excellent TypeScript support</li>
          <li>✅ DevTools integration with action names</li>
          <li>✅ Direct store access without providers</li>
          <li>✅ Computed values via functions</li>
          <li>✅ Small bundle size (~2.5kb)</li>
        </ul>
      </div>
    </div>
  )
}