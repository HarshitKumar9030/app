"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const texts = ["next.js", "react", "vue", "python", "django", "flask", "fastapi", "node.js", "express"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, [texts.length]);

  const codeExample = `$ npm install -g forge-deploy-cli
$ sudo forge infra --all
$ forge login
$ forge deploy https://github.com/user/app.git`;

  return (
    <section className="pt-32 pb-24 relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-green-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <motion.div 
          className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIiBmaWxsPSJub25lIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjNWEyZGNjMjAiPjwvcmVjdD48L3N2Zz4=')] bg-repeat"
          animate={{ 
            backgroundPosition: ["0px 0px", "80px 80px"],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>

      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "linear-gradient(45deg, #7f29ff, #ff6b6b)" }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "linear-gradient(45deg, #4ecdc4, #44a08d)" }}
        animate={{
          x: [0, -80, 0],
          y: [0, 30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          className="inline-block mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span 
            className=" text-[#ff6b6b]  text-sm px-4 py-2 rounded-full border border-primary/30 "
            whileHover={{ 
              scale: 1.05,
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bg-[#ff6b6b] text-transparent bg-clip-text">✨</span> Open Source & Free Forever
          </motion.span>
        </motion.div>
        
        <motion.h1 
          className="text-[3rem] md:text-[5rem] lg:text-[7rem] font-normal text-foreground font-mono tracking-wider leading-none mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 30px rgba(127, 41, 255, 0.5)"
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            FORGE
          </motion.span>
        </motion.h1>

        <motion.div
          className="text-xl md:text-2xl font-mono mt-4 mb-6 h-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-secondary">deploy </span>
          <motion.span
            className="text-primary font-bold"
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {texts[textIndex]}
          </motion.span>
          <span className="text-secondary"> in seconds</span>
        </motion.div>

        <motion.p 
          className="mt-8 text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          A powerful CLI that automatically handles git cloning, dependency installation, builds, 
          PM2 process management, nginx reverse proxy, and SSL certificates. Deploy any app with 
          <span className="text-primary font-semibold"> zero configuration</span> and 
          <span className="text-primary font-semibold"> automatic infrastructure</span>.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            className="bg-primary text-foreground py-3 px-8 rounded-md text-lg transition-all duration-300"
            whileHover={{ 
              scale: 1.02,
              backgroundColor: "rgba(127, 41, 255, 0.8)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Get Started
          </motion.button>

          <Link href="/docs">
            <motion.button
              className="border border-secondary text-foreground py-3 px-8 rounded-md text-lg transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                borderColor: "rgba(237, 237, 237, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Documentation
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 mx-auto max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="bg-background border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm"
            whileHover={{ 
              borderColor: "rgba(127, 41, 255, 0.3)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#FF5F56]"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#FFBD2E]"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                ></motion.div>
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#27C93F]"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                ></motion.div>
              </div>
              <div className="ml-4 text-sm text-secondary">Terminal</div>
            </div>
            <pre className="p-4 text-left overflow-auto text-foreground font-mono text-sm">
              <code>{codeExample}</code>
            </pre>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatItem number="10K+" label="Deployments" />
          <StatItem number="500+" label="Contributors" />
          <StatItem number="15+" label="Frameworks" />
        </motion.div>
      </div>
    </section>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      className="text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="text-2xl md:text-3xl font-mono font-bold text-primary"
        whileHover={{ 
          textShadow: "0 0 20px rgba(127, 41, 255, 0.5)" 
        }}
      >
        {number}
      </motion.div>
      <div className="text-secondary text-sm">{label}</div>
    </motion.div>
  );
}