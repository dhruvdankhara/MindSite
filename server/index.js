require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    components TEXT,
    settings TEXT,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    components TEXT,
    thumbnail TEXT,
    is_public INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ai_interactions (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    response TEXT,
    component_generated TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for previews
app.use('/previews', express.static(path.join(__dirname, 'previews')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Website Builder API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Projects API
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY updated_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const projects = rows.map(row => ({
      ...row,
      components: JSON.parse(row.components || '[]'),
      settings: JSON.parse(row.settings || '{}')
    }));
    
    res.json(projects);
  });
});

app.post('/api/projects', (req, res) => {
  const { name, description, components = [], settings = {} } = req.body;
  const id = Date.now().toString();
  
  db.run(
    'INSERT INTO projects (id, name, description, components, settings) VALUES (?, ?, ?, ?, ?)',
    [id, name, description, JSON.stringify(components), JSON.stringify(settings)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create project' });
      }
      
      res.status(201).json({
        id,
        name,
        description,
        components,
        settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  );
});

app.get('/api/projects/:id', (req, res) => {
  db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = {
      ...row,
      components: JSON.parse(row.components || '[]'),
      settings: JSON.parse(row.settings || '{}')
    };
    
    res.json(project);
  });
});

app.put('/api/projects/:id', (req, res) => {
  const { name, description, components, settings } = req.body;
  
  db.run(
    'UPDATE projects SET name = ?, description = ?, components = ?, settings = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, JSON.stringify(components), JSON.stringify(settings), req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update project' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ message: 'Project updated successfully' });
    }
  );
});

app.delete('/api/projects/:id', (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete project' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(204).send();
  });
});

// Enhanced AI Generation with Gemini
app.post('/api/ai/generate', async (req, res) => {
  const { prompt, type = 'component', context = {} } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let response;
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'demo-key') {
      response = await generateWithGemini(prompt, type, context);
    } else {
      // Fallback to enhanced mock responses
      response = await generateEnhancedMockResponse(prompt, type, context);
    }

    // Save AI interaction to database
    const interactionId = Date.now().toString();
    db.run(
      'INSERT INTO ai_interactions (id, prompt, response, component_generated) VALUES (?, ?, ?, ?)',
      [interactionId, prompt, response.description, JSON.stringify(response.component || response.components)]
    );

    res.json(response);
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'AI generation failed', details: error.message });
  }
});

// Real Gemini AI Integration
async function generateWithGemini(prompt, type, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const systemPrompt = `You are an expert web developer and designer. Generate React/HTML components based on user requests.

Context: You're helping users build websites using a drag-and-drop interface with pre-built components.

Available component types:
- hero: Hero sections with title, subtitle, and CTA
- navbar: Navigation bars with logo and links
- button: Interactive buttons
- form: Contact forms and input forms
- heading: H1-H6 headings
- paragraph: Text content
- image: Images with alt text
- section: Layout containers
- footer: Page footers
- card: Content cards
- grid: Grid layouts

For each request, return a JSON object with:
{
  "type": "component" | "layout" | "suggestion",
  "component": { "type": "...", "props": {...} },
  "components": [...] (for layouts),
  "description": "Human readable description",
  "suggestions": ["suggestion1", "suggestion2", ...]
}

User request: "${prompt}"
Type: ${type}
Context: ${JSON.stringify(context)}

Generate appropriate component(s) with realistic content and proper Tailwind CSS classes.`;

  const result = await model.generateContent(systemPrompt);
  const responseText = result.response.text();
  
  try {
    // Try to parse as JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback if JSON parsing fails
  }
  
  // Fallback to enhanced mock if Gemini response isn't parseable
  return await generateEnhancedMockResponse(prompt, type, context);
}

