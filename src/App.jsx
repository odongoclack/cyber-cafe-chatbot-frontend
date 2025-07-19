import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Clock, Wifi, Coffee, Users, MessageCircle, Star, Shield, Headphones, Zap, Globe, Monitor, Gamepad2, Printer, BookOpen, Phone, Mail, MapPin, Award, TrendingUp, Activity, Usb, Cable, Smartphone, Settings, BarChart3 } from 'lucide-react';

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🌟 Welcome to E-C Digital Hub! I'm your AI-powered virtual assistant. How can I elevate your cyber cafe experience today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      typing: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(12);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionPulse, setConnectionPulse] = useState(false);
  const [systemStats, setSystemStats] = useState({
    activeUsers: 15,
    todayBookings: 38,
    satisfaction: 98
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [conversationId, setConversationId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(8, prev + Math.floor(Math.random() * 3) - 1));
      setSystemStats(prev => ({
        activeUsers: Math.max(10, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        todayBookings: prev.todayBookings + Math.floor(Math.random() * 2),
        satisfaction: Math.min(100, Math.max(95, prev.satisfaction + Math.floor(Math.random() * 3) - 1))
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setConnectionPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  const handleAdminLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName
        }),
      });

      const data = await response.json();
      if (data.success) {
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
        alert('Access denied. Admin credentials required.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Connection error. Please try again.');
    }
  };

  const fetchAdminDashboard = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/dashboard?username=${userName}`);
      const data = await response.json();
      setAdminData(data);
      setShowAdminDashboard(true);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      typing: false
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    if (isAdmin && currentMessage.toLowerCase().includes('admin dashboard')) {
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
          message: currentMessage,
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
            text: data.response || getIntelligentResponse(currentMessage),
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
            typing: false
          }]);
        }, 1500);
      } else {
        throw new Error('API response not ok');
      }
    } catch (err) {
      console.log('Using intelligent fallback response:', err.message);
      setIsConnected(false);
      setTimeout(() => {
        setIsConnected(true);
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: getIntelligentResponse(currentMessage),
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          typing: false
        }]);
      }, 1500);
    }
  };

  const getIntelligentResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('rate') || msg.includes('price') || msg.includes('cost') || msg.includes('charge')) {
      return "💰 **Premium Pricing Structure**\n\n🌐 **Internet Browse**: KSh 50/hour\n🎮 **Gaming Zone**: KSh 80/hour (High-spec PCs)\n🖨️ **Printing & Typing**: KSh 30/hour\n📚 **Computer Training**: KSh 100/hour\n📱 **Phone Charging**: KSh 20/hour\n📦 **Stationery & Accessories**: USBs, cables, flash drives, earphones (Prices vary)\n\n💎 **VIP Packages**: Daily (KSh 400), Weekly (KSh 2,500), Monthly (KSh 8,000)\n\n*All packages include complimentary refreshments and priority support!*";
    }
    
    if (msg.includes('service') || msg.includes('what do you') || msg.includes('offer')) {
      return "🚀 **E-C Digital Hub Premium Services**\n\n🌐 **High-Speed Internet** (100+ Mbps)\n🎮 **Gaming Lounge** (Latest titles & tournaments)\n🖨️ **Professional Printing** (Color & B&W)\n📄 **Laminating & Binding**\n📱 **Device Services** (Repair & Troubleshooting, Phone Charging)\n💻 **Computer Training** (Beginner to Advanced)\n☕ **Refreshment Zone** (Complimentary for VIP)\n📞 **24/7 Tech Support**\n🎯 **Event Hosting** (Gaming tournaments)\n🛍️ **Digital & Stationery Shop** (USBs, cables, flash drives, earphones, basic office supplies)\n\n*Your one-stop digital solution hub!*";
    }
    
    if (msg.includes('time') || msg.includes('hours') || msg.includes('open') || msg.includes('when')) {
      return "⏰ **24/7 Digital Experience**\n\n🌅 **Morning Rush**: 6AM - 10AM (Business & Students)\n☀️ **Day Sessions**: 10AM - 6PM (Training & Casual)\n🌆 **Prime Time**: 6PM - 12AM (Gaming Peak Hours)\n🌙 **Night Owls**: 12AM - 6AM (Quiet Study Mode)\n\n📊 **Live Capacity**: Currently " + Math.floor(Math.random() * 30 + 10) + "% occupied\n\n*Peak gaming hours: 6PM-10PM - Book ahead for guaranteed slots!*";
    }
    
    if (msg.includes('book') || msg.includes('reserve') || msg.includes('appointment')) {
      return "📅 **Smart Booking System**\n\n🎯 **Quick Book**: Choose your preferred time & service\n⚡ **Instant Confirmation**: Real-time availability\n📱 **Mobile Alerts**: SMS/Email reminders\n🎮 **Gaming Slots**: 2-hour blocks recommended\n💼 **Business Hours**: Priority booking available\n\n📞 **Book Now**: Call +254-701-161779 or +254-112-670912, or use our app\n\n*VIP members get 20% discount on all bookings!*";
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good')) {
      return "👋 **Hello " + userName + "!** \n\nGreat to see you at E-C Digital Hub! 🌟 \n\nI'm your AI assistant, equipped with:\n✨ Real-time service updates\n📊 Live availability tracking\n🎯 Personalized recommendations\n⚡ Instant booking capabilities\n\nHow can I make your digital experience exceptional today? 🚀";
    }
    
    if (msg.includes('contact') || msg.includes('phone') || msg.includes('address')) {
      return "📞 **Contact E-C Digital Hub**\n\n📱 **Phone**: +254-701-161779 | +254-112-670912\n📧 **Email**: info@ecdigitalhub.co.ke\n📍 **Address**: Digital Plaza, Nairobi CBD\n🌐 **Website**: www.ecdigitalhub.co.ke\n\n🕒 **Response Time**: < 5 minutes\n⭐ **Rating**: 4.9/5 (500+ reviews)\n\n*Follow us on social media for daily updates and gaming tournaments!*";
    }
    
    if (msg.includes('game') || msg.includes('gaming') || msg.includes('play')) {
      return "🎮 **Gaming Zone Experience**\n\n🔥 **Latest Games**: FIFA 24, Call of Duty, Fortnite, Valorant\n💻 **High-End PCs**: RTX 4080, 32GB RAM, 240Hz monitors\n🏆 **Weekly Tournaments**: Win cash prizes!\n🎧 **Premium Setup**: Gaming headsets & mechanical keyboards\n\n📅 **Gaming Schedule**:\n• 6PM-10PM: Peak gaming hours\n• Weekends: 24-hour gaming marathons\n\n🎯 **Pro Tip**: Book 2+ hours for tournament eligibility!";
    }

    if (msg.includes('stationery') || msg.includes('usb') || msg.includes('cable') || msg.includes('flash') || msg.includes('accessories')) {
      return "🛍️ **Digital Accessories & Stationery**\n\nWe offer a selection of essential digital accessories and basic stationery for your convenience:\n• **USB Flash Drives** (Various sizes)\n• **Charging Cables** (Type-C, Micro USB, Lightning)\n• **Headphones/Earphones**\n• **Computer Mice & Keyboards** (Basic options)\n• **Printing Paper** (A4, A3)\n• **Pens, Notepads, and more!**\n\n*Inquire at the counter for current stock and pricing!*";
    }

    if (msg.includes('charging') || msg.includes('phone charging')) {
      return "📱 **Phone Charging Services**\n\nNeed to power up? We offer fast and secure phone charging services. \n\n• **Rate**: KSh 20 per hour\n• **Charger Availability**: We have universal chargers for various devices.\n\n*Keep your devices ready while you work or play!*";
    }
    
    return "✨ **Thank you for reaching out!** \n\nI'm here to assist you with:\n🎯 Service information & pricing\n📅 Booking & reservations\n🎮 Gaming zone details\n💻 Technical support\n📊 Real-time availability\n🛍️ Stationery & Accessories\n\nWhat specific information can I provide about E-C Digital Hub's premium services? 🚀";
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

  const systemIndicators = [
    { icon: <Users size={16} />, label: "Active Users", value: systemStats.activeUsers, color: "success" },
    { icon: <TrendingUp size={16} />, label: "Today's Bookings", value: systemStats.todayBookings, color: "primary" },
    { icon: <Activity size={16} />, label: "Satisfaction", value: systemStats.satisfaction + "%", color: "warning" }
  ];

  return (
    <div className="vh-100 position-relative" style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div className="position-absolute w-100 h-100 overflow-hidden" style={{zIndex: -1}}>
        <div className="position-absolute rounded-circle" 
             style={{
               width: '300px', 
               height: '300px', 
               top: '5%', 
               left: '85%', 
               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
               animation: 'float 8s ease-in-out infinite'
             }}></div>
        <div className="position-absolute rounded-circle" 
             style={{
               width: '200px', 
               height: '200px', 
               top: '60%', 
               left: '5%', 
               background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
               animation: 'float 6s ease-in-out infinite reverse'
             }}></div>
        <div className="position-absolute" 
             style={{
               width: '150px', 
               height: '150px', 
               top: '30%', 
               left: '10%', 
               background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
               animation: 'float 10s ease-in-out infinite'
             }}></div>
      </div>

      {showAdminLogin && (
        <div className="modal d-flex align-items-center justify-content-center" 
             style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{borderRadius: '25px', overflow: 'hidden'}}>
              <div className="modal-header text-white position-relative p-0" 
                   style={{background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', minHeight: '100px'}}>
                <div className="container-fluid p-4">
                  <h4 className="modal-title fw-bold mb-2 d-flex align-items-center">
                    <Shield className="me-3" size={32} />
                    Admin Access Required
                  </h4>
                  <p className="mb-0 opacity-90">Restricted Area - Business Owners Only</p>
                </div>
              </div>
              
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div className="alert alert-warning d-flex align-items-center">
                    <Settings className="me-2" size={20} />
                    <span>Detected admin username: <strong>{userName}</strong></span>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    onClick={handleAdminLogin}
                    className="btn btn-danger btn-lg fw-bold"
                    style={{borderRadius: '15px'}}
                  >
                    <Shield size={20} className="me-2" />
                    Confirm Admin Access
                  </button>
                  <button 
                    onClick={() => {setShowAdminLogin(false); setShowNameModal(true);}}
                    className="btn btn-outline-secondary"
                    style={{borderRadius: '15px'}}
                  >
                    Back to Regular Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminDashboard && adminData && (
        <div className="modal d-flex align-items-center justify-content-center" 
             style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{borderRadius: '25px', overflow: 'hidden'}}>
              <div className="modal-header text-white position-relative p-0" 
                   style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', minHeight: '100px'}}>
                <div className="container-fluid p-4">
                  <h4 className="modal-title fw-bold mb-2 d-flex align-items-center">
                    <BarChart3 className="me-3" size={32} />
                    Admin Dashboard
                  </h4>
                  <p className="mb-0 opacity-90">Business Analytics & Insights</p>
                </div>
                <button 
                  onClick={() => setShowAdminDashboard(false)}
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                ></button>
              </div>
              
              <div className="modal-body p-4" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                <div className="row g-3 mb-4">
                  <div className="col-md-3 col-6">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h3 className="mb-1">{adminData.overview.total_conversations}</h3>
                        <small>Total Conversations</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h3 className="mb-1">{adminData.overview.total_messages}</h3>
                        <small>Total Messages</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="card bg-warning text-white">
                      <div className="card-body text-center">
                        <h3 className="mb-1">{adminData.overview.recent_conversations}</h3>
                        <small>This Week</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h3 className="mb-1">{adminData.overview.recent_messages}</h3>
                        <small>Recent Messages</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Top Active Users</h6>
                      </div>
                      <div className="card-body">
                        {adminData.active_users.slice(0, 5).map((user, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <span>{user.name}</span>
                            <span className="badge bg-secondary">{user.messages} msgs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Daily Activity (Last 7 Days)</h6>
                      </div>
                      <div className="card-body">
                        {adminData.daily_activity.slice(0, 7).map((day, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <span>{new Date(day.date).toLocaleDateString()}</span>
                            <span className="badge bg-primary">{day.messages} msgs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNameModal && (
        <div className="modal d-flex align-items-center justify-content-center" 
             style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{borderRadius: '25px', overflow: 'hidden'}}>
              <div className="modal-header text-white position-relative p-0" 
                   style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '120px'}}>
                <div className="container-fluid p-4">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h4 className="modal-title fw-bold mb-2">
                        <Coffee className="me-3" size={32} />
                        E-C Digital Hub
                      </h4>
                      <p className="mb-0 opacity-90">Your Premium Cyber Experience Awaits</p>
                    </div>
                    <div className="col-4 text-end">
                      <div className="bg-white bg-opacity-20 rounded-circle p-3 d-inline-block">
                        <Zap size={28} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="position-absolute bottom-0 start-0 w-100" style={{height: '3px', background: 'linear-gradient(90deg, #fff 0%, transparent 100%)'}}></div>
              </div>
              
              <div className="modal-body p-0" style={{background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'}}>
                <div className="p-4">
                  <div className="row mb-4">
                    {services.map((service, index) => (
                      <div key={index} className="col-6 col-md-3 mb-3">
                        <div className="text-center">
                          <div className={`mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center ${service.color}`} 
                               style={{width: '60px', height: '60px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '2px solid #dee2e6'}}>
                            {service.icon}
                          </div>
                          <h6 className="fw-bold mb-1">{service.name}</h6>
                          <small className="text-muted">{service.desc}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row mb-4">
                    {systemIndicators.map((indicator, index) => (
                      <div key={index} className="col-4">
                        <div className="text-center">
                          <div className={`text-${indicator.color} mb-1`}>
                            {indicator.icon}
                          </div>
                          <div className={`h5 fw-bold text-${indicator.color} mb-0`}>{indicator.value}</div>
                          <small className="text-muted">{indicator.label}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-light rounded-4 p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-dark">What should I call you?</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control form-control-lg shadow-sm border-0"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your name please.."
                          style={{
                            borderRadius: '20px', 
                            backgroundColor: 'white',
                            paddingLeft: '50px',
                            fontSize: '18px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit(e)}
                        />
                        <User size={20} className="position-absolute text-muted" style={{top: '50%', left: '20px', transform: 'translateY(-50%)'}} />
                      </div>
                    </div>
                    <button 
                      onClick={handleNameSubmit}
                      className="btn btn-lg w-100 text-white fw-bold shadow-lg border-0"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        fontSize: '18px',
                        padding: '15px'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <MessageCircle size={20} className="me-2" />
                      Start Your Digital Journey ✨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid h-100 p-0">
        <div className="row h-100 g-0">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg text-white shadow-lg" 
                 style={{background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(25px)', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
              <div className="container-fluid py-2">
                <div className="navbar-brand mb-0 h1 text-white fw-bold d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                    <Coffee size={isMobile ? 20 : 28} className="text-white" />
                  </div>
                  <div>
                    <div style={{fontSize: isMobile ? '18px' : '24px'}}>E-C Digital Hub</div>
                    <small className="fw-normal opacity-90" style={{fontSize: isMobile ? '10px' : '12px'}}>
                      AI-Powered Assistant {isAdmin && '(Admin Mode)'}
                    </small>
                  </div>
                </div>
                
                <div className={`d-flex align-items-center ${isMobile ? 'flex-column' : 'flex-row'}`}>
                  <div className={`${isMobile ? 'mb-2' : 'me-4'} d-flex align-items-center bg-white bg-opacity-15 rounded-pill px-3 py-2`}>
                    <div className={`bg-success rounded-circle me-2 ${connectionPulse ? 'pulse-glow' : ''}`} 
                         style={{width: '8px', height: '8px'}}></div>
                    <Users size={isMobile ? 14 : 18} className="me-1" />
                    <span className={`badge bg-success fw-bold ${isMobile ? 'fs-7' : 'fs-6'} text-dark`}>{onlineUsers}</span>
                    <small className="ms-1 opacity-90 text-dark" style={{fontSize: isMobile ? '10px' : '12px'}}>online</small>
                  </div>
                  
                  {!isMobile && (
                    <>
                      <div className="me-4 d-flex align-items-center bg-white bg-opacity-15 rounded-pill px-3 py-2">
                        <Wifi size={18} className="me-2 text-dark" />
                        <span className="fw-semibold text-dark">{isConnected ? 'Connected' : 'Reconnecting...'}</span>
                      </div>
                      
                      <div className="d-flex align-items-center bg-white bg-opacity-15 rounded-pill px-3 py-2">
                        {isAdmin ? (
                          <>
                            <Shield size={18} className="me-1 text-warning" />
                            <span className="fw-bold text-warning">Admin</span>
                          </>
                        ) : (
                          <>
                            <Star size={18} className="me-1 text-warning" />
                            <span className="fw-bold text-dark">4.9</span>
                            <small className="ms-1 opacity-90 text-dark">/5</small>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>

          <div className="col-12 d-flex flex-column" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="flex-grow-1 p-3 overflow-auto" style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              padding: isMobile ? '10px' : '20px'
            }}>
              {messages.map(message => (
                <div key={message.id} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`d-flex align-items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-3 rounded-4 shadow-sm ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                         style={{
                           maxWidth: isMobile ? '85%' : '70%',
                           borderBottomLeftRadius: message.sender === 'user' ? '1.2rem' : '0.3rem',
                           borderBottomRightRadius: message.sender === 'user' ? '0.3rem' : '1.2rem',
                           borderTopLeftRadius: '1.2rem',
                           borderTopRightRadius: '1.2rem'
                         }}>
                      <p className="mb-1" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br>') }}></p>
                      <small className={`d-block text-end opacity-75 ${message.sender === 'user' ? 'text-white' : 'text-muted'}`} style={{fontSize: '0.7em'}}>
                        {message.timestamp}
                      </small>
                    </div>
                    {message.sender === 'bot' && (
                      <div className="ms-2">
                        <Bot size={24} className="text-white" />
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <div className="me-2">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="d-flex mb-3 justify-content-start">
                  <div className="d-flex align-items-start">
                    <div className="p-3 rounded-4 bg-light text-dark shadow-sm"
                         style={{
                           maxWidth: isMobile ? '85%' : '70%',
                           borderBottomLeftRadius: '0.3rem',
                           borderBottomRightRadius: '1.2rem',
                           borderTopLeftRadius: '1.2rem',
                           borderTopRightRadius: '1.2rem'
                         }}>
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                    <div className="ms-2">
                      <Bot size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(25px)', borderTop: '1px solid rgba(255,255,255,0.2)'}}>
              <div className="d-flex flex-wrap justify-content-center mb-3">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    className="btn btn-sm text-white rounded-pill px-3 py-2 m-1 fw-semibold shadow-sm"
                    style={{
                      background: q.gradient,
                      fontSize: isMobile ? '0.75rem' : '0.85rem',
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.2s ease',
                      border: 'none'
                    }}
                    onClick={() => setInputMessage(q.text)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {q.icon} <span className="ms-1">{q.text}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={sendMessage} className="d-flex">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill shadow-sm border-0 pe-5"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isTyping}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                      fontSize: isMobile ? '1rem' : '1.1rem'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill position-absolute end-0 h-100 px-4 shadow-sm"
                    disabled={isTyping || !inputMessage.trim()}
                    style={{
                      background: 'linear-gradient(45deg, #007bff 0%, #00d4ff 100%)',
                      border: 'none',
                      zIndex: 1,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #0056b3 0%, #00ace6 100%)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #007bff 0%, #00d4ff 100%)'}
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }

        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }

        .typing-indicator span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #999;
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 0.6s infinite alternate;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-5px);
          }
        }

        .modal {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;