"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Example {
  id: string;
  title: string;
  description: string;
  framework: string;
  demoUrl: string;
  sourceUrl: string;
  deployCommand: string;
  features: string[];
  buildTime: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'static';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
}

const examples: Example[] = [
  {
    id: 'nextjs-blog',
    title: 'Next.js Blog',
    description: 'A modern blog built with Next.js, TypeScript, and Tailwind CSS. Features markdown support and responsive design.',
    framework: 'Next.js',
    demoUrl: 'https://nextjs-blog-example.agfe.tech',
    sourceUrl: 'https://github.com/example/nextjs-blog',
    deployCommand: 'forge deploy https://github.com/example/nextjs-blog.git',
    features: ['SSG/SSR', 'Markdown Support', 'Responsive Design', 'SEO Optimized'],
    buildTime: '~30s',
    category: 'frontend',
    difficulty: 'beginner',
    image: '/examples/nextjs-blog.png'
  },
  {
    id: 'react-dashboard',
    title: 'React Dashboard',
    description: 'Interactive admin dashboard with charts, real-time data, and user management built with React and Chart.js.',
    framework: 'React',
    demoUrl: 'https://react-dashboard.agfe.tech',
    sourceUrl: 'https://github.com/example/react-dashboard',
    deployCommand: 'forge deploy https://github.com/example/react-dashboard.git',
    features: ['Interactive Charts', 'Real-time Updates', 'User Authentication', 'Mobile Responsive'],
    buildTime: '~25s',
    category: 'frontend',
    difficulty: 'intermediate',
    image: '/examples/react-dashboard.png'
  },
  {
    id: 'vue-ecommerce',
    title: 'Vue E-commerce',
    description: 'Full-featured e-commerce store built with Vue 3, Vuex, and integrated payment processing.',
    framework: 'Vue.js',
    demoUrl: 'https://vue-store.agfe.tech',
    sourceUrl: 'https://github.com/example/vue-ecommerce',
    deployCommand: 'forge deploy https://github.com/example/vue-ecommerce.git',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Integration', 'Admin Panel'],
    buildTime: '~35s',
    category: 'frontend',
    difficulty: 'advanced',
    image: '/examples/vue-ecommerce.png'
  },
  {
    id: 'django-api',
    title: 'Django REST API',
    description: 'RESTful API backend with Django REST Framework, PostgreSQL, and JWT authentication.',
    framework: 'Django',
    demoUrl: 'https://django-api.agfe.tech',
    sourceUrl: 'https://github.com/example/django-api',
    deployCommand: 'forge deploy https://github.com/example/django-api.git',
    features: ['REST API', 'JWT Authentication', 'Database Integration', 'API Documentation'],
    buildTime: '~40s',
    category: 'backend',
    difficulty: 'intermediate',
    image: '/examples/django-api.png'
  },
  {
    id: 'flask-microservice',
    title: 'Flask Microservice',
    description: 'Lightweight microservice built with Flask, SQLAlchemy, and Redis caching.',
    framework: 'Flask',
    demoUrl: 'https://flask-service.agfe.tech',
    sourceUrl: 'https://github.com/example/flask-microservice',
    deployCommand: 'forge deploy https://github.com/example/flask-microservice.git',
    features: ['Microservice Architecture', 'Redis Caching', 'API Rate Limiting', 'Health Checks'],
    buildTime: '~20s',
    category: 'backend',
    difficulty: 'beginner',
    image: '/examples/flask-microservice.png'
  },
  {
    id: 'fastapi-ml',
    title: 'FastAPI ML Service',
    description: 'Machine learning API service built with FastAPI, featuring model serving and real-time predictions.',
    framework: 'FastAPI',
    demoUrl: 'https://fastapi-ml.agfe.tech',
    sourceUrl: 'https://github.com/example/fastapi-ml',
    deployCommand: 'forge deploy https://github.com/example/fastapi-ml.git',
    features: ['ML Model Serving', 'Real-time Predictions', 'Async Processing', 'Auto Documentation'],
    buildTime: '~45s',
    category: 'backend',
    difficulty: 'advanced',
    image: '/examples/fastapi-ml.png'
  },
  {
    id: 'mern-stack',
    title: 'MERN Stack App',
    description: 'Full-stack social media application with React frontend and Node.js/Express backend.',
    framework: 'MERN',
    demoUrl: 'https://mern-social.agfe.tech',
    sourceUrl: 'https://github.com/example/mern-stack',
    deployCommand: 'forge deploy https://github.com/example/mern-stack.git',
    features: ['User Authentication', 'Real-time Chat', 'File Uploads', 'Social Features'],
    buildTime: '~50s',
    category: 'fullstack',
    difficulty: 'advanced',
    image: '/examples/mern-stack.png'
  },
  {
    id: 'static-portfolio',
    title: 'Static Portfolio',
    description: 'Beautiful developer portfolio website built with HTML, CSS, and JavaScript.',
    framework: 'Static',
    demoUrl: 'https://portfolio-demo.agfe.tech',
    sourceUrl: 'https://github.com/example/static-portfolio',
    deployCommand: 'forge deploy https://github.com/example/static-portfolio.git',
    features: ['Responsive Design', 'Smooth Animations', 'Contact Form', 'SEO Optimized'],
    buildTime: '~10s',
    category: 'static',
    difficulty: 'beginner',
    image: '/examples/static-portfolio.png'
  }
];

const categories = [
  { id: 'all', label: 'All Examples', icon: '🚀' },
  { id: 'frontend', label: 'Frontend', icon: '🎨' },
  { id: 'backend', label: 'Backend', icon: '⚙️' },
  { id: 'fullstack', label: 'Full Stack', icon: '🌐' },
  { id: 'static', label: 'Static Sites', icon: '📄' }
];

const difficulties = [
  { id: 'all', label: 'All Levels', color: 'text-gray-400' },
  { id: 'beginner', label: 'Beginner', color: 'text-green-400' },
  { id: 'intermediate', label: 'Intermediate', color: 'text-yellow-400' },
  { id: 'advanced', label: 'Advanced', color: 'text-red-400' }
];

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExamples = examples.filter(example => {
    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || example.difficulty === selectedDifficulty;
    const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.framework.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-6xl font-mono text-foreground mb-6 tracking-tight">
            Real-World <span className="text-primary">Examples</span>
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover how to deploy various applications with Forge CLI. Each example includes 
            source code, live demo, and detailed deployment instructions.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-background/50 border border-white/10 text-secondary hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-primary text-white'
                      : `bg-background/50 border border-white/10 ${difficulty.color} hover:border-primary/30`
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Examples Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredExamples.map((example, index) => (
            <motion.div
              key={example.id}
              className="bg-background/50 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 border-b border-white/10 flex items-center justify-center">
                <div className="text-6xl opacity-50">
                  {example.category === 'frontend' && '🎨'}
                  {example.category === 'backend' && '⚙️'}
                  {example.category === 'fullstack' && '🌐'}
                  {example.category === 'static' && '📄'}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
                    {example.framework}
                  </span>
                  <span className={`text-xs font-medium ${
                    example.difficulty === 'beginner' ? 'text-green-400' :
                    example.difficulty === 'intermediate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {example.difficulty.charAt(0).toUpperCase() + example.difficulty.slice(1)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {example.title}
                </h3>
                
                <p className="text-secondary text-sm mb-4 leading-relaxed">
                  {example.description}
                </p>

                <div className="mb-4">
                  <div className="text-xs text-secondary mb-2">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {example.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/5 text-xs text-secondary rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {example.features.length > 3 && (
                      <span className="px-2 py-1 bg-white/5 text-xs text-secondary rounded">
                        +{example.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-secondary mb-4">
                  Build time: <span className="text-primary font-medium">{example.buildTime}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <a
                      href={example.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-primary hover:bg-primary/80 text-white text-sm text-center rounded-lg transition-colors"
                    >
                      Live Demo
                    </a>
                    <a
                      href={example.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 border border-white/10 hover:border-primary/30 text-secondary hover:text-foreground text-sm text-center rounded-lg transition-colors"
                    >
                      Source Code
                    </a>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-secondary">Deploy Command:</span>
                      <button
                        onClick={() => copyToClipboard(example.deployCommand)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <code className="text-xs text-green-400 font-mono break-all">
                      {example.deployCommand}
                    </code>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredExamples.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No examples found</h3>
            <p className="text-secondary">Try adjusting your filters or search terms.</p>
          </motion.div>
        )}

        {/* Quick Start Section */}
        <motion.div
          className="mt-24 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Deploy Your Own App?
          </h2>
          <p className="text-secondary mb-6 max-w-2xl mx-auto">
            Follow these examples and deploy your application in minutes with Forge CLI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/docs"
              className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
            >
              View Documentation
            </Link>
            <button
              onClick={() => copyToClipboard('npm install -g forge-deploy-cli')}
              className="px-6 py-3 border border-primary/30 hover:border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Install CLI
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
