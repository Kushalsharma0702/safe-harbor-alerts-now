
import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Filter, Search, MessageCircle, Map, BarChart3, Clock, Eye, CheckCircle, AlertTriangle, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedReport, setSelectedReport] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  // Simulated data - TODO: Replace with backend API calls
  const [reports, setReports] = useState([
    {
      id: 'RPT001',
      sender: 'User123',
      platform: 'WhatsApp',
      content: 'You are worthless and should...',
      location: 'Sector 17, Chandigarh',
      bullying: 85,
      harassment: 72,
      timestamp: '2024-01-15 14:30',
      status: 'New'
    },
    {
      id: 'RPT002',
      sender: 'Anonymous',
      platform: 'Instagram',
      content: 'Stop posting pictures you...',
      location: 'Sector 22, Chandigarh',
      bullying: 67,
      harassment: 89,
      timestamp: '2024-01-15 13:45',
      status: 'In Progress'
    },
    {
      id: 'RPT003',
      sender: 'StudentABC',
      platform: 'LinkedIn',
      content: 'Your career will never...',
      location: 'Panchkula',
      bullying: 45,
      harassment: 78,
      timestamp: '2024-01-15 12:20',
      status: 'Resolved'
    }
  ]);

  const [statsData, setStatsData] = useState({
    hourly: [
      { time: '09:00', WhatsApp: 12, Instagram: 8, Twitter: 5, Reddit: 3 },
      { time: '10:00', WhatsApp: 15, Instagram: 12, Twitter: 7, Reddit: 4 },
      { time: '11:00', WhatsApp: 18, Instagram: 15, Twitter: 9, Reddit: 6 },
      { time: '12:00', WhatsApp: 22, Instagram: 18, Twitter: 12, Reddit: 8 },
      { time: '13:00', WhatsApp: 25, Instagram: 20, Twitter: 15, Reddit: 10 },
      { time: '14:00', WhatsApp: 28, Instagram: 22, Twitter: 18, Reddit: 12 }
    ]
  });

  useEffect(() => {
    // TODO: Connect to Flask backend for real-time data updates
    // const fetchReports = async () => {
    //   const response = await fetch('/api/police/reports');
    //   const data = await response.json();
    //   setReports(data);
    // };
    // 
    // const fetchStats = async () => {
    //   const response = await fetch('/api/police/stats');
    //   const data = await response.json();
    //   setStatsData(data);
    // };
    //
    // fetchReports();
    // fetchStats();

    // Simulate real-time updates
    const interval = setInterval(() => {
      // TODO: Replace with WebSocket connection to backend
      setStatsData(prev => ({
        ...prev,
        hourly: prev.hourly.map(item => ({
          ...item,
          WhatsApp: item.WhatsApp + Math.floor(Math.random() * 3),
          Instagram: item.Instagram + Math.floor(Math.random() * 2),
          Twitter: item.Twitter + Math.floor(Math.random() * 2),
          Reddit: item.Reddit + Math.floor(Math.random() * 1)
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    // TODO: Connect to Flask backend chat API
    // await fetch('/api/police/chat/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     chatId: selectedChat,
    //     message: newMessage,
    //     sender: 'officer'
    //   })
    // });

    setChatMessages(prev => [...prev, {
      id: Date.now(),
      message: newMessage,
      sender: 'officer',
      timestamp: new Date().toLocaleTimeString()
    }]);
    setNewMessage('');
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'New': 'bg-red-100 text-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const ReportsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>All Status</option>
              <option>New</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reports..."
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Scores</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.sender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.platform}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {report.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {report.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">B:</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${report.bullying}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{report.bullying}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">H:</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${report.harassment}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{report.harassment}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const StatsTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports Today</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents per Hour by Platform</h3>
        <div className="space-y-4">
          {statsData.hourly.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-600">{data.time}</div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex items-center space-x-2 w-24">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm">WhatsApp</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-300" 
                    style={{ width: `${(data.WhatsApp / 40) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-8">{data.WhatsApp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HeatmapTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Heatmap - Chandigarh Region</h3>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
          {/* Simulated heatmap - TODO: Integrate with real mapping service like Mapbox or Google Maps */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-red-500 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-3/4 left-1/4 w-8 h-8 bg-yellow-400 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-red-600 rounded-full opacity-65 animate-pulse"></div>
          </div>
          <div className="text-center z-10">
            <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Interactive Crime Heatmap</p>
            <p className="text-gray-500 text-sm mt-2">
              TODO: Integrate with mapping service (Mapbox/Google Maps)
            </p>
            <p className="text-gray-500 text-sm">
              Connect to backend API: /api/police/heatmap-data
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
            <span className="text-sm">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
      {/* Chat List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Active Chats</h3>
        </div>
        <div className="divide-y">
          {reports.filter(r => r.status !== 'Resolved').map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedChat(report.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedChat === report.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{report.id}</p>
                  <p className="text-xs text-gray-500">{report.sender}</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Chat - {selectedChat}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {/* Sample messages - TODO: Load from backend */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">I need help with my reported case</p>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-blue-100 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Police Dashboard</h1>
                  <p className="text-sm text-gray-600">Incident Management & Monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Officer: <span className="font-medium">Inspector Singh</span>
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                S
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'reports', label: 'Reported Issues', icon: AlertTriangle },
              { id: 'stats', label: 'Real-time Stats', icon: BarChart3 },
              { id: 'heatmap', label: 'Crime Heatmap', icon: Map },
              { id: 'chat', label: 'Chat', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'heatmap' && <HeatmapTab />}
        {activeTab === 'chat' && <ChatTab />}
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Report Details - {selectedReport.id}</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Content</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedReport.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sender</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.sender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platform</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.platform}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Assign to Officer
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Mark Resolved
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceDashboard;