// Enhanced Mock Response System
async function generateEnhancedMockResponse(prompt, type, context) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Hero section generation
  if (lowerPrompt.includes('hero') || lowerPrompt.includes('banner') || lowerPrompt.includes('landing')) {
    const title = extractContent(prompt, ['title', 'heading', 'header']) || generateSmartTitle(prompt);
    const subtitle = extractContent(prompt, ['subtitle', 'description', 'tagline']) || generateSmartSubtitle(prompt);
    const buttonText = extractContent(prompt, ['button', 'cta', 'call-to-action']) || 'Get Started';
    
    return {
      type: 'component',
      component: {
        type: 'hero',
        props: {
          title,
          subtitle,
          buttonText,
          className: `w-full ${getColorScheme(prompt)} text-white py-24 px-8 text-center`
        }
      },
      description: `Generated a hero section with title "${title}" and call-to-action.`,
      suggestions: [
        'Add a background image',
        'Include social proof elements',
        'Add multiple CTA buttons',
        'Make it full-screen height'
      ]
    };
  }
  
  // Navigation generation
  if (lowerPrompt.includes('nav') || lowerPrompt.includes('menu') || lowerPrompt.includes('header')) {
    const logo = extractContent(prompt, ['logo', 'brand', 'company']) || 'Brand';
    const links = extractLinks(prompt) || ['Home', 'About', 'Services', 'Contact'];
    
    return {
      type: 'component',
      component: {
        type: 'navbar',
        props: {
          logo,
          links,
          className: 'w-full bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50'
        }
      },
      description: `Generated a navigation bar with ${links.length} menu items.`,
      suggestions: [
        'Add dropdown menus',
        'Include search functionality',
        'Add mobile hamburger menu',
        'Include user account menu'
      ]
    };
  }
  
  // Form generation
  if (lowerPrompt.includes('form') || lowerPrompt.includes('contact') || lowerPrompt.includes('signup')) {
    const formType = lowerPrompt.includes('contact') ? 'contact' : 
                    lowerPrompt.includes('signup') ? 'signup' : 'general';
    
    return {
      type: 'layout',
      components: generateFormComponents(formType, prompt),
      description: `Generated a ${formType} form with validation and styling.`,
      suggestions: [
        'Add form validation',
        'Include file upload',
        'Add checkbox for terms',
        'Include progress indicator'
      ]
    };
  }
  
  // Button generation
  if (lowerPrompt.includes('button') || lowerPrompt.includes('cta')) {
    const text = extractContent(prompt, ['text', 'label', 'says']) || 'Click Here';
    const style = getButtonStyle(prompt);
    
    return {
      type: 'component',
      component: {
        type: 'button',
        props: {
          text,
          className: style
        }
      },
      description: `Generated a ${style.includes('primary') ? 'primary' : 'secondary'} button.`,
      suggestions: [
        'Add hover animations',
        'Include an icon',
        'Make it larger/smaller',
        'Change color scheme'
      ]
    };
  }
  
  // Layout generation
  if (lowerPrompt.includes('section') || lowerPrompt.includes('layout') || lowerPrompt.includes('page')) {
    return generateLayoutComponents(prompt);
  }
  
  // Default suggestion
  return {
    type: 'suggestion',
    description: 'I can help you create various components. Try being more specific about what you want to build.',
    suggestions: [
      'Create a hero section with title "Welcome to My Site"',
      'Add a navigation bar with logo and menu items',
      'Generate a contact form with name, email, and message fields',
      'Create a pricing section with three tiers',
      'Add a footer with social media links'
    ]
  };
}

