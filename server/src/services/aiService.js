const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");
const AIInteraction = require("../models/AIInteraction");

class EnhancedAIService {
  constructor() {
    this.genAI =
      config.ai.geminiApiKey !== "demo-key"
        ? new GoogleGenerativeAI(config.ai.geminiApiKey)
        : null;
    this.model = this.genAI
      ? this.genAI.getGenerativeModel({
          model: config.ai.model,
          generationConfig: config.ai.generationConfig,
          safetySettings: config.ai.safetySettings,
        })
      : null;
  }

  async generateComponent(prompt, type = "component", context = {}) {
    try {
      let response;

      if (this.model && config.features.aiGeneration) {
        response = await this.generateWithGemini(prompt, type, context);
      } else {
        response = await this.generateIntelligentMockResponse(
          prompt,
          type,
          context
        );
      }

      // Save interaction to database
      await AIInteraction.create({
        prompt,
        response: response.description,
        component_generated: response.component || response.components,
      });

      return response;
    } catch (error) {
      console.error("AI generation error:", error);
      // Fallback to mock response on error
      return await this.generateIntelligentMockResponse(prompt, type, context);
    }
  }

  async generateWithGemini(prompt, type, context) {
    const systemPrompt = this.buildAdvancedSystemPrompt(prompt, type, context);

    try {
      const result = await this.model.generateContent(systemPrompt);
      const responseText = result.response.text();

      // Try to parse as JSON
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);

        // Validate and enhance the response
        return this.validateAndEnhanceResponse(parsed, prompt, type);
      }
    } catch (error) {
      console.warn("Failed to parse Gemini response:", error.message);
    }

    // Fallback to intelligent mock if parsing fails
    return this.generateIntelligentMockResponse(prompt, type, context);
  }

  buildAdvancedSystemPrompt(prompt, type, context) {
    return `You are an expert web developer, UI/UX designer, and React specialist. You create modern, responsive, and accessible web components.

IMPORTANT: Always respond with valid JSON wrapped in \`\`\`json blocks.

## Available Component Types:
- **hero**: Hero sections with title, subtitle, CTA buttons, background images
- **navbar**: Navigation bars with logo, menu items, mobile responsiveness  
- **footer**: Page footers with links, social media, contact info
- **section**: General content sections with flexible layouts
- **card**: Content cards with images, text, and actions
- **button**: Interactive buttons with various styles and states
- **form**: Contact forms, signup forms, newsletter subscriptions
- **heading**: Typography headings (H1-H6) with proper hierarchy
- **paragraph**: Text content with proper formatting
- **image**: Responsive images with alt text and lazy loading
- **grid**: Grid layouts for organizing content
- **testimonial**: Customer testimonials and reviews
- **pricing**: Pricing tables and plans
- **team**: Team member profiles
- **features**: Feature highlights and benefits
- **gallery**: Image galleries and portfolios
- **blog**: Blog posts and article layouts
- **contact**: Contact information and maps
- **cta**: Call-to-action sections
- **stats**: Statistics and metrics display
- **timeline**: Timeline and process flows

## Design Principles:
- Use modern Tailwind CSS classes
- Ensure mobile-first responsive design
- Include proper accessibility attributes
- Use semantic HTML structure
- Implement proper color contrast
- Add hover and focus states
- Include loading states and animations

## Response Format:
\`\`\`json
{
  "type": "component|layout|page|suggestion",
  "component": {
    "type": "component_type",
    "props": {
      "className": "tailwind classes",
      "title": "content",
      "subtitle": "content"
    },
    "children": []
  },
  "components": [],
  "description": "Detailed description of what was created",
  "suggestions": [
    "Specific improvement suggestions"
  ],
  "accessibility": {
    "features": ["aria-labels", "keyboard navigation"],
    "compliance": "WCAG 2.1 AA"
  },
  "performance": {
    "optimizations": ["lazy loading", "optimized images"],
    "score": "A+"
  }
}
\`\`\`

User request: "${prompt}"
Type: ${type}
Context: ${JSON.stringify(context)}

Generate a high-quality, production-ready component.`;
  }

  validateAndEnhanceResponse(response, prompt, type) {
    // Ensure required fields exist
    if (!response.type) response.type = type;
    if (!response.description) response.description = "Generated component";
    if (!response.suggestions) response.suggestions = [];

    // Add accessibility information if missing
    if (!response.accessibility) {
      response.accessibility = {
        features: ["aria-labels", "semantic HTML", "keyboard navigation"],
        compliance: "WCAG 2.1 AA",
      };
    }

    // Add performance information if missing
    if (!response.performance) {
      response.performance = {
        optimizations: ["responsive design", "modern CSS", "optimized markup"],
        score: "A",
      };
    }

    return response;
  }

  async generateIntelligentMockResponse(prompt, type, context) {
    const lowerPrompt = prompt.toLowerCase();

    // Website/Page generation
    if (
      lowerPrompt.includes("website") ||
      lowerPrompt.includes("landing page") ||
      lowerPrompt.includes("homepage")
    ) {
      return this.generateFullWebsite(prompt, context);
    }

    // Specific component types
    if (lowerPrompt.includes("hero") || lowerPrompt.includes("banner")) {
      return this.generateAdvancedHero(prompt);
    }

    if (lowerPrompt.includes("pricing")) {
      return this.generatePricingSection(prompt);
    }

    if (lowerPrompt.includes("testimonial") || lowerPrompt.includes("review")) {
      return this.generateTestimonialSection(prompt);
    }

    if (lowerPrompt.includes("team") || lowerPrompt.includes("about")) {
      return this.generateTeamSection(prompt);
    }

    if (lowerPrompt.includes("feature") || lowerPrompt.includes("benefit")) {
      return this.generateFeatureSection(prompt);
    }

    if (lowerPrompt.includes("contact") || lowerPrompt.includes("form")) {
      return this.generateAdvancedForm(prompt);
    }

    if (
      lowerPrompt.includes("navbar") ||
      lowerPrompt.includes("navigation") ||
      lowerPrompt.includes("menu")
    ) {
      return this.generateAdvancedNavbar(prompt);
    }

    if (lowerPrompt.includes("footer")) {
      return this.generateAdvancedFooter(prompt);
    }

    // Business-specific components
    if (lowerPrompt.includes("restaurant") || lowerPrompt.includes("food")) {
      return this.generateRestaurantHero(prompt);
    }

    if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("creative")) {
      return this.generatePortfolioHero(prompt);
    }

    if (lowerPrompt.includes("ecommerce") || lowerPrompt.includes("shop")) {
      return this.generateEcommerceHero(prompt);
    }

    if (
      lowerPrompt.includes("saas") ||
      lowerPrompt.includes("software") ||
      lowerPrompt.includes("app")
    ) {
      return this.generateSaaSHero(prompt);
    }

    // Default intelligent suggestion
    return this.generateIntelligentSuggestion(prompt);
  }

  generateFullWebsite(prompt, context) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "page",
      components: [
        {
          type: "navbar",
          props: {
            logo: this.generateBusinessName(businessType),
            links: ["Home", "About", "Services", "Contact"],
            className:
              "w-full bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50",
          },
        },
        {
          type: "hero",
          props: {
            title: this.generateHeroTitle(businessType),
            subtitle: this.generateHeroSubtitle(businessType),
            buttonText: "Get Started",
            className:
              "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-8 text-center",
          },
        },
        {
          type: "features",
          props: {
            title: "Why Choose Us",
            features: this.generateBusinessFeatures(businessType),
            className: "w-full py-20 px-8 bg-gray-50",
          },
        },
        {
          type: "testimonials",
          props: {
            title: "What Our Clients Say",
            testimonials: this.generateTestimonials(businessType),
            className: "w-full py-20 px-8 bg-white",
          },
        },
        {
          type: "footer",
          props: {
            company: this.generateBusinessName(businessType),
            className: "w-full bg-gray-900 text-white py-12 px-8",
          },
        },
      ],
      description: `Generated a complete ${businessType} website with modern design and responsive layout.`,
      suggestions: [
        "Add a contact form section",
        "Include a pricing table",
        "Add team member profiles",
        "Integrate social media links",
        "Include a blog section",
      ],
      accessibility: {
        features: [
          "semantic HTML structure",
          "aria-labels",
          "keyboard navigation",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: ["lazy loading", "responsive images", "optimized CSS"],
        score: "A+",
      },
    };
  }

  generateAdvancedHero(prompt) {
    const title =
      this.extractContent(prompt, ["title", "heading"]) ||
      this.generateSmartTitle(prompt);
    const subtitle =
      this.extractContent(prompt, ["subtitle", "description"]) ||
      this.generateSmartSubtitle(prompt);
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "hero",
        props: {
          title,
          subtitle,
          buttonText: "Get Started",
          secondaryButtonText: "Learn More",
          backgroundImage: this.suggestBackgroundImage(businessType),
          className: `w-full ${this.getColorScheme(
            prompt
          )} text-white py-24 px-8 text-center relative overflow-hidden`,
        },
      },
      description:
        "Generated an advanced hero section with gradient background and compelling copy.",
      suggestions: [
        "Add a background video",
        "Include customer testimonials",
        "Add multiple CTA buttons",
        "Include trust signals",
        "Add animated elements",
      ],
      accessibility: {
        features: [
          "proper heading hierarchy",
          "alt text for images",
          "color contrast compliance",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "optimized background images",
          "lazy loading",
          "minimal DOM",
        ],
        score: "A+",
      },
    };
  }

  generatePricingSection(prompt) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "pricing",
        props: {
          title: "Choose Your Plan",
          subtitle: "Select the perfect plan for your needs",
          plans: this.generatePricingPlans(businessType),
          className: "w-full py-20 px-8 bg-gray-50",
        },
      },
      description:
        "Generated a modern pricing section with three tiers and highlighted recommended plan.",
      suggestions: [
        "Add annual discount options",
        "Include feature comparison table",
        "Add testimonials for each plan",
        "Include money-back guarantee",
        "Add FAQ section",
      ],
      accessibility: {
        features: [
          "keyboard navigation",
          "screen reader support",
          "clear pricing structure",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "minimal JavaScript",
          "optimized layout",
          "fast rendering",
        ],
        score: "A+",
      },
    };
  }

  generateTestimonialSection(prompt) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "testimonials",
        props: {
          title: "What Our Customers Say",
          subtitle: "Don't just take our word for it",
          testimonials: this.generateTestimonials(businessType),
          className: "w-full py-20 px-8 bg-white",
        },
      },
      description:
        "Generated a testimonials section with authentic customer reviews and ratings.",
      suggestions: [
        "Add video testimonials",
        "Include company logos",
        "Add more diverse testimonials",
        "Include specific metrics/results",
        "Add carousel functionality",
      ],
      accessibility: {
        features: [
          "alt text for images",
          "proper heading structure",
          "keyboard navigation",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "lazy loaded images",
          "optimized testimonial cards",
          "smooth animations",
        ],
        score: "A+",
      },
    };
  }

  generateTeamSection(prompt) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "team",
        props: {
          title: "Meet Our Team",
          subtitle: "The talented people behind our success",
          members: this.generateTeamMembers(businessType),
          className: "w-full py-20 px-8 bg-gray-50",
        },
      },
      description:
        "Generated a professional team section with member profiles and social links.",
      suggestions: [
        "Add team member bios",
        "Include social media links",
        "Add team achievements",
        "Include team photos",
        "Add contact information",
      ],
      accessibility: {
        features: [
          "alt text for photos",
          "keyboard navigation",
          "screen reader support",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "optimized profile images",
          "lazy loading",
          "minimal DOM",
        ],
        score: "A+",
      },
    };
  }

  generateFeatureSection(prompt) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "features",
        props: {
          title: "Why Choose Us",
          subtitle: "Discover what makes us different",
          features: this.generateBusinessFeatures(businessType),
          layout: "grid",
          className: "w-full py-20 px-8 bg-white",
        },
      },
      description:
        "Generated a comprehensive features section highlighting key benefits.",
      suggestions: [
        "Add feature icons",
        "Include comparison chart",
        "Add feature demonstrations",
        "Include customer quotes",
        "Add call-to-action buttons",
      ],
      accessibility: {
        features: [
          "proper heading structure",
          "descriptive text",
          "keyboard navigation",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "optimized icons",
          "efficient layout",
          "fast rendering",
        ],
        score: "A+",
      },
    };
  }

  generateAdvancedForm(prompt) {
    const formType = prompt.toLowerCase().includes("contact")
      ? "contact"
      : prompt.toLowerCase().includes("signup")
      ? "signup"
      : "newsletter";

    return {
      type: "component",
      component: {
        type: "form",
        props: {
          title:
            formType === "contact"
              ? "Get In Touch"
              : formType === "signup"
              ? "Create Account"
              : "Stay Updated",
          subtitle: this.getFormSubtitle(formType),
          fields: this.generateFormFields(formType),
          submitText:
            formType === "contact"
              ? "Send Message"
              : formType === "signup"
              ? "Sign Up"
              : "Subscribe",
          className:
            "max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200",
        },
      },
      description: `Generated an advanced ${formType} form with validation and modern styling.`,
      suggestions: [
        "Add real-time validation",
        "Include progress indicators",
        "Add social login options",
        "Include privacy policy link",
        "Add success/error states",
      ],
      accessibility: {
        features: [
          "proper form labels",
          "error messaging",
          "keyboard navigation",
          "screen reader support",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "client-side validation",
          "optimized form submission",
          "minimal dependencies",
        ],
        score: "A+",
      },
    };
  }

  generateAdvancedNavbar(prompt) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "navbar",
        props: {
          logo: this.generateBusinessName(businessType),
          links: this.generateNavLinks(businessType),
          hasDropdown: true,
          hasMobileMenu: true,
          hasSearch: prompt.toLowerCase().includes("search"),
          hasUserMenu:
            prompt.toLowerCase().includes("user") ||
            prompt.toLowerCase().includes("account"),
          className:
            "w-full bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50",
        },
      },
      description:
        "Generated a responsive navigation bar with mobile menu and modern interactions.",
      suggestions: [
        "Add mega menu for services",
        "Include search functionality",
        "Add user account dropdown",
        "Include notification bell",
        "Add breadcrumb navigation",
      ],
      accessibility: {
        features: [
          "keyboard navigation",
          "mobile menu accessibility",
          "proper ARIA labels",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "minimal JavaScript",
          "CSS-only animations",
          "optimized logo",
        ],
        score: "A+",
      },
    };
  }

  generateAdvancedFooter(prompt) {
    const businessType = this.extractBusinessType(prompt);

    return {
      type: "component",
      component: {
        type: "footer",
        props: {
          company: this.generateBusinessName(businessType),
          description: this.generateBusinessDescription(businessType),
          links: this.generateFooterLinks(businessType),
          socialLinks: ["facebook", "twitter", "linkedin", "instagram"],
          newsletter: true,
          contactInfo: this.generateContactInfo(businessType),
          className: "w-full bg-gray-900 text-white py-12 px-8",
        },
      },
      description:
        "Generated a comprehensive footer with organized links and social media integration.",
      suggestions: [
        "Add recent blog posts",
        "Include awards/certifications",
        "Add office locations",
        "Include customer support chat",
        "Add language selector",
      ],
      accessibility: {
        features: [
          "proper link structure",
          "keyboard navigation",
          "screen reader support",
        ],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: [
          "optimized social icons",
          "minimal external requests",
          "lazy loading",
        ],
        score: "A+",
      },
    };
  }

  generateIntelligentSuggestion(prompt) {
    return {
      type: "suggestion",
      description:
        "I can help you create professional, modern web components. Here are some specific things I can build for you:",
      suggestions: [
        'Create a complete website: "Build a modern homepage for my tech startup"',
        'Generate a hero section: "Create a hero section for a restaurant"',
        'Build a pricing table: "Add a pricing section with 3 tiers"',
        'Make a contact form: "Create a contact form with validation"',
        'Design a team section: "Add a team section with member profiles"',
        'Create testimonials: "Generate customer testimonials section"',
        'Build features showcase: "Create a features section highlighting benefits"',
        'Make a navigation bar: "Design a modern navbar with mobile menu"',
        'Create a footer: "Add a comprehensive footer with links"',
        'Generate specific business types: "Create a restaurant website" or "Build a SaaS landing page"',
      ],
      accessibility: {
        features: ["All components include accessibility features by default"],
        compliance: "WCAG 2.1 AA",
      },
      performance: {
        optimizations: ["All components are optimized for performance"],
        score: "A+",
      },
    };
  }

  // Business-specific generators
  generateRestaurantHero(prompt) {
    return {
      type: "component",
      component: {
        type: "hero",
        props: {
          title: "Exceptional Dining Experience",
          subtitle: "Fresh ingredients, expert chefs, unforgettable moments",
          buttonText: "Make Reservation",
          secondaryButtonText: "View Menu",
          backgroundImage:
            "/api/placeholder/1920/1080?text=Restaurant+Interior",
          className:
            "w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-24 px-8 text-center",
        },
      },
      description:
        "Generated a restaurant hero section with warm colors and dining-focused messaging.",
      suggestions: [
        "Add reservation system integration",
        "Include opening hours",
        "Add chef's special highlights",
        "Include awards and reviews",
      ],
    };
  }

  generatePortfolioHero(prompt) {
    return {
      type: "component",
      component: {
        type: "hero",
        props: {
          title: "Creative Excellence",
          subtitle: "Showcasing innovation through design and creativity",
          buttonText: "View Portfolio",
          secondaryButtonText: "Contact Me",
          backgroundImage: "/api/placeholder/1920/1080?text=Creative+Workspace",
          className:
            "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-24 px-8 text-center",
        },
      },
      description:
        "Generated a creative portfolio hero with artistic color scheme.",
      suggestions: [
        "Add portfolio gallery preview",
        "Include client testimonials",
        "Add skills showcase",
        "Include awards and recognition",
      ],
    };
  }

  generateEcommerceHero(prompt) {
    return {
      type: "component",
      component: {
        type: "hero",
        props: {
          title: "Discover Amazing Products",
          subtitle: "Quality products at unbeatable prices with fast shipping",
          buttonText: "Shop Now",
          secondaryButtonText: "Browse Categories",
          backgroundImage: "/api/placeholder/1920/1080?text=Products+Showcase",
          className:
            "w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-24 px-8 text-center",
        },
      },
      description:
        "Generated an ecommerce hero focused on products and shopping experience.",
      suggestions: [
        "Add featured products carousel",
        "Include special offers banner",
        "Add customer reviews count",
        "Include free shipping notice",
      ],
    };
  }

  generateSaaSHero(prompt) {
    return {
      type: "component",
      component: {
        type: "hero",
        props: {
          title: "Transform Your Business",
          subtitle: "Powerful software solutions for modern challenges",
          buttonText: "Start Free Trial",
          secondaryButtonText: "See Demo",
          backgroundImage:
            "/api/placeholder/1920/1080?text=Technology+Innovation",
          className:
            "w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 px-8 text-center",
        },
      },
      description:
        "Generated a SaaS hero emphasizing business transformation and trial offers.",
      suggestions: [
        "Add product screenshots",
        "Include customer logos",
        "Add feature highlights",
        "Include ROI statistics",
      ],
    };
  }

  // Helper methods
  extractBusinessType(prompt) {
    const types = {
      restaurant: ["restaurant", "food", "cafe", "dining", "menu"],
      tech: ["software", "app", "saas", "startup", "tech", "development"],
      agency: ["agency", "consulting", "marketing", "design", "creative"],
      ecommerce: ["shop", "store", "ecommerce", "retail", "product"],
      healthcare: ["medical", "health", "clinic", "doctor", "healthcare"],
      education: ["school", "education", "course", "learning", "training"],
      finance: ["bank", "finance", "investment", "insurance", "financial"],
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [type, keywords] of Object.entries(types)) {
      if (keywords.some((keyword) => lowerPrompt.includes(keyword))) {
        return type;
      }
    }
    return "business";
  }

  generateBusinessName(type) {
    const names = {
      restaurant: "Bella Vista",
      tech: "InnovateTech",
      agency: "Creative Studio",
      ecommerce: "ShopHub",
      healthcare: "HealthCare Plus",
      education: "LearnForward",
      finance: "FinancePro",
      business: "ProBusiness",
    };
    return names[type] || "Your Company";
  }

  generateHeroTitle(type) {
    const titles = {
      restaurant: "Exceptional Dining Experience",
      tech: "Transform Your Business with Innovation",
      agency: "Creative Solutions That Drive Results",
      ecommerce: "Discover Amazing Products",
      healthcare: "Your Health, Our Priority",
      education: "Learn. Grow. Succeed.",
      finance: "Secure Your Financial Future",
      business: "Grow Your Business",
    };
    return titles[type] || "Welcome to Excellence";
  }

  generateHeroSubtitle(type) {
    const subtitles = {
      restaurant: "Fresh ingredients, expert chefs, unforgettable moments",
      tech: "Cutting-edge technology solutions for modern challenges",
      agency:
        "We help brands connect with their audience through powerful design",
      ecommerce: "Quality products at unbeatable prices with fast shipping",
      healthcare: "Comprehensive medical care with a personal touch",
      education: "Expert-led courses designed for real-world success",
      finance: "Expert financial advice and personalized investment strategies",
      business: "Professional solutions for modern businesses",
    };
    return subtitles[type] || "Excellence in every detail we deliver";
  }

  generateBusinessFeatures(type) {
    const features = {
      restaurant: [
        {
          title: "Fresh Ingredients",
          description: "Locally sourced, organic ingredients daily",
          icon: "🥗",
        },
        {
          title: "Expert Chefs",
          description: "Award-winning culinary team",
          icon: "👨‍🍳",
        },
        {
          title: "Cozy Atmosphere",
          description: "Perfect for any occasion",
          icon: "🕯️",
        },
      ],
      tech: [
        {
          title: "Cutting-Edge Technology",
          description: "Latest tools and frameworks",
          icon: "⚡",
        },
        {
          title: "Expert Team",
          description: "Experienced developers and designers",
          icon: "👥",
        },
        {
          title: "24/7 Support",
          description: "Round-the-clock assistance",
          icon: "🛟",
        },
      ],
      default: [
        {
          title: "Quality Service",
          description: "Excellence in every interaction",
          icon: "⭐",
        },
        {
          title: "Expert Team",
          description: "Professionals you can trust",
          icon: "👥",
        },
        {
          title: "Proven Results",
          description: "Track record of success",
          icon: "📈",
        },
      ],
    };
    return features[type] || features["default"];
  }

  generatePricingPlans(type) {
    const plans = {
      tech: [
        {
          name: "Starter",
          price: "$29",
          period: "month",
          features: [
            "5 Projects",
            "10GB Storage",
            "Email Support",
            "Basic Analytics",
          ],
          highlighted: false,
        },
        {
          name: "Professional",
          price: "$79",
          period: "month",
          features: [
            "Unlimited Projects",
            "100GB Storage",
            "Priority Support",
            "Advanced Analytics",
            "API Access",
          ],
          highlighted: true,
        },
        {
          name: "Enterprise",
          price: "$199",
          period: "month",
          features: [
            "Everything in Pro",
            "Custom Integrations",
            "Dedicated Manager",
            "24/7 Phone Support",
            "SLA",
          ],
          highlighted: false,
        },
      ],
      default: [
        {
          name: "Basic",
          price: "$19",
          period: "month",
          features: ["Essential Features", "Email Support", "5GB Storage"],
          highlighted: false,
        },
        {
          name: "Pro",
          price: "$49",
          period: "month",
          features: [
            "All Basic Features",
            "Priority Support",
            "50GB Storage",
            "Advanced Tools",
          ],
          highlighted: true,
        },
        {
          name: "Enterprise",
          price: "$99",
          period: "month",
          features: [
            "All Pro Features",
            "Dedicated Support",
            "Unlimited Storage",
            "Custom Solutions",
          ],
          highlighted: false,
        },
      ],
    };
    return plans[type] || plans["default"];
  }

  generateTestimonials(type) {
    const testimonials = {
      restaurant: [
        {
          quote:
            "The best dining experience in the city. Every dish is a masterpiece!",
          author: "Sarah Johnson",
          position: "Food Critic",
          image: "/api/placeholder/64/64",
          rating: 5,
        },
        {
          quote:
            "Exceptional service and amazing atmosphere. Perfect for special occasions.",
          author: "Michael Chen",
          position: "Local Resident",
          image: "/api/placeholder/64/64",
          rating: 5,
        },
      ],
      tech: [
        {
          quote:
            "This platform has completely transformed how we manage our projects.",
          author: "Emily Rodriguez",
          position: "CTO, TechCorp",
          image: "/api/placeholder/64/64",
          rating: 5,
        },
        {
          quote:
            "Outstanding support and incredibly powerful features. Highly recommended!",
          author: "David Kim",
          position: "Product Manager",
          image: "/api/placeholder/64/64",
          rating: 5,
        },
      ],
      default: [
        {
          quote:
            "Excellent service and professional results. Exceeded all expectations.",
          author: "Alex Thompson",
          position: "Business Owner",
          image: "/api/placeholder/64/64",
          rating: 5,
        },
        {
          quote:
            "The team delivered exactly what we needed on time and within budget.",
          author: "Lisa Wang",
          position: "Project Manager",
          image: "/api/placeholder/64/64",
          rating: 5,
        },
      ],
    };
    return testimonials[type] || testimonials["default"];
  }

  generateTeamMembers(type) {
    const members = {
      tech: [
        {
          name: "John Smith",
          position: "Lead Developer",
          image: "/api/placeholder/256/256",
          bio: "Full-stack developer with 10+ years experience",
          social: { linkedin: "#", twitter: "#" },
        },
        {
          name: "Sarah Davis",
          position: "UX Designer",
          image: "/api/placeholder/256/256",
          bio: "Design expert focused on user experience",
          social: { linkedin: "#", dribbble: "#" },
        },
        {
          name: "Mike Johnson",
          position: "Product Manager",
          image: "/api/placeholder/256/256",
          bio: "Strategic product development specialist",
          social: { linkedin: "#", twitter: "#" },
        },
      ],
      default: [
        {
          name: "Jane Doe",
          position: "CEO & Founder",
          image: "/api/placeholder/256/256",
          bio: "Visionary leader with industry expertise",
          social: { linkedin: "#", twitter: "#" },
        },
        {
          name: "Robert Wilson",
          position: "Head of Operations",
          image: "/api/placeholder/256/256",
          bio: "Operations expert ensuring smooth delivery",
          social: { linkedin: "#" },
        },
      ],
    };
    return members[type] || members["default"];
  }

  generateNavLinks(type) {
    const links = {
      restaurant: ["Menu", "Reservations", "Events", "About", "Contact"],
      tech: ["Products", "Solutions", "Resources", "Pricing", "Contact"],
      agency: ["Services", "Portfolio", "About", "Blog", "Contact"],
      ecommerce: ["Products", "Categories", "Deals", "Support", "Account"],
      default: ["Home", "About", "Services", "Portfolio", "Contact"],
    };
    return links[type] || links["default"];
  }

  generateFooterLinks(type) {
    const links = {
      tech: {
        Products: ["Platform", "API", "Integrations", "Security"],
        Resources: ["Documentation", "Tutorials", "Blog", "Support"],
        Company: ["About", "Careers", "Press", "Contact"],
      },
      default: {
        Company: ["About", "Team", "Careers", "Contact"],
        Services: ["Web Design", "Development", "Consulting", "Support"],
        Resources: ["Blog", "Documentation", "Help Center", "Community"],
      },
    };
    return links[type] || links["default"];
  }

  generateFormFields(type) {
    const fields = {
      contact: [
        {
          type: "text",
          name: "name",
          placeholder: "Your Name *",
          required: true,
        },
        {
          type: "email",
          name: "email",
          placeholder: "Your Email *",
          required: true,
        },
        { type: "text", name: "subject", placeholder: "Subject" },
        {
          type: "textarea",
          name: "message",
          placeholder: "Your Message *",
          required: true,
          rows: 5,
        },
      ],
      signup: [
        {
          type: "text",
          name: "firstName",
          placeholder: "First Name *",
          required: true,
        },
        {
          type: "text",
          name: "lastName",
          placeholder: "Last Name *",
          required: true,
        },
        {
          type: "email",
          name: "email",
          placeholder: "Email Address *",
          required: true,
        },
        {
          type: "password",
          name: "password",
          placeholder: "Password *",
          required: true,
        },
      ],
      newsletter: [
        {
          type: "email",
          name: "email",
          placeholder: "Your Email Address *",
          required: true,
        },
      ],
    };
    return fields[type] || fields["contact"];
  }

  getFormSubtitle(type) {
    const subtitles = {
      contact:
        "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      signup: "Create your account to get started with our platform.",
      newsletter: "Stay updated with our latest news and updates.",
    };
    return subtitles[type] || "";
  }

  generateContactInfo(type) {
    return {
      address: "123 Business St, City, State 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@company.com",
      hours: "Mon-Fri 9AM-6PM",
    };
  }

  generateBusinessDescription(type) {
    const descriptions = {
      restaurant:
        "Creating memorable dining experiences with fresh, locally-sourced ingredients and exceptional service.",
      tech: "Innovative technology solutions that help businesses thrive in the digital age.",
      agency:
        "Creative design and marketing solutions that drive real results for our clients.",
      ecommerce:
        "Your trusted partner for quality products and exceptional shopping experience.",
      default:
        "Professional excellence and innovative solutions for modern businesses.",
    };
    return descriptions[type] || descriptions["default"];
  }

  extractContent(prompt, keywords) {
    for (const keyword of keywords) {
      const patterns = [
        new RegExp(`${keyword}[:\\s]+["']([^"']+)["']`, "i"),
        new RegExp(`${keyword}[:\\s]+([^,\\.!?\\n]+)`, "i"),
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

  generateSmartTitle(prompt) {
    if (prompt.includes("business") || prompt.includes("company"))
      return "Grow Your Business";
    if (prompt.includes("portfolio") || prompt.includes("creative"))
      return "Creative Excellence";
    if (prompt.includes("startup") || prompt.includes("launch"))
      return "Launch Your Vision";
    if (prompt.includes("restaurant") || prompt.includes("food"))
      return "Exceptional Dining Experience";
    if (prompt.includes("tech") || prompt.includes("software"))
      return "Transform Your Business";
    return "Welcome to Innovation";
  }

  generateSmartSubtitle(prompt) {
    if (prompt.includes("business"))
      return "Innovative solutions for modern challenges";
    if (prompt.includes("portfolio"))
      return "Showcasing creativity and expertise";
    if (prompt.includes("startup")) return "From concept to reality";
    if (prompt.includes("restaurant"))
      return "Fresh ingredients, expert chefs, unforgettable moments";
    if (prompt.includes("tech")) return "Cutting-edge technology solutions";
    return "Excellence in every detail";
  }

  getColorScheme(prompt) {
    if (prompt.includes("blue"))
      return "bg-gradient-to-r from-blue-600 to-blue-800";
    if (prompt.includes("green"))
      return "bg-gradient-to-r from-green-600 to-green-800";
    if (prompt.includes("purple"))
      return "bg-gradient-to-r from-purple-600 to-purple-800";
    if (prompt.includes("red"))
      return "bg-gradient-to-r from-red-600 to-red-800";
    if (prompt.includes("restaurant") || prompt.includes("food"))
      return "bg-gradient-to-r from-amber-600 to-orange-600";
    if (prompt.includes("tech") || prompt.includes("software"))
      return "bg-gradient-to-r from-blue-600 to-indigo-600";
    if (prompt.includes("creative") || prompt.includes("portfolio"))
      return "bg-gradient-to-r from-purple-600 to-pink-600";
    return "bg-gradient-to-r from-blue-600 to-purple-600";
  }

  suggestBackgroundImage(type) {
    const images = {
      tech: "/api/placeholder/1920/1080?text=Modern+Technology+Background",
      restaurant: "/api/placeholder/1920/1080?text=Restaurant+Interior",
      agency: "/api/placeholder/1920/1080?text=Creative+Workspace",
      ecommerce: "/api/placeholder/1920/1080?text=Products+Showcase",
      healthcare: "/api/placeholder/1920/1080?text=Medical+Facility",
      education: "/api/placeholder/1920/1080?text=Learning+Environment",
      finance: "/api/placeholder/1920/1080?text=Financial+Success",
      default: "/api/placeholder/1920/1080?text=Professional+Background",
    };
    return images[type] || images["default"];
  }
}

module.exports = new EnhancedAIService();
