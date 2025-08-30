# AI-Powered Website Builder

A comprehensive full-stack platform that enables non-technical users to create and deploy websites using drag-and-drop tools combined with AI assistance.

## 🌟 Features

### Core Features

- **Visual Drag & Drop Builder**: Intuitive interface with pre-built components
- **AI Assistant**: Generate components and layouts using natural language
- **Real-time Preview**: Switch between edit and preview modes instantly
- **Component Library**: Rich set of responsive components (Hero, Navigation, Forms, etc.)
- **Property Editor**: Visual editor for component properties and styling
- **Export Functionality**: Generate production-ready HTML, React, or Vue code
- **Responsive Design**: All components are mobile-first and responsive

### AI Capabilities

- Natural language component generation
- Smart suggestions based on user intent
- Context-aware component creation
- Automatic styling and layout suggestions

### Technical Features

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Redux Toolkit
- **Backend**: Express.js with REST API
- **Drag & Drop**: @dnd-kit for smooth interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AI-builder
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd server
   npm start
   ```

   The API will be available at `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
AI-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── ComponentLibrarySidebar.tsx
│   │   │   ├── DesignCanvas.tsx
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── SimpleAIAssistant.tsx
│   │   │   ├── ComponentRenderer.tsx
│   │   │   └── ExportModal.tsx
│   │   ├── store/          # Redux store
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   └── slices/
│   │   │       ├── builderSlice.ts
│   │   │       ├── aiSlice.ts
│   │   │       └── projectSlice.ts
│   │   ├── lib/            # Utilities
│   │   │   └── componentLibrary.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── server/                 # Express backend
    ├── index.js
    └── package.json
```

## 🎨 Component Library

### Layout Components

- **Container**: Flexible container for other components
- **Section**: Semantic section container
- **Grid**: Responsive grid layout

### Content Components

- **Heading**: Configurable heading elements (H1-H6)
- **Paragraph**: Text content with styling options
- **Image**: Responsive image component
- **Link**: Clickable link component

### Form Components

- **Button**: Interactive button with various styles
- **Input**: Text input fields with validation
- **Textarea**: Multi-line text input
- **Form**: Form container with styling

### Navigation Components

- **Navigation Bar**: Header navigation with logo and links
- **Footer**: Page footer with customizable content

### Advanced Components

- **Hero Section**: Full-width hero with title, subtitle, and CTA
- **Card**: Content card with title and description

## 🤖 AI Assistant

The AI Assistant helps users create components using natural language descriptions:

### Example Prompts

- "Create a hero section with title 'Welcome to My Site'"
- "Add a blue button that says 'Get Started'"
- "Generate a contact form with name and email fields"
- "Make a navigation bar with logo and menu items"

### AI Capabilities

- Component generation based on descriptions
- Smart property extraction from prompts
- Contextual suggestions
- Multiple component types support

## 🔧 API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### AI Generation

- `POST /api/ai/generate` - Generate components using AI

### Export

- `POST /api/export` - Export project as code

### Templates

- `GET /api/templates` - Get available templates

## 💻 Development

### Frontend Development

```bash
cd client
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run linting
```

### Backend Development

```bash
cd server
npm start       # Start server
npm run dev     # Start with nodemon (if installed)
```

## 🎯 Usage Guide

### 1. Getting Started

- Launch the application
- Choose from templates or start with a blank canvas
- Begin building your website

### 2. Adding Components

- **Drag & Drop**: Drag components from the sidebar to the canvas
- **Click to Add**: Click on any component in the sidebar to add it
- **AI Generation**: Use the AI assistant to generate components

### 3. Editing Components

- Click on any component in the canvas to select it
- Use the Properties Panel to edit content and styling
- Switch between Content and Style tabs for different options

### 4. AI Assistance

- Type natural language descriptions in the AI Assistant
- Use suggested prompts for quick results
- Generated components are automatically added to your canvas

### 5. Preview and Export

- Use the Preview button to see your website without editing controls
- Export your website as HTML, React, or Vue code
- Download production-ready files

## 🚀 Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

```bash
cd client
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment

The backend can be deployed to services like Heroku, Vercel, or Railway:

```bash
cd server
# Follow your hosting service's deployment guide
```

## 🛠 Customization

### Adding New Components

1. Define the component template in `componentLibrary.ts`
2. Add rendering logic in `ComponentRenderer.tsx`
3. Update the AI assistant to recognize the new component

### Extending AI Capabilities

1. Modify the `generateResponse` function in `SimpleAIAssistant.tsx`
2. Add new prompt patterns and component mappings
3. Integrate with real AI services (OpenAI, Claude, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎉 What's Next?

### Planned Features

- **Real AI Integration**: Connect to OpenAI or other AI services
- **Database Integration**: Persistent project storage
- **User Authentication**: Multi-user support
- **Template Marketplace**: Share and download templates
- **Advanced Styling**: CSS-in-JS and custom themes
- **Component Marketplace**: Custom component sharing
- **Version Control**: Project history and collaboration
- **Hosting Integration**: One-click deployment

### Current Limitations

- AI responses are currently mocked
- Projects are stored in browser localStorage
- Limited component library
- Basic styling options

## 🙏 Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- Uses shadcn/ui for consistent design
- Inspired by modern no-code platforms
- AI-powered development tools

---

**Note**: This is an MVP demonstration of an AI-powered website builder. For production use, you would need to integrate real AI services, implement proper authentication, add database persistence, and enhance the component library.
