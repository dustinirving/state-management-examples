import React from 'react'

type Filter = 'all' | 'active' | 'completed'

interface TodoFilterProps {
  currentFilter: Filter
  onFilterChange: (filter: Filter) => void
}

export const TodoFilter: React.FC<TodoFilterProps> = ({ currentFilter, onFilterChange }) => {
  const filters: Filter[] = ['all', 'active', 'completed']
  
  return (
    <div className="todo-filters">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`filter-button ${currentFilter === filter ? 'active' : ''}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  )
}