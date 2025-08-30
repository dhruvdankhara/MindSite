const fs = require("fs");
const path = require("path");

class ExportService {
  constructor() {
    this.previewsDir = path.join(__dirname, "../../previews");
    this.ensurePreviewsDir();
  }

  ensurePreviewsDir() {
    if (!fs.existsSync(this.previewsDir)) {
      fs.mkdirSync(this.previewsDir, { recursive: true });
    }
  }

  async exportProject(components, settings = {}, format = "html") {
    try {
      let code, filename, mimeType;

      switch (format) {
        case "html":
          code = this.generateHTML(components, settings);
          filename = `${settings.title || "website"}.html`;
          mimeType = "text/html";
          break;
        case "react":
          code = this.generateReactComponent(components, settings);
          filename = `${settings.title || "Website"}.jsx`;
          mimeType = "text/javascript";
          break;
        case "vue":
          code = this.generateVueComponent(components, settings);
          filename = `${settings.title || "Website"}.vue`;
          mimeType = "text/javascript";
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Generate preview
      const previewId = Date.now().toString();
      const previewPath = path.join(this.previewsDir, `${previewId}.html`);

      if (format === "html") {
        fs.writeFileSync(previewPath, code);
      } else {
        // For React/Vue, create a wrapper HTML for preview
        const wrapperHTML = this.createPreviewWrapper(code, format);
        fs.writeFileSync(previewPath, wrapperHTML);
      }

      return {
        code,
        filename,
        mimeType,
        previewUrl: `/previews/${previewId}.html`,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  generateHTML(components, settings = {}) {
    const theme = settings.theme || "light";
    const primaryColor = settings.primaryColor || "#3b82f6";
    const fontFamily = settings.fontFamily || "Inter";

    return `<!DOCTYPE html>
<html lang="en" class="${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Generated with AI Website Builder">
    <title>${settings.title || "Generated Website"}</title>
    
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
    ${components
      .map((component) => this.componentToHTML(component))
      .join("\n    ")}
    
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

  componentToHTML(component) {
    const id = component.id || `component-${Date.now()}`;

    switch (component.type) {
      case "hero":
        return `<section id="${id}" class="component ${
          component.props.className ||
          "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-8 text-center"
        }">
          <div class="max-w-4xl mx-auto">
              <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">${
                component.props.title || "Hero Title"
              }</h1>
              <p class="text-xl md:text-2xl mb-8 opacity-90">${
                component.props.subtitle || "Hero subtitle"
              }</p>
              <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all hover-scale shadow-lg">
                  ${component.props.buttonText || "Get Started"}
              </button>
          </div>
        </section>`;

      case "navbar":
        return `<nav id="${id}" class="component ${
          component.props.className ||
          "w-full bg-white shadow-lg px-6 py-4 sticky top-0 z-50"
        }">
          <div class="max-w-6xl mx-auto flex justify-between items-center">
              <div class="font-bold text-xl text-gray-900">${
                component.props.logo || "Logo"
              }</div>
              <div class="hidden md:flex space-x-8">
                  ${(component.props.links || ["Home", "About", "Contact"])
                    .map(
                      (link) =>
                        `<a href="#${link.toLowerCase()}" class="text-gray-700 hover:text-blue-600 transition-colors">${link}</a>`
                    )
                    .join("\n                  ")}
              </div>
              <button class="md:hidden" data-mobile-menu-button>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
              </button>
          </div>
          <div class="md:hidden hidden mt-4" data-mobile-menu>
              ${(component.props.links || ["Home", "About", "Contact"])
                .map(
                  (link) =>
                    `<a href="#${link.toLowerCase()}" class="block py-2 text-gray-700 hover:text-blue-600">${link}</a>`
                )
                .join("\n              ")}
          </div>
        </nav>`;

      case "heading":
        const level = component.props.level || 1;
        return `<h${level} id="${id}" class="component ${
          component.props.className || "text-3xl font-bold text-gray-900"
        }">
                  ${component.props.text || "Heading"}
                </h${level}>`;

      case "paragraph":
        return `<p id="${id}" class="component ${
          component.props.className || "text-gray-700 leading-relaxed"
        }">
                  ${component.props.text || "Paragraph text"}
                </p>`;

      case "button":
        return `<button type="${component.props.type || "button"}" 
                        class="${
                          component.props.className ||
                          "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold hover-scale"
                        }">
                  ${component.props.text || "Button"}
                </button>`;

      case "image":
        return `<img id="${id}" 
                     src="${
                       component.props.src ||
                       "https://via.placeholder.com/300x200"
                     }" 
                     alt="${component.props.alt || "Image"}" 
                     class="component ${
                       component.props.className || "max-w-full h-auto"
                     }" />`;

      case "section":
        return `<section id="${id}" class="component ${
          component.props.className || "w-full py-16 px-8"
        }">
                  ${(component.children || [])
                    .map((child) => this.componentToHTML(child))
                    .join("\n          ")}
                </section>`;

      default:
        return `<div id="${id}" class="component ${
          component.props.className || "p-4 border border-gray-300"
        }">
                  ${component.props.text || "Component"}
                </div>`;
    }
  }

  generateReactComponent(components, settings = {}) {
    return `import React from 'react';

const GeneratedWebsite = () => {
  return (
    <div className="min-h-screen">
      ${components
        .map((component) => this.componentToReactJSX(component))
        .join("\n      ")}
    </div>
  );
};

export default GeneratedWebsite;`;
  }

  componentToReactJSX(component) {
    switch (component.type) {
      case "hero":
        return `<section className="${component.props.className}">
          <h1>{${JSON.stringify(component.props.title)}}</h1>
          <p>{${JSON.stringify(component.props.subtitle)}}</p>
          <button>{${JSON.stringify(component.props.buttonText)}}</button>
        </section>`;
      default:
        return `<div className="${component.props.className}">{${JSON.stringify(
          component.props.text || "Component"
        )}}</div>`;
    }
  }

  generateVueComponent(components, settings = {}) {
    return `<template>
  <div class="min-h-screen">
    <!-- Generated components -->
    ${components
      .map((component) => this.componentToVueTemplate(component))
      .join("\n    ")}
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

  componentToVueTemplate(component) {
    return `<div class="${component.props.className}">${
      component.props.text || "Component"
    }</div>`;
  }

  createPreviewWrapper(code, format) {
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
        <pre class="bg-gray-100 p-4 rounded-lg overflow-auto"><code>${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>
    </div>
</body>
</html>`;
  }
}

module.exports = new ExportService();