// Helper functions for enhanced AI
function extractContent(prompt, keywords) {
  for (const keyword of keywords) {
    const patterns = [
      new RegExp(`${keyword}[:\\s]+["']([^"']+)["']`, 'i'),
      new RegExp(`${keyword}[:\\s]+([^,\\.!?\\n]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        return match[1].trim();
      }
    }
  }
  return null;
}

function generateSmartTitle(prompt) {
  if (prompt.includes('business') || prompt.includes('company')) return 'Grow Your Business';
  if (prompt.includes('portfolio') || prompt.includes('creative')) return 'Creative Portfolio';
  if (prompt.includes('startup') || prompt.includes('launch')) return 'Launch Your Startup';
  if (prompt.includes('service') || prompt.includes('agency')) return 'Professional Services';
  return 'Welcome to Our Platform';
}

function generateSmartSubtitle(prompt) {
  if (prompt.includes('business')) return 'Scale your business with our innovative solutions';
  if (prompt.includes('portfolio')) return 'Showcasing creativity and innovation';
  if (prompt.includes('startup')) return 'From idea to reality in record time';
  if (prompt.includes('service')) return 'Excellence in every detail we deliver';
  return 'Building amazing experiences for modern web';
}

function getColorScheme(prompt) {
  if (prompt.includes('blue')) return 'bg-gradient-to-r from-blue-600 to-blue-800';
  if (prompt.includes('green')) return 'bg-gradient-to-r from-green-600 to-green-800';
  if (prompt.includes('purple')) return 'bg-gradient-to-r from-purple-600 to-purple-800';
  if (prompt.includes('red')) return 'bg-gradient-to-r from-red-600 to-red-800';
  if (prompt.includes('dark')) return 'bg-gradient-to-r from-gray-800 to-gray-900';
  return 'bg-gradient-to-r from-blue-600 to-purple-600';
}

function extractLinks(prompt) {
  const linkMatch = prompt.match(/links?[:\s]+\[([^\]]+)\]/i);
  if (linkMatch) {
    return linkMatch[1].split(',').map(link => link.trim().replace(/["']/g, ''));
  }
  
  const menuMatch = prompt.match(/menu[:\s]+([^,\\.!?\\n]+)/i);
  if (menuMatch) {
    return menuMatch[1].split(/\s+(?:and|,)\s+/).map(link => link.trim());
  }
  
  return null;
}

function getButtonStyle(prompt) {
  const size = prompt.includes('large') || prompt.includes('big') ? 'px-8 py-4 text-lg' : 'px-6 py-3';
  const color = prompt.includes('green') ? 'bg-green-600 hover:bg-green-700' :
               prompt.includes('red') ? 'bg-red-600 hover:bg-red-700' :
               prompt.includes('purple') ? 'bg-purple-600 hover:bg-purple-700' :
               'bg-blue-600 hover:bg-blue-700';
  
  return `${size} ${color} text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl`;
}

function generateFormComponents(type, prompt) {
  const baseForm = {
    type: 'form',
    props: {
      className: 'max-w-md mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border'
    },
    children: []
  };
  
  if (type === 'contact') {
    baseForm.children = [
      { type: 'heading', props: { text: 'Contact Us', level: 2, className: 'text-2xl font-bold text-gray-900 mb-6' } },
      { type: 'input', props: { placeholder: 'Your Name *', type: 'text', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'input', props: { placeholder: 'Your Email *', type: 'email', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'input', props: { placeholder: 'Subject', type: 'text', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'textarea', props: { placeholder: 'Your Message *', rows: 5, className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'button', props: { text: 'Send Message', type: 'submit', className: 'w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors' } }
    ];
  } else if (type === 'signup') {
    baseForm.children = [
      { type: 'heading', props: { text: 'Create Account', level: 2, className: 'text-2xl font-bold text-gray-900 mb-6' } },
      { type: 'input', props: { placeholder: 'First Name', type: 'text', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'input', props: { placeholder: 'Last Name', type: 'text', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'input', props: { placeholder: 'Email Address', type: 'email', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'input', props: { placeholder: 'Password', type: 'password', className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' } },
      { type: 'button', props: { text: 'Sign Up', type: 'submit', className: 'w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors' } }
    ];
  }
  
  return [baseForm];
}

function generateLayoutComponents(prompt) {
  // This could be expanded to generate complex layouts
  return {
    type: 'layout',
    components: [
      {
        type: 'section',
        props: {
          className: 'w-full py-16 px-8 bg-gray-50'
        }
      }
    ],
    description: 'Generated a flexible section layout.',
    suggestions: [
      'Add background patterns',
      'Include grid layout',
      'Add parallax scrolling',
      'Include animation effects'
    ]
  };
}

// Templates API
app.get('/api/templates', (req, res) => {
  db.all('SELECT * FROM templates WHERE is_public = 1 ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const templates = rows.map(row => ({
      ...row,
      components: JSON.parse(row.components || '[]')
    }));
    
    res.json(templates);
  });
});

// Enhanced Export with Live Preview
app.post('/api/export', async (req, res) => {
  const { components, settings, format = 'html' } = req.body;
  
  try {
    let code, filename, mimeType;
    
    switch (format) {
      case 'html':
        code = generateAdvancedHTML(components, settings);
        filename = 'website.html';
        mimeType = 'text/html';
        break;
      case 'react':
        code = generateReactComponent(components, settings);
        filename = 'Website.jsx';
        mimeType = 'text/javascript';
        break;
      case 'vue':
        code = generateVueComponent(components, settings);
        filename = 'Website.vue';
        mimeType = 'text/javascript';
        break;
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }
    
    // Generate preview
    const previewId = Date.now().toString();
    const previewPath = path.join(__dirname, 'previews', `${previewId}.html`);
    
    // Ensure previews directory exists
    const previewDir = path.dirname(previewPath);
    if (!fs.existsSync(previewDir)) {
      fs.mkdirSync(previewDir, { recursive: true });
    }
    
    if (format === 'html') {
      fs.writeFileSync(previewPath, code);
    } else {
      // For React/Vue, create a wrapper HTML for preview
      const wrapperHTML = createPreviewWrapper(code, format);
      fs.writeFileSync(previewPath, wrapperHTML);
    }
    
    res.json({
      code,
      filename,
      mimeType,
      previewUrl: `/previews/${previewId}.html`,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed', details: error.message });
  }
});

// Advanced HTML Generation
function generateAdvancedHTML(components, settings = {}) {
  const theme = settings.theme || 'light';
  const primaryColor = settings.primaryColor || '#3b82f6';
  const fontFamily = settings.fontFamily || 'Inter';
  
  return `<!DOCTYPE html>
<html lang="en" class="${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Generated with AI Website Builder">
    <title>${settings.title || 'Generated Website'}</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        :root {
            --primary-color: ${primaryColor};
            --font-family: '${fontFamily}', system-ui, sans-serif;
        }
        
        body {
            font-family: var(--font-family);
        }
        
        .smooth-scroll {
            scroll-behavior: smooth;
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-scale {
            transition: transform 0.2s ease;
        }
        
        .hover-scale:hover {
            transform: scale(1.05);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 4px;
        }
    </style>
</head>
<body class="smooth-scroll">
    ${components.map(component => componentToAdvancedHTML(component)).join('\n    ')}
    
    <!-- Enhanced JavaScript -->
    <script>
        // Modern JavaScript enhancements
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Form enhancements
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Basic form validation
                    const requiredFields = form.querySelectorAll('[required]');
                    let isValid = true;
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            field.classList.add('border-red-500');
                            isValid = false;
                        } else {
                            field.classList.remove('border-red-500');
                        }
                    });
                    
                    if (isValid) {
                        // Show success message
                        const successDiv = document.createElement('div');
                        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                        successDiv.textContent = 'Thank you! Your message has been sent.';
                        document.body.appendChild(successDiv);
                        
                        // Remove after 3 seconds
                        setTimeout(() => {
                            successDiv.remove();
                        }, 3000);
                        
                        // Reset form
                        form.reset();
                    }
                });
            });
            
            // Add fade-in animation to elements as they scroll into view
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('section, .card, .component').forEach(el => {
                observer.observe(el);
            });
            
            // Mobile menu toggle (if navbar exists)
            const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
            const mobileMenu = document.querySelector('[data-mobile-menu]');
            
            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
            }
        });
        
        console.log('🎉 Website generated with AI Website Builder v2.0');
    </script>
