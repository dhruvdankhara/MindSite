# AI Website Builder - Backend API v2.0

A clean, maintainable, and scalable backend architecture for the AI-powered website builder.

## 🏗️ **Architecture Overview**

### **Before (Messy)** → **After (Clean)**

- **Single File** → **Organized Modules**
- **Mixed Concerns** → **Clear Separation**
- **Hard to Maintain** → **Easy to Extend**

## 📁 **Project Structure**

```
server/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── config/
│   │   ├── index.js          # Configuration management
│   │   └── database.js       # Database connection & setup
│   ├── controllers/
│   │   ├── projectController.js    # Project CRUD operations
│   │   ├── aiController.js         # AI generation endpoints
│   │   ├── exportController.js     # Export functionality
│   │   └── templateController.js   # Template management
│   ├── models/
│   │   ├── Project.js        # Project data model
│   │   ├── Template.js       # Template data model
│   │   ├── AIInteraction.js  # AI interaction tracking
│   │   └── index.js          # Models export
│   ├── routes/
│   │   ├── projectRoutes.js  # Project API routes
│   │   ├── aiRoutes.js       # AI API routes
│   │   ├── exportRoutes.js   # Export API routes
│   │   ├── templateRoutes.js # Template API routes
│   │   └── index.js          # Routes aggregator
│   ├── services/
│   │   ├── aiService.js      # AI generation logic
│   │   └── exportService.js  # Export generation logic
│   ├── middleware/
│   │   ├── rateLimiter.js    # Rate limiting
│   │   ├── validation.js     # Request validation
│   │   └── errorHandler.js   # Error handling
│   └── utils/
│       ├── logger.js         # Logging utility
│       └── helpers.js        # Helper functions
├── previews/                 # Generated preview files
├── package.json             # Dependencies & scripts
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 **Key Features**

### **1. Clean Architecture**

- **MVC Pattern**: Models, Views (JSON), Controllers
- **Service Layer**: Business logic separation
- **Middleware**: Cross-cutting concerns
- **Utilities**: Reusable helper functions

### **2. Robust API Design**

- **RESTful Endpoints**: Standard HTTP methods
- **Error Handling**: Comprehensive error responses
- **Validation**: Input sanitization and validation
- **Rate Limiting**: Protection against abuse

### **3. Enhanced AI Integration**

- **Real Gemini AI**: Google Generative AI support
- **Fallback System**: Enhanced mock responses
- **Context Awareness**: Smart component generation
- **Interaction Tracking**: AI usage analytics

### **4. Advanced Export System**

- **Multiple Formats**: HTML, React, Vue components
- **Live Preview**: Generated preview files
- **Code Quality**: Clean, production-ready output
- **Download Support**: Direct file downloads

## 📡 **API Endpoints**

### **Projects** (`/api/projects`)

```
GET    /api/projects           # List all projects
POST   /api/projects           # Create new project
GET    /api/projects/:id       # Get project by ID
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
POST   /api/projects/:id/duplicate # Duplicate project
```

### **AI Generation** (`/api/ai`)

```
POST   /api/ai/generate        # Generate single component
POST   /api/ai/generate/multiple # Generate multiple components
POST   /api/ai/generate/template # Generate from template
GET    /api/ai/history         # Get generation history
GET    /api/ai/stats          # Get AI statistics
```

### **Export** (`/api/export`)

```
POST   /api/export            # Export project code
POST   /api/export/download   # Download exported file
POST   /api/export/preview    # Generate preview only
GET    /api/export/formats    # Get available formats
```

### **Templates** (`/api/templates`)

```
GET    /api/templates         # List all templates
GET    /api/templates/categories # Get template categories
POST   /api/templates         # Create template
GET    /api/templates/:id     # Get template by ID
```

## 🛠️ **Getting Started**

### **1. Install Dependencies**

```bash
cd server
npm install
```

### **2. Environment Setup**

```bash
cp .env.example .env
# Edit .env with your configuration
```

### **3. Start Development Server**

```bash
npm run dev          # Start server
npm run dev:watch    # Start with auto-reload
```

### **4. Production Deployment**

```bash
npm start
```

## ⚙️ **Configuration**

### **Environment Variables**

```bash
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Security
JWT_SECRET=your-jwt-secret
RATE_LIMIT_MAX=100

# Features
FEATURE_AI_GENERATION=true
FEATURE_USER_AUTH=false
```

## 🔧 **Development Benefits**

### **1. Maintainability**

- **Single Responsibility**: Each module has one purpose
- **Clear Dependencies**: Easy to follow code flow
- **Consistent Patterns**: Predictable structure

### **2. Scalability**

- **Modular Design**: Easy to add new features
- **Service Layer**: Business logic abstraction
- **Configuration**: Environment-based settings

### **3. Reliability**

- **Error Handling**: Comprehensive error management
- **Validation**: Input sanitization
- **Logging**: Structured logging system

### **4. Developer Experience**

- **Clean Code**: Easy to read and understand
- **Documentation**: Well-documented APIs
- **Debugging**: Clear error messages

## 🚀 **What's New in v2.0**

✅ **Organized Architecture**: Clean file structure  
✅ **Enhanced AI**: Better Gemini integration  
✅ **Advanced Export**: Multiple format support  
✅ **Rate Limiting**: API protection  
✅ **Validation**: Input sanitization  
✅ **Error Handling**: Comprehensive error responses  
✅ **Logging**: Structured logging system  
✅ **Configuration**: Environment-based settings

## 📈 **Future Enhancements**

- [ ] User Authentication & Authorization
- [ ] Project Collaboration Features
- [ ] Real-time Updates with WebSockets
- [ ] Analytics & Usage Tracking
- [ ] Cloud Storage Integration
- [ ] Advanced AI Models Support

---

**The backend is now properly organized, maintainable, and ready for production!** 🎉
