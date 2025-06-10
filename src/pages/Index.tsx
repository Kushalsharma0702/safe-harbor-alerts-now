
import React from 'react';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SafeGuard Portal</h1>
                <p className="text-sm text-gray-600">Chandigarh Police Initiative</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Emergency: <span className="font-bold text-red-600">112</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Combating Digital
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Harassment</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI-powered tool to detect, analyze, and report bullying and harassment across digital platforms. 
              Building safer communities through technology.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">12,345+</div>
              <div className="text-gray-700">Cases Resolved</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-gray-700">Accuracy Rate</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-700">Support Available</div>
            </div>
          </div>

          {/* Dashboard Selection */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Choose Your Portal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* User Portal */}
              <Link to="/user-dashboard" className="group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <Users className="h-16 w-16" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">General User Portal</h4>
                  <p className="text-blue-100 mb-6">
                    Report incidents, analyze content for harassment, and get help from authorities.
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="bg-white/20 px-4 py-2 rounded-lg font-medium group-hover:bg-white/30 transition-colors">
                      Access Portal →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Police Portal */}
              <Link to="/police-dashboard" className="group">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <Shield className="h-16 w-16" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Police Officer Portal</h4>
                  <p className="text-purple-100 mb-6">
                    Manage reports, view real-time statistics, monitor crime patterns, and communicate with users.
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="bg-white/20 px-4 py-2 rounded-lg font-medium group-hover:bg-white/30 transition-colors">
                      Officer Login →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
                <div className="text-left">
                  <h5 className="font-semibold text-amber-800 mb-2">Important Notice</h5>
                  <p className="text-amber-700 text-sm">
                    This tool is designed to assist in identifying potential harassment. In case of immediate danger, 
                    please contact emergency services at 112 or your local police station directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-6 w-6" />
            <span className="font-semibold">SafeGuard Portal</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Chandigarh Police. Developed for public safety and digital well-being.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
