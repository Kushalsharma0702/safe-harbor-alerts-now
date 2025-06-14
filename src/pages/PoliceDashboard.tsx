import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Users, TrendingUp, AlertTriangle, MessageSquare, Search, Filter, Eye, MapPin, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ThemeToggle from '@/components/ThemeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GoogleMapsHeatmap from '@/components/GoogleMapsHeatmap';

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedReport, setSelectedReport] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [chatMessage, setChatMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState('user001');

  // Mock data for charts
  const [chartData, setChartData] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // TODO: Connect to Flask backend to fetch real-time data
    // const fetchDashboardData = async () => {
    //   const response = await fetch('/api/police/dashboard-data');
    //   const data = await response.json();
    //   setChartData(data.chartData);
    //   setReports(data.reports);
    // };

    // Mock data for demo
    const mockChartData = [
      { time: '00:00', WhatsApp: 12, Instagram: 8, Facebook: 15, Twitter: 6, LinkedIn: 3 },
      { time: '04:00', WhatsApp: 8, Instagram: 12, Facebook: 10, Twitter: 9, LinkedIn: 2 },
      { time: '08:00', WhatsApp: 25, Instagram: 18, Facebook: 22, Twitter: 14, LinkedIn: 7 },
      { time: '12:00', WhatsApp: 35, Instagram: 28, Facebook: 30, Twitter: 20, LinkedIn: 12 },
      { time: '16:00', WhatsApp: 42, Instagram: 35, Facebook: 38, Twitter: 25, LinkedIn: 15 },
      { time: '20:00', WhatsApp: 38, Instagram: 32, Facebook: 35, Twitter: 22, LinkedIn: 10 },
    ];

    const mockReports = [
      {
        id: 'RPT001',
        sender: 'Anonymous User',
        application: 'WhatsApp',
        content: 'Threatening messages received from unknown number...',
        location: 'Sector 17, Chandigarh',
        bullying: 75,
        harassment: 85,
        timestamp: '2024-01-15 14:30',
        status: 'New'
      },
      {
        id: 'RPT002',
        sender: 'Student123',
        application: 'Instagram',
        content: 'Cyberbullying in comments section...',
        location: 'Sector 22, Chandigarh',
        bullying: 90,
        harassment: 60,
        timestamp: '2024-01-15 13:15',
        status: 'In Progress'
      },
      {
        id: 'RPT003',
        sender: 'WorkerUser',
        application: 'LinkedIn',
        content: 'Inappropriate workplace messages...',
        location: 'IT Park, Chandigarh',
        bullying: 45,
        harassment: 80,
        timestamp: '2024-01-15 12:00',
        status: 'Resolved'
      }
    ];

    setChartData(mockChartData);
    setReports(mockReports);
  }, [timeRange]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // TODO: Connect to Flask backend for real-time chat
    // const sendMessage = async () => {
    //   await fetch('/api/police/send-message', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       recipientId: selectedChat,
    //       message: chatMessage
    //     })
    //   });
    // };

    console.log(`Sending message to ${selectedChat}: ${chatMessage}`);
    setChatMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <header className="bg-background/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Police Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Case Management & Analytics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'reports', label: 'Reported Issues', icon: AlertTriangle },
            { id: 'stats', label: 'Real-time Stats', icon: TrendingUp },
            { id: 'heatmap', label: 'Crime Heatmap', icon: MapPin },
            { id: 'chat', label: 'User Chat', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Reported Issues Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>All Status</option>
                <option>New</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>All Platforms</option>
                <option>WhatsApp</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>LinkedIn</option>
              </select>
            </div>

            {/* Reports Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.sender}</TableCell>
                      <TableCell>{report.application}</TableCell>
                      <TableCell className="max-w-xs truncate">{report.content}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                            B: {report.bullying}%
                          </span>
                          <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                            H: {report.harassment}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{report.timestamp}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Real-time Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <span className="font-medium text-gray-900 dark:text-white">Time Range:</span>
              {['1h', '24h', '7d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {range === '1h' ? 'Last Hour' : range === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incidents by Platform</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="WhatsApp" stroke="#25D366" strokeWidth={2} />
                    <Line type="monotone" dataKey="Instagram" stroke="#E4405F" strokeWidth={2} />
                    <Line type="monotone" dataKey="Facebook" stroke="#1877F2" strokeWidth={2} />
                    <Line type="monotone" dataKey="Twitter" stroke="#1DA1F2" strokeWidth={2} />
                    <Line type="monotone" dataKey="LinkedIn" stroke="#0A66C2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Reports by Platform</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="WhatsApp" fill="#25D366" />
                    <Bar dataKey="Instagram" fill="#E4405F" />
                    <Bar dataKey="Facebook" fill="#1877F2" />
                    <Bar dataKey="Twitter" fill="#1DA1F2" />
                    <Bar dataKey="LinkedIn" fill="#0A66C2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">127</div>
                <div className="text-gray-600 dark:text-gray-300">Active Cases</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">23</div>
                <div className="text-gray-600 dark:text-gray-300">Pending Review</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">1,234</div>
                <div className="text-gray-600 dark:text-gray-300">Resolved Today</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">96.5%</div>
                <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Crime Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Crime Incident Heatmap - Chandigarh
              </h3>
              <GoogleMapsHeatmap />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">High Risk Areas</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Sector 17, IT Park - 15+ incidents this week
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Medium Risk Areas</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Sector 22, Sector 35 - 8-14 incidents this week
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Low Risk Areas</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Residential sectors - Under 8 incidents this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Chats</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {['user001', 'user002', 'user003'].map((userId) => (
                  <button
                    key={userId}
                    onClick={() => setSelectedChat(userId)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedChat === userId ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Report #{userId}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Last message 5m ago</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Report #{selectedChat}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Online</div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                    <div className="text-sm text-gray-900 dark:text-white">Hello, I need help with my harassment report.</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2:30 PM</div>
                  </div>
                </div>

                <div className="flex space-x-3 justify-end">
                  <div className="bg-purple-600 rounded-lg p-3 max-w-xs">
                    <div className="text-sm text-white">Thank you for reaching out. I'm reviewing your case now.</div>
                    <div className="text-xs text-purple-200 mt-1">2:32 PM</div>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  <Textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 resize-none"
                    rows={2}
                  />
                  <Button onClick={handleSendMessage} className="self-end">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard;