</body>
</html>`;
}

function componentToAdvancedHTML(component) {
  const id = component.id || `component-${Date.now()}`;
  
  switch (component.type) {
    case 'hero':
      return `<section id="${id}" class="component ${component.props.className || 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-8 text-center'}">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">${component.props.title || 'Hero Title'}</h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90">${component.props.subtitle || 'Hero subtitle'}</p>
            <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all hover-scale shadow-lg">
                ${component.props.buttonText || 'Get Started'}
            </button>
        </div>
      </section>`;
      
    case 'navbar':
      return `<nav id="${id}" class="component ${component.props.className || 'w-full bg-white shadow-lg px-6 py-4 sticky top-0 z-50'}">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="font-bold text-xl text-gray-900">${component.props.logo || 'Logo'}</div>
            <div class="hidden md:flex space-x-8">
                ${(component.props.links || ['Home', 'About', 'Contact']).map(link => 
                  `<a href="#${link.toLowerCase()}" class="text-gray-700 hover:text-blue-600 transition-colors">${link}</a>`
                ).join('\n                ')}
            </div>
            <button class="md:hidden" data-mobile-menu-button>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        <div class="md:hidden hidden mt-4" data-mobile-menu>
            ${(component.props.links || ['Home', 'About', 'Contact']).map(link => 
              `<a href="#${link.toLowerCase()}" class="block py-2 text-gray-700 hover:text-blue-600">${link}</a>`
            ).join('\n            ')}
        </div>
      </nav>`;
      
    case 'form':
      return `<section id="${id}" class="component py-16 px-8">
        <form class="${component.props.className || 'max-w-md mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg'}">
            ${(component.children || []).map(child => componentToAdvancedHTML(child)).join('\n            ')}
        </form>
      </section>`;
      
    case 'input':
      return `<input type="${component.props.type || 'text'}" 
                     placeholder="${component.props.placeholder || ''}" 
                     class="${component.props.className || 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'}"
                     ${component.props.required ? 'required' : ''}>`;
      
    case 'textarea':
      return `<textarea placeholder="${component.props.placeholder || ''}" 
                        rows="${component.props.rows || 4}"
                        class="${component.props.className || 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'}"
                        ${component.props.required ? 'required' : ''}></textarea>`;
      
    case 'button':
      return `<button type="${component.props.type || 'button'}" 
                      class="${component.props.className || 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold hover-scale'}">
                ${component.props.text || 'Button'}
              </button>`;
      
    case 'heading':
      const level = component.props.level || 1;
      return `<h${level} id="${id}" class="component ${component.props.className || 'text-3xl font-bold text-gray-900'}">
                ${component.props.text || 'Heading'}
              </h${level}>`;
      
    case 'paragraph':
      return `<p id="${id}" class="component ${component.props.className || 'text-gray-700 leading-relaxed'}">
                ${component.props.text || 'Paragraph text'}
              </p>`;
      
    case 'section':
      return `<section id="${id}" class="component ${component.props.className || 'w-full py-16 px-8'}">
                ${(component.children || []).map(child => componentToAdvancedHTML(child)).join('\n        ')}
              </section>`;
      
    case 'footer':
      return `<footer id="${id}" class="component ${component.props.className || 'w-full bg-gray-900 text-white py-8 px-8 text-center'}">
                <p>${component.props.text || '© 2025 Generated with AI Website Builder'}</p>
              </footer>`;
      
    default:
      return `<div id="${id}" class="component ${component.props.className || 'p-4 border border-gray-300'}">
                ${component.props.text || 'Component'}
              </div>`;
  }
}

// React Component Generation
function generateReactComponent(components, settings = {}) {
  return `import React from 'react';

