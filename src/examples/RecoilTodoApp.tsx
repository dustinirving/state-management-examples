import React from 'react'
import { 
  RecoilRoot,
  atom, 
  selector, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState
} from 'recoil'
import { TodoItem } from '../components/TodoItem'
import { TodoFilter } from '../components/TodoFilter'
import { AddTodo } from '../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: [
    { id: '1', text: 'Learn Recoil', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare state managers', completed: false }
  ]
})

const todoListFilterState = atom<Filter>({
  key: 'todoListFilterState',
  default: 'all'
})

const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoListFilterState)
    const list = get(todoListState)
    
    switch (filter) {
      case 'active': return list.filter(todo => !todo.completed)
      case 'completed': return list.filter(todo => todo.completed)
      default: return list
    }
  }
})

const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState)
    return {
      total: todoList.length,
      active: todoList.filter(todo => !todo.completed).length,
      completed: todoList.filter(todo => todo.completed).length
    }
  }
})

const RecoilTodoAppContent: React.FC = () => {
  const [todoList, setTodoList] = useRecoilState(todoListState)
  const [filter, setFilter] = useRecoilState(todoListFilterState)
  const filteredTodos = useRecoilValue(filteredTodoListState)
  const stats = useRecoilValue(todoListStatsState)
  
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false
    }
    setTodoList(prev => [...prev, newTodo])
  }
  
  const toggleTodo = (id: string) => {
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }
  
  const deleteTodo = (id: string) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id))
  }
  
  const clearCompleted = () => {
    setTodoList(prev => prev.filter(todo => !todo.completed))
  }
  
  return (
    <div className="todo-app">
      <h2>Recoil Todo App</h2>
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
      
      {todoList.some(t => t.completed) && (
        <button onClick={clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Recoil Implementation Notes:</h3>
        <ul>
          <li>✅ Excellent selector system for derived state</li>
          <li>✅ Great async support out of the box</li>
          <li>✅ Facebook-backed with React-like patterns</li>
          <li>✅ Excellent DevTools integration</li>
          <li>✅ Graph-based state dependencies</li>
          <li>⚠️ Experimental status - production risks</li>
          <li>⚠️ Requires RecoilRoot provider</li>
          <li>⚠️ Medium bundle size (~10kb)</li>
          <li>⚠️ Uncertain long-term support</li>
        </ul>
      </div>
    </div>
  )
}

export const RecoilTodoApp: React.FC = () => {
  return (
    <RecoilRoot>
      <RecoilTodoAppContent />
    </RecoilRoot>
  )
}