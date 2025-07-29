# State Management Examples

A comprehensive comparison of React state management libraries through practical todo app implementations.

## Libraries Covered

- **Zustand** - Lightweight, simple state management
- **Redux Toolkit** - Modern Redux with less boilerplate  
- **Jotai** - Atomic state management
- **Valtio** - Proxy-based mutable state
- **MobX** - Object-oriented reactive state
- **Recoil** - Facebook's experimental state library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── TodoItem.tsx
│   ├── TodoFilter.tsx
│   └── AddTodo.tsx
├── examples/           # State manager implementations
│   ├── ZustandTodoApp.tsx
│   ├── ReduxTodoApp.tsx
│   ├── JotaiTodoApp.tsx
│   ├── ValtioTodoApp.tsx
│   ├── MobXTodoApp.tsx
│   └── RecoilTodoApp.tsx
├── App.tsx            # Main app with navigation
└── main.tsx           # Entry point
```

## Comparison Summary

| Library | Bundle Size | Learning Curve | Boilerplate | DevTools | Best For |
|---------|-------------|----------------|-------------|----------|----------|
| Zustand | ~2.5kb | Easy | Low | Good | Most projects |
| Redux Toolkit | ~15kb | Steep | High | Excellent | Large apps |
| Jotai | ~3kb | Moderate | Low | Good | Atomic state |
| Valtio | ~3kb | Easy | Very Low | Basic | Mutable API |
| MobX | ~15kb | Moderate | Medium | Excellent | OOP patterns |
| Recoil | ~10kb | Moderate | Medium | Excellent | Experimental |

## Key Features Demonstrated

- ✅ Adding/removing todos
- ✅ Toggling completion status
- ✅ Filtering by status (all/active/completed)
- ✅ Clearing completed todos
- ✅ Live statistics display
- ✅ DevTools integration
- ✅ TypeScript support

## Recommendations

- **Start with Zustand** for most projects - best balance of simplicity and features
- **Use Redux Toolkit** for large teams and complex applications
- **Choose Jotai** for fine-grained reactivity and atomic composition
- **Consider Valtio** if you prefer mutable APIs similar to Vue
- **Pick MobX** for OOP backgrounds and complex relational data
- **Avoid Recoil** due to experimental status and uncertain future

Each implementation includes detailed notes about trade-offs, performance characteristics, and use cases.