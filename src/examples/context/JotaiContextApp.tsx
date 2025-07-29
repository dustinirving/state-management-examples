import React, { createContext, useContext } from 'react'
import { Provider, atom, useAtom, useAtomValue, useSetAtom, createStore } from 'jotai'
import { TodoItem } from '../../components/TodoItem'
import { TodoFilter } from '../../components/TodoFilter'
import { AddTodo } from '../../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

// Base atoms
const todosAtom = atom<Todo[]>([
  { id: '1', text: 'Learn Jotai + Context', completed: false },
  { id: '2', text: 'Build todo app', completed: true },
  { id: '3', text: 'Compare patterns', completed: false }
])

const filterAtom = atom<Filter>('all')

// Derived atoms
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom)
  const filter = get(filterAtom)
  
  switch (filter) {
    case 'active': return todos.filter(t => !t.completed)
    case 'completed': return todos.filter(t => t.completed)
    default: return todos
  }
})

const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom)
  return {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }
})

// Action atoms
const addTodoAtom = atom(
  null,
  (get, set, text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false
    }
    set(todosAtom, [...get(todosAtom), newTodo])
  }
)

const toggleTodoAtom = atom(
  null,
  (get, set, id: string) => {
    set(todosAtom, 
      get(todosAtom).map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }
)

const deleteTodoAtom = atom(
  null,
  (get, set, id: string) => {
    set(todosAtom, get(todosAtom).filter(todo => todo.id !== id))
  }
)

const clearCompletedAtom = atom(
  null,
  (get, set) => {
    set(todosAtom, get(todosAtom).filter(todo => !todo.completed))
  }
)

// Context for store instance
const StoreContext = createContext<ReturnType<typeof createStore> | null>(null)

// Provider component with custom store
export const JotaiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createStore()
  
  return (
    <StoreContext.Provider value={store}>
      <Provider store={store}>
        {children}
      </Provider>
    </StoreContext.Provider>
  )
}

// Custom hook to access store instance
const useStoreInstance = () => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStoreInstance must be used within JotaiProvider')
  }
  return store
}

const JotaiContextContent: React.FC = () => {
  const storeInstance = useStoreInstance()
  const [filter, setFilter] = useAtom(filterAtom)
  const todos = useAtomValue(todosAtom)
  const filteredTodos = useAtomValue(filteredTodosAtom)
  const stats = useAtomValue(todoStatsAtom)
  
  const addTodo = useSetAtom(addTodoAtom)
  const toggleTodo = useSetAtom(toggleTodoAtom)
  const deleteTodo = useSetAtom(deleteTodoAtom)
  const clearCompleted = useSetAtom(clearCompletedAtom)
  
  return (
    <div className="todo-app">
      <h2>Jotai + Context API</h2>
      <div className="todo-stats">
        <span>Store ID: {storeInstance.toString().slice(-8)}</span>
        <span>Total: {stats.total}</span>
        <span>Active: {stats.active}</span>
        <span>Completed: {stats.completed}</span>
      </div>
      
      <AddTodo onAdd={addTodo} />
      
      <TodoFilter 
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
      
      {todos.some(t => t.completed) && (
        <button onClick={clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Jotai + Context Implementation Notes:</h3>
        <ul>
          <li>✅ Scoped atomic state per context</li>
          <li>✅ Multiple store instances possible</li>
          <li>✅ Same atomic composition benefits</li>
          <li>✅ Server-side rendering friendly</li>
          <li>✅ Fine-grained reactivity maintained</li>
          <li>✅ Easy testing with isolated stores</li>
          <li>⚠️ Need to create store instances manually</li>
          <li>⚠️ Double provider pattern</li>
        </ul>
      </div>
    </div>
  )
}

export const JotaiContextApp: React.FC = () => {
  return (
    <JotaiProvider>
      <JotaiContextContent />
    </JotaiProvider>
  )
}