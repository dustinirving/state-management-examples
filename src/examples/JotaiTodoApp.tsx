import React from 'react'
import { Provider, atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { TodoItem } from '../components/TodoItem'
import { TodoFilter } from '../components/TodoFilter'
import { AddTodo } from '../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

// Base atoms
const todosAtom = atom<Todo[]>([
  { id: '1', text: 'Learn Jotai', completed: false },
  { id: '2', text: 'Build todo app', completed: true },
  { id: '3', text: 'Compare state managers', completed: false }
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

const TodoAppContent: React.FC = () => {
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
      <h2>Jotai Todo App</h2>
      <div className="todo-stats">
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
        <h3>Jotai Implementation Notes:</h3>
        <ul>
          <li>✅ Atomic state management - fine-grained reactivity</li>
          <li>✅ Bottom-up composition of atoms</li>
          <li>✅ Excellent derived state with computed atoms</li>
          <li>✅ No providers needed for basic usage</li>
          <li>✅ Small bundle size (~3kb)</li>
          <li>✅ Great TypeScript inference</li>
          <li>⚠️ Different mental model (atoms vs stores)</li>
          <li>⚠️ Can lead to many small atoms</li>
        </ul>
      </div>
    </div>
  )
}

export const JotaiTodoApp: React.FC = () => {
  return (
    <Provider>
      <TodoAppContent />
    </Provider>
  )
}