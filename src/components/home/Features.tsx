"use client";

import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "One Command Deploy",
      description: "Deploy your application with a single command, regardless of tech stack or platform.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
    },
    {
      title: "Multi-stack Support",
      description: "Works with Next.js, Flask, Node.js, Vue, React, and more frameworks out of the box.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      title: "Zero Config",
      description: "Smart detection of your project structure means minimal configuration required.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: "Rollback Support",
      description: "Instantly rollback to any previous deployment when issues arise.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
    },
    {
      title: "Environment Variables",
      description: "Secure environment variable management between development and production.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "CI/CD Integration",
      description: "Seamlessly integrates with GitHub Actions, GitLab CI, and other CI/CD platforms.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      comingSoon: true,
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
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
            Why developers choose Forge
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-mono text-foreground mb-6 tracking-tight">
            Build faster.<br />
            <span className="text-primary">Deploy smarter.</span>
          </h2>
          
          <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
            Every feature designed to eliminate friction from your deployment workflow.
            From zero-config detection to instant rollbacks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <motion.div
                className={`relative bg-background/50 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 ${
                  feature.comingSoon 
                    ? 'border-purple-500/20 hover:border-purple-500/30' 
                    : 'border-white/[0.08] hover:border-white/[0.12]'
                }`}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }}
              >
                {feature.comingSoon && (
                  <motion.div
                    className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    Coming Soon
                  </motion.div>
                )}

                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: feature.comingSoon 
                      ? `radial-gradient(600px circle at ${index % 2 === 0 ? '100px' : '300px'} 100px, rgba(139, 92, 246, 0.05), transparent 40%)`
                      : `radial-gradient(600px circle at ${index % 2 === 0 ? '100px' : '300px'} 100px, rgba(127, 41, 255, 0.05), transparent 40%)`
                  }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                      feature.comingSoon
                        ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                        : 'bg-primary/10 border border-primary/20 text-primary'
                    }`}
                    whileHover={{ 
                      boxShadow: feature.comingSoon 
                        ? "0 10px 40px rgba(249, 115, 22, 0.2)" 
                        : "0 10px 40px rgba(127, 41, 255, 0.2)" 
                    }}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                    feature.comingSoon
                      ? 'text-foreground/70 group-hover:text-purple-400'
                      : 'text-foreground group-hover:text-primary'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`leading-relaxed text-[15px] ${
                    feature.comingSoon ? 'text-secondary/70' : 'text-secondary'
                  }`}>
                    {feature.description}
                  </p>

                  <motion.div
                    className={`flex items-center gap-2 mt-6 transition-colors duration-300 ${
                      feature.comingSoon
                        ? 'text-purple-400/60 group-hover:text-purple-400'
                        : 'text-primary/60 group-hover:text-primary'
                    }`}
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-sm font-medium">
                      {feature.comingSoon ? 'Stay tuned' : 'Learn more'}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>

                {/* <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          feature.comingSoon ? 'bg-purple-400' : 'bg-primary'
                        }`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: (index * 0.1) + (i * 0.02),
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                      />
                    ))}
                  </div>
                </div> */}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-primary/30 text-primary font-medium transition-all duration-300"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 40px rgba(127, 41, 255, 0.2)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>See all features</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}