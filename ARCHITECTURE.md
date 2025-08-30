# AI Website Builder - Clean Architecture

## Overview

This project has been refactored for better maintainability and understanding. The codebase now follows clean architectural patterns with proper separation of concerns.

## Project Structure

```
src/
├── components/
│   ├── builder/           # Website builder components
│   │   ├── ComponentLibrary.tsx
│   │   ├── Canvas.tsx
│   │   ├── PropertiesPanel.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── Toolbar.tsx
│   │   └── index.ts
│   ├── layout/            # Layout components
│   │   ├── Navigation.tsx
│   │   └── StatusBar.tsx
│   ├── providers/         # Context providers
│   │   └── ThemeProvider.tsx
│   ├── routing/           # Routing components
│   │   └── AppRoutes.tsx
│   └── views/             # Main view components
│       ├── WelcomeView.tsx
│       ├── ProjectsView.tsx
│       └── BuilderView.tsx
├── contexts/              # React contexts
│   └── ThemeContext.ts
├── hooks/                 # Custom hooks
│   └── useTheme.ts
├── lib/                   # Utilities and helpers
│   └── utils.ts
├── store/                 # Redux store
│   ├── slices/
│   │   ├── projectSlice.ts
│   │   ├── builderSlice.ts
│   │   └── aiSlice.ts
│   ├── store.ts
│   └── index.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
└── App.tsx               # Main application component
```

## Key Features

### Clean Component Architecture

- **Separation of Concerns**: Each component has a single responsibility
- **Type Safety**: Comprehensive TypeScript types for all components
- **Reusable Components**: Modular design allows easy reuse and testing

### Builder Components

- **ComponentLibrary**: Drag-and-drop component palette
- **Canvas**: Visual editing area with component selection
- **PropertiesPanel**: Dynamic property editor based on component type
- **AIAssistant**: AI-powered content generation with quick actions
- **Toolbar**: Save, preview, export, and undo/redo functionality

### State Management

- **Redux Toolkit**: Clean state management with proper slices
- **Project Management**: Handle multiple projects with current project state
- **History System**: Undo/redo functionality for component changes

### Features

- **Real-time Editing**: Live component editing with property updates
- **Export Functionality**: Generate clean HTML with Tailwind CSS
- **AI Integration**: Smart content generation (ready for API integration)
- **Theme Support**: Dark/light mode with system detection
- **Responsive Design**: Works on desktop and mobile devices

## Development

### Adding New Components

1. Create component in appropriate directory
2. Add TypeScript types in `types/index.ts`
3. Export from directory's `index.ts`
4. Add to ComponentLibrary if it's a builder component

### Adding New Features

1. Define types in `types/index.ts`
2. Create Redux slice if state management needed
3. Implement UI components following existing patterns
4. Add utility functions to `lib/utils.ts` if needed

### Code Quality

- **TypeScript**: Strict typing for better development experience
- **ESLint**: Code quality enforcement
- **Clean Imports**: Organized imports using index files
- **Consistent Styling**: Tailwind CSS with design system approach

## Usage

1. **Welcome Screen**: Introduction and getting started
2. **Projects**: Create and manage multiple website projects
3. **Builder**: Drag-and-drop visual website builder with:
   - Component library on the left
   - Canvas in the center
   - Properties panel and AI assistant on the right
   - Toolbar with save, preview, and export options

## Future Enhancements

- Backend integration for project persistence
- Real AI API integration (Gemini, OpenAI, etc.)
- More component types (forms, navigation, etc.)
- Template system
- Collaboration features
- Preview in multiple device sizes

This architecture provides a solid foundation for scaling the application while maintaining code quality and developer experience.
