
import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Landing = () => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Combat Bullying. Report Harassment. Build a Safer Community.";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center relative overflow-hidden">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
      
      {/* Content */}
      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Shield className="h-16 w-16 text-white dark:text-gray-200 mr-4" />
          <div className="text-left">
            <h1 className="text-2xl font-bold text-white dark:text-gray-200">SafeGuard Portal</h1>
            <p className="text-blue-200 dark:text-gray-300">Chandigarh Police Initiative</p>
          </div>
        </div>

        {/* Typewriter Text */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white dark:text-gray-100 min-h-[4rem] md:min-h-[6rem]">
            {displayedText}
            <span className="animate-pulse">|</span>
          </h2>
          <p className="text-xl text-blue-200 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
            Advanced AI-powered tool to detect, analyze, and report bullying and harassment across digital platforms.
          </p>
        </div>

        {/* Call to Action */}
        <Link 
          to="/auth" 
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
        >
          <span>Get Started</span>
          <ArrowRight className="h-6 w-6" />
        </Link>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white dark:text-gray-200 mb-2">12,345+</div>
            <div className="text-blue-200 dark:text-gray-300">Cases Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white dark:text-gray-200 mb-2">98.5%</div>
            <div className="text-blue-200 dark:text-gray-300">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white dark:text-gray-200 mb-2">24/7</div>
            <div className="text-blue-200 dark:text-gray-300">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
