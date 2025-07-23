import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Clock, Wifi, Users, MessageCircle, Star, Monitor, Gamepad2, Usb, Smartphone, TrendingUp, Activity, BarChart3, Shield, Globe, Printer, BookOpen, PenTool } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🌟 **Welcome to E-C Digital Hub!** I'm your AI assistant, ready to help with our premium services like high-speed internet, professional printing, and other professional services. What can I do for you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      typing: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [conversationId, setConversationId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [serviceUpdateData, setServiceUpdateData] = useState({ service_name: '', new_info: '' });
  const [updateMessage, setUpdateMessage] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const newId = uuidv4();
    console.log('Generated conversationId:', newId);
    setConversationId(newId);
  }, []);

  const handleAdminLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setShowNameModal(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: `🔐 Admin Access Granted! Welcome back, ${userName}. You now have access to enhanced business insights and analytics. Type 'admin dashboard' to view system analytics.`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          typing: false
        }]);
      } else {
        alert('Access denied. Invalid admin credentials.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Connection error. Please try again.');
    }
  };

  const fetchAdminDashboard = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/dashboard?username=${encodeURIComponent(userName)}`);
      const data = await response.json();
      if (response.ok) {
        setAdminData(data);
        setShowAdminDashboard(true);
      } else {
        throw new Error(data.detail || 'Failed to fetch dashboard data.');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      alert(`Error fetching dashboard: ${error.message}`);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      if (userName.length > 50) {
        alert('Username must be 50 characters or less.');
        return;
      }
      if (userName.toLowerCase() === 'edwin123' || userName.toLowerCase() === 'clacks123') {
        setShowAdminLogin(true);
        return;
      }

      setShowNameModal(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: `🎉 Hello ${userName}! Welcome to E-C Digital Hub's premium experience! I'm your dedicated Virtual assistant, equipped with advanced local knowledge, ready to provide you with lightning-fast support. Whether you need information about our cutting-edge services, competitive rates, or want to make a booking - I'm here 24/7!`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        typing: false
      }]);
    }
  };

  const sendMessage = async (e, predefinedMessage = null) => {
    e.preventDefault();
    const messageToSend = predefinedMessage || inputMessage.trim();
    if (!messageToSend || messageToSend.length > 1000) {
      alert('Message must be between 1 and 1000 characters.');
      return;
    }
    if (userName.length > 50) {
      alert('Username must be 50 characters or less.');
      return;
    }
    if (!conversationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
      console.error('Invalid conversationId:', conversationId);
      const newId = uuidv4();
      console.log('Generated new conversationId:', newId);
      setConversationId(newId);
    }

    const userMessage = {
      id: messages.length + 1,
      text: messageToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      typing: false
    };

    setMessages(prev => [...prev, userMessage]);
    if (!predefinedMessage) {
      setInputMessage('');
    }
    setIsTyping(true);

    if (isAdmin && messageToSend.toLowerCase().includes('admin dashboard')) {
      await fetchAdminDashboard();
      setIsTyping(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          user_name: userName,
          conversation_id: conversationId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: data.response,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
            typing: false
          }]);
        }, 1500);
      } else {
        throw new Error(`API response not ok: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('API error:', err);
      setIsTyping(false);
      setIsConnected(false);
      setTimeout(() => {
        setIsConnected(true);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "I'm sorry, I'm having technical difficulties right now. Please try again or ask our staff for assistance.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          typing: false
        }]);
      }, 1500);
    }
  };
  
  const handleUpdateService = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
    try {
      const response = await fetch(`http://localhost:8000/api/admin/update-services?username=${encodeURIComponent(userName)}&service_name=${encodeURIComponent(serviceUpdateData.service_name)}&new_info=${encodeURIComponent(serviceUpdateData.new_info)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUpdateMessage(data.message);
        setServiceUpdateData({ service_name: '', new_info: '' });
      } else {
        throw new Error(data.detail || 'Failed to update service.');
      }
    } catch (error) {
      console.error('Service update error:', error);
      setUpdateMessage(`Error: ${error.message}`);
    }
  };

  const handleQuickQuestion = (questionText) => {
    const event = new Event('submit', { cancelable: true });
    sendMessage(event, questionText);
  };
    
  const quickQuestions = [
    { text: "What are your current rates?", icon: <Star size={16} />, color: "primary", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { text: "Show me all available services", icon: <Monitor size={16} />, color: "success", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { text: "How do I book a gaming session?", icon: <Gamepad2 size={16} />, color: "warning", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { text: "What are your operating hours?", icon: <Clock size={16} />, color: "info", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
    { text: "Do you sell stationery or accessories?", icon: <Usb size={16} />, color: "danger", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" },
    { text: "Can I charge my phone?", icon: <Smartphone size={16} />, color: "secondary", gradient: "linear-gradient(135deg, #c471ed 0%, #f7797d 100%)" }
  ];

  const services = [
    { icon: <Globe size={24} />, name: "Internet", color: "text-primary", desc: "High-Speed Browse" },
    { icon: <Gamepad2 size={24} />, name: "Gaming", color: "text-success", desc: "Premium Gaming Zone" },
    { icon: <Printer size={24} />, name: "Printing", color: "text-info", desc: "Professional Printing" },
    { icon: <BookOpen size={24} />, name: "Training", color: "text-warning", desc: "Computer Courses" },
    { icon: <Usb size={24} />, name: "Stationery", color: "text-danger", desc: "Digital Essentials" },
    { icon: <Smartphone size={24} />, name: "Charging", color: "text-secondary", desc: "Phone Charging" }
  ];

  return (
    <div className="vh-100 position-relative modern-bg">
      {showNameModal && !showAdminLogin && (
        <div className="modal-backdrop-modern">
          <div className="modal-content-modern">
            <h4>Welcome to E-C Digital Hub!</h4>
            <p>Please enter your name to begin your conversation.</p>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                required
              />
              <button type="submit">Start Chat</button>
            </form>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="modal-backdrop-modern">
          <div className="modal-content-modern">
            <h4>Admin Login</h4>
            <p>Enter your admin username to continue.</p>
            <form onSubmit={handleAdminLogin}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Admin Username"
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
      
      {showAdminDashboard && (
        <div className="modal-backdrop-modern">
          <div className="modal-content-modern admin-dashboard">
            <h4><BarChart3 size={24} className="me-2" /> Admin Dashboard</h4>
            <p className="text-secondary">Analytics and insights for E-C Digital Hub.</p>
            {adminData ? (
              <div>
                <h5>Overview</h5>
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="card text-center p-3">
                      <MessageCircle size={32} />
                      <p className="mb-0">Total Conversations</p>
                      <h3 className="fw-bold">{adminData.overview.total_conversations}</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center p-3">
                      <Users size={32} />
                      <p className="mb-0">Total Messages</p>
                      <h3 className="fw-bold">{adminData.overview.total_messages}</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center p-3">
                      <TrendingUp size={32} />
                      <p className="mb-0">Avg. Messages/Conv</p>
                      <h3 className="fw-bold">{adminData.overview.avg_messages_per_conversation}</h3>
                    </div>
                  </div>
                </div>
                
                <h5>Daily Activity (Last 7 Days)</h5>
                <ul className="list-group mb-4">
                  {adminData.daily_activity.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {item.day_name} ({item.date})
                      <span className="badge bg-primary rounded-pill">{item.messages} messages</span>
                    </li>
                  ))}
                </ul>

                <h5>Top 10 Active Users</h5>
                <ul className="list-group">
                  {adminData.active_users.map((user, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {user.name}
                      <span className="badge bg-secondary rounded-pill">{user.messages} messages</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Loading dashboard data...</p>
            )}

            <div className="service-management-section mt-4">
              <h5 className="mb-3"><PenTool size={20} className="me-2" /> Service Management</h5>
              <form onSubmit={handleUpdateService}>
                <div className="mb-3">
                  <label htmlFor="serviceName" className="form-label">Service Name</label>
                  <select
                    id="serviceName"
                    className="form-select"
                    value={serviceUpdateData.service_name}
                    onChange={(e) => setServiceUpdateData({...serviceUpdateData, service_name: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="printing">Printing</option>
                    <option value="internet">Internet</option>
                    <option value="computer_services">Computer Services</option>
                    <option value="scanning">Scanning</option>
                    <option value="gaming">Gaming</option>
                    <option value="training">Training</option>
                    <option value="mobile">Mobile</option>
                    <option value="stationery">Stationery</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="newInfo" className="form-label">New Information</label>
                  <textarea
                    id="newInfo"
                    className="form-control"
                    rows="3"
                    value={serviceUpdateData.new_info}
                    onChange={(e) => setServiceUpdateData({...serviceUpdateData, new_info: e.target.value})}
                    placeholder="E.g., 'We offer high-quality printing services: Black & white (KES 5/page), Color printing (KES 20/page)'"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Update Service</button>
              </form>
              {updateMessage && <div className="mt-3 alert alert-info">{updateMessage}</div>}
            </div>

            <button className="btn btn-secondary mt-3" onClick={() => setShowAdminDashboard(false)}>Close Dashboard</button>
          </div>
        </div>
      )}

      <div className={`chatbot-container-modern glass-panel ${showNameModal || showAdminLogin || showAdminDashboard ? 'd-none' : ''}`}>
        <div className="chatbot-header-modern">
          <Shield size={24} className="me-2" />
          <span>E-C Digital Hub AI Assistant</span>
          <div className={`status-dot-modern ms-auto me-2 ${isConnected ? 'online' : 'offline'}`} />
          <span className="text-sm">{isConnected ? 'Online' : 'Offline'}</span>
        </div>

        <div className="chatbot-messages-modern">
          <div className="service-cards-modern">
            <h5 className="text-white mb-3">Our Services</h5>
            <div className="d-flex overflow-auto pb-2 gap-3" style={{ maxWidth: '100%' }}>
              {services.map((service, index) => (
                <div key={index} className="service-card-modern" style={{ minWidth: '120px' }}>
                  <div className="service-icon-modern">
                    {service.icon}
                  </div>
                  <h6 className="service-name-modern">{service.name}</h6>
                  <p className="service-desc-modern">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {messages.map(msg => (
            <div key={msg.id} className={`message-row-modern ${msg.sender}`}>
              <div className="message-icon-modern">
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="message-bubble-modern">
                <div className="message-text">
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
                <div className="message-timestamp-modern">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-row-modern bot">
              <div className="message-icon-modern"><Bot size={18} /></div>
              <div className="message-bubble-modern typing-indicator-modern">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-modern">
          <div className="quick-questions-modern">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                style={{ background: question.gradient }}
                onClick={() => handleQuickQuestion(question.text)}
              >
                {question.icon}
                <span className="ms-2">{question.text}</span>
              </button>
            ))}
          </div>
          <form onSubmit={sendMessage} className="mt-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" disabled={isTyping} className="btn-send-modern">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;