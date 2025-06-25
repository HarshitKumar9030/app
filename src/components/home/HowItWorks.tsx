"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Install & Initialize",
      description: "Get started in seconds with our CLI tool. Smart project detection means zero configuration.",
      code: "npm install -g forge-cli\nforge init",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      number: "02",
      title: "Configure (Optional)",
      description: "Forge automatically detects your framework. Customize deployment settings if needed.",
      code: "forge config\n# Set environment variables\n# Configure build commands",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      number: "03",
      title: "Deploy Instantly",
      description: "One command deploys your app to production. Get a live URL in seconds, not minutes.",
      code: "forge deploy\n✅ Deployed to https://xxxxx.agfe.tech\n🚀 Ready in 12s",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M9 19l3 3m0 0 3-3m-3 3V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            3 steps to production
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-mono text-foreground mb-6 tracking-tight">
            From code to live<br />
            <span className="text-primary">in under 60 seconds</span>
          </h2>
          
          <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
            No complex CI/CD pipelines. No lengthy configuration files. 
            Just simple commands that work.
          </p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1, 
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      boxShadow: "0 10px 40px rgba(127, 41, 255, 0.2)" 
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  <div className="text-6xl font-mono text-primary/20 font-bold">
                    {step.number}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <motion.div
                  className="flex items-center gap-2 text-primary/80"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-sm font-medium">See documentation</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>

              <motion.div 
                className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-6 py-4 bg-white/[0.02] border-b border-white/10">
                    <div className="flex gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-red-500/80"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-yellow-500/80"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-green-500/80"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="ml-4 text-sm text-secondary font-mono">
                      forge-cli
                    </div>
                  </div>

                  <div className="p-6">
                    <motion.pre 
                      className="text-sm font-mono leading-relaxed overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {step.code.split('\n').map((line, lineIndex) => (
                        <motion.div
                          key={lineIndex}
                          className={`${
                            line.startsWith('✅') || line.startsWith('🚀') 
                              ? 'text-green-400' 
                              : line.startsWith('#')
                              ? 'text-secondary'
                              : 'text-foreground'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 0.6 + (lineIndex * 0.1),
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                        >
                          {line.startsWith('#') ? (
                            line
                          ) : line.startsWith('✅') || line.startsWith('🚀') ? (
                            line
                          ) : (
                            <>
                              <span className="text-primary">$</span>{' '}
                              <span>{line.replace(/^\$ /, '')}</span>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </motion.pre>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>Try it yourself</span>
            <motion.svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}