const GeneratedWebsite = () => {
  return (
    <div className="min-h-screen">
      ${components.map(component => componentToReactJSX(component)).join('\n      ')}
    </div>
  );
};

export default GeneratedWebsite;`;
}

function componentToReactJSX(component) {
  // This would be expanded to generate proper React JSX
  // For now, simplified version
  switch (component.type) {
    case 'hero':
      return `<section className="${component.props.className}">
        <h1>{${JSON.stringify(component.props.title)}}</h1>
        <p>{${JSON.stringify(component.props.subtitle)}}</p>
        <button>{${JSON.stringify(component.props.buttonText)}}</button>
      </section>`;
    default:
      return `<div className="${component.props.className}">{${JSON.stringify(component.props.text || 'Component')}}</div>`;
  }
}

// Vue Component Generation
function generateVueComponent(components, settings = {}) {
  return `<template>
  <div class="min-h-screen">
    <!-- Generated components -->
    ${components.map(component => componentToVueTemplate(component)).join('\n    ')}
  </div>
</template>

<script>
export default {
  name: 'GeneratedWebsite',
  data() {
    return {
      // Component data
    }
  }
}
</script>

<style scoped>
/* Component styles */
</style>`;
}

function componentToVueTemplate(component) {
  // Simplified Vue template generation
  return `<div class="${component.props.className}">${component.props.text || 'Component'}</div>`;
}

function createPreviewWrapper(code, format) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview - ${format.toUpperCase()}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-4">Generated ${format.toUpperCase()} Code Preview</h1>
        <pre class="bg-gray-100 p-4 rounded-lg overflow-auto"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
</body>
</html>`;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enhanced AI Website Builder API v2.0 running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api`);
  console.log(`🤖 AI powered by: ${process.env.GEMINI_API_KEY ? 'Google Gemini' : 'Enhanced Mock System'}`);
  console.log(`💾 Database: SQLite (${dbPath})`);
});

module.exports = app;
