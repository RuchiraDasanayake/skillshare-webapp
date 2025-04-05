import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const features = [
    { 
      icon: "🚀", 
      title: "Learn Faster", 
      text: "Accelerate your growth with curated knowledge from industry experts.",
      bg: "bg-purple-50/80 backdrop-blur-sm" 
    },
    { 
      icon: "🌐", 
      title: "Global Network", 
      text: "Connect with passionate learners and mentors worldwide.",
      bg: "bg-purple-100/80 backdrop-blur-sm" 
    },
    { 
      icon: "💎", 
      title: "Showcase Skills", 
      text: "Build your reputation by sharing what you know best.",
      bg: "bg-purple-50/80 backdrop-blur-sm" 
    }
  ];

  const testimonials = [
    {
      quote: "This platform cut my learning curve in half. The community feedback is invaluable!",
      author: "Alex Johnson",
      role: "UX Designer",
      avatar: "👨‍🎨"
    },
    {
      quote: "I've doubled my client base by showcasing my skills here.",
      author: "Samira Khan",
      role: "Data Scientist",
      avatar: "👩‍💻"
    }
  ];

  return (
    <div className="min-h-screen text-slate-800 font-inter relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center"
          style={{ filter: 'brightness(0.7) saturate(1.5) hue-rotate(-10deg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-purple-800/30 to-purple-900/20" />
      </div>
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-300/30"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * 100],
            y: [null, Math.random() * 100],
            opacity: [0, Math.random() * 0.3 + 0.1, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Hero Section */}
      <motion.section 
        className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-8"
        >
          <span className="px-4 py-2 bg-purple-100/50 text-purple-600 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/30">
            New: AI Learning Assistants →
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 tracking-tight"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 60,
            damping: 12,
            delay: 0.5
          }}
        >
          <span className="bg-gradient-to-r from-purple-300 via-purple-100 to-purple-400 bg-clip-text text-transparent">
            Elevate Your Craft
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-purple-100 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          The <span className="font-semibold text-white">premier platform</span> for meaningful knowledge exchange among discerning professionals
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Link 
            to="/create" 
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center gap-2 hover:-translate-y-1 group border border-purple-300/30"
          >
            <motion.span 
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2"
            >
              Share Expertise <span className="text-xl">→</span>
            </motion.span>
          </Link>
          <Link 
            to="/all-posts" 
            className="px-8 py-4 bg-white/90 text-purple-600 font-semibold rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2 hover:-translate-y-1 group backdrop-blur-sm"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Explore Skills <span className="text-xl">⌘</span>
            </motion.span>
          </Link>
        </motion.div>

        <motion.div 
          className="absolute bottom-12 text-2xl text-purple-200"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ↓
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-8 relative bg-white/5 backdrop-blur-sm">
        <div className="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
              Why Elite Professionals Choose Us
            </span>
          </h2>
          <p className="text-lg text-purple-100">Designed for those who demand excellence</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`p-8 ${feature.bg} rounded-2xl shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-purple-200/30`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2, 
                type: "spring",
                stiffness: 80
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 rounded-2xl border border-purple-200/30 pointer-events-none"></div>
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-800">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 bg-purple-900/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')]"></div>
        </div>
        
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
              Voices of Excellence
            </span>
          </h2>
          <p className="text-lg text-purple-100">Hear from our distinguished members</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="p-8 bg-white/90 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.3, 
                type: "spring",
                stiffness: 80
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 text-purple-500">
                {testimonial.avatar}
              </div>
              <div className="relative">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  <span className="absolute -top-4 -left-4 text-5xl text-purple-400 opacity-20">"</span>
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 bg-gradient-to-br from-purple-800/90 to-purple-900/90 text-white text-center relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-purple-600/20 blur-xl"
          />
          <motion.div
            animate={{
              rotate: [0, -8, 8, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-400/20 blur-xl"
          />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <motion.span
              animate={{ 
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              className="bg-gradient-to-r from-purple-300 via-white to-purple-300 bg-clip-text text-transparent bg-[length:200%]"
            >
              Ready for Transformational Growth?
            </motion.span>
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
            Join our curated network of top professionals accelerating their careers
          </p>
          <Link 
            to="/signup" 
            className="inline-block px-10 py-5 bg-white text-purple-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Begin Your Journey <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;