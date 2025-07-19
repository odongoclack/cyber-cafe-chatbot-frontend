import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Clock, Wifi, Coffee, Users, MessageCircle, Star, Shield, Headphones, Zap, Globe, Monitor, Gamepad2, Printer, BookOpen, Phone, Mail, MapPin, Award, TrendingUp, Activity, Usb, Cable, Smartphone } from 'lucide-react';

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
    // Simulate real-time stats updates
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
    // Connection pulse animation
    const pulseInterval = setInterval(() => {
      setConnectionPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameModal(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: `🎉 Hello ${userName}! Welcome to E-C Digital Hub's premium experience! I'm your dedicated AI assistant, equipped with advanced local knowledge, ready to provide you with lightning-fast support. Whether you need information about our cutting-edge services, competitive rates, or want to make a booking - I'm here 24/7, even without an API key!`,
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
    setInputMessage('');
    setIsTyping(true);

    // API call to FastAPI backend
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_name: userName,
          conversation_id: 'session_' + Date.now()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: data.response || getIntelligentResponse(inputMessage),
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
          text: getIntelligentResponse(inputMessage),
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
      {/* Advanced Animated Background */}
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

      {/* Enhanced Name Modal */}
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
                  {/* Service Icons */}
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

                  {/* System Status */}
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

                  {/* Name Input */}
                  <div className="bg-light rounded-4 p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-dark">What should I call you?</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control form-control-lg shadow-sm border-0"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your name..."
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

      {/* Enhanced Main Chat Interface */}
      <div className="container-fluid h-100 p-0">
        <div className="row h-100 g-0">
          {/* Enhanced Header */}
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
                    <small className="fw-normal opacity-90" style={{fontSize: isMobile ? '10px' : '12px'}}>AI-Powered Assistant</small>
                  </div>
                </div>
                
                <div className={`d-flex align-items-center text-white ${isMobile ? 'flex-column' : 'flex-row'}`}>
                  {/* Mobile: Stack vertically, Desktop: Keep horizontal */}
                  <div className={`${isMobile ? 'mb-2' : 'me-4'} d-flex align-items-center bg-white bg-opacity-15 rounded-pill px-3 py-2`}>
                    <div className={`bg-success rounded-circle me-2 ${connectionPulse ? 'pulse-glow' : ''}`} 
                         style={{width: '8px', height: '8px'}}></div>
                    <Users size={isMobile ? 14 : 18} className="me-1" />
                    <span className={`badge bg-success fw-bold ${isMobile ? 'fs-7' : 'fs-6'}`}>{onlineUsers}</span>
                    <small className="ms-1 opacity-90" style={{fontSize: isMobile ? '10px' : '12px'}}>online</small>
                  </div>
                  
                  {!isMobile && (
                    <>
                      <div className="me-4 d-flex align-items-center bg-white bg-opacity-15 rounded-pill px-3 py-2">
                        <Wifi size={18} className="me-2" />
                        <span className="fw-semibold">{isConnected ? 'Connected' : 'Reconnecting...'}</span>
                      </div>
                      
                      <div className="d-flex align-items-center bg-white bg-opacity-15 rounded-pill px-3 py-2">
                        <Star size={18} className="me-1 text-warning" />
                        <span className="fw-bold">4.9</span>
                        <small className="ms-1 opacity-90">/5</small>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>

          {/* Enhanced Chat Area */}
          <div className="col-12 d-flex flex-column" style={{height: 'calc(100vh - 80px)'}}>
            {/* Messages Container */}
            <div className="flex-grow-1 overflow-auto p-4" style={{scrollBehavior: 'smooth'}}>
              <div className="container-fluid">
                {/* Enhanced Quick Questions */}
                {messages.length <= 2 && (
                  <div className="row mb-5">
                    <div className="col-12">
                      <div className="card border-0 shadow-lg" 
                           style={{
                             borderRadius: '25px', 
                             background: 'rgba(255,255,255,0.98)', 
                             backdropFilter: 'blur(15px)',
                             border: '1px solid rgba(255,255,255,0.3)'
                           }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary bg-opacity-15 rounded-circle p-2 me-3">
                              <MessageCircle size={isMobile ? 20 : 24} className="text-primary" />
                            </div>
                            <div>
                              <h5 className={`card-title text-dark mb-1 fw-bold ${isMobile ? 'fs-6' : ''}`}>Quick Actions</h5>
                              <small className="text-muted" style={{fontSize: isMobile ? '11px' : '14px'}}>Get instant answers to common questions</small>
                            </div>
                          </div>
                          
                          <div className="row g-3">
                            {quickQuestions.map((question, index) => (
                              <div key={index} className={isMobile ? "col-12" : "col-md-6"}>
                                <button
                                  className="btn w-100 fw-semibold shadow-sm border-0 d-flex align-items-center justify-content-start p-3"
                                  style={{
                                    background: question.gradient,
                                    color: 'white',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    fontSize: isMobile ? '13px' : '15px'
                                  }}
                                  onClick={() => setInputMessage(question.text)}
                                  onMouseOver={(e) => e.target.style.transform = 'translateY(-3px) scale(1.02)'}
                                  onMouseOut={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
                                >
                                  <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                                    {React.cloneElement(question.icon, { size: isMobile ? 14 : 16 })}
                                  </div>
                                  <span>{question.text}</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Messages */}
                {messages.map((message) => (
                  <div key={message.id} className={`row mb-4 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`${isMobile ? 'col-11' : 'col-lg-8 col-md-10'} ${message.sender === 'user' ? 'text-end' : 'text-start'}`}>
                      <div className={`card border-0 shadow-lg message-card ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                           style={{
                             borderRadius: isMobile ? '15px' : '25px', 
                             transition: 'all 0.3s ease',
                             border: message.sender === 'bot' ? '1px solid rgba(255,255,255,0.3)' : 'none'
                           }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start">
                            {message.sender === 'bot' && (
                              <div className="me-3">
                                <div className="rounded-circle p-3 bot-avatar shadow-sm">
                                  <Bot size={isMobile ? 18 : 22} className="text-white" />
                                </div>
                              </div>
                            )}
                            <div className="flex-grow-1">
                              <div className={`fw-medium ${message.sender === 'user' ? 'text-white' : 'text-dark'}`} 
                                   style={{fontSize: isMobile ? '14px' : '16px', lineHeight: '1.6', whiteSpace: 'pre-line'}}>
                                {message.text}
                              </div>
                              <div className={`mt-3 d-flex align-items-center ${message.sender === 'user' ? 'text-white-50 justify-content-end' : 'text-muted'}`}>
                                <Clock size={isMobile ? 12 : 14} className="me-2" />
                                <small style={{fontSize: isMobile ? '10px' : '12px'}}>{message.timestamp}</small>
                                {message.sender === 'bot' && !isMobile && (
                                  <div className="ms-3 d-flex align-items-center">
                                    <Shield size={14} className="me-1" />
                                    <small>AI Assistant</small>
                                  </div>
                                )}
                              </div>
                            </div>
                            {message.sender === 'user' && (
                              <div className="ms-3">
                                <div className="bg-white bg-opacity-25 rounded-circle p-3 shadow-sm">
                                  <User size={isMobile ? 18 : 22} className="text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <div className="row mb-4">
                    <div className="col-lg-8 col-md-10">
                      <div className="card border-0 shadow-lg bot-message" 
                           style={{borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)'}}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start">
                            <div className="me-3">
                              <div className="rounded-circle p-3 bot-avatar shadow-sm">
                                <Bot size={22} className="text-white" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="typing-indicator-advanced">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <small className="text-muted mt-2 d-block">AI is thinking...</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="p-4" style={{
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(25px)',
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="input-group shadow-lg" style={{borderRadius: isMobile ? '20px' : '30px', overflow: 'hidden'}}>
                      <input
                        type="text"
                        className="form-control form-control-lg border-0 bg-white"
                        placeholder={isMobile ? "Type message..." : "Type your message here..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isTyping}
                        style={{
                          paddingLeft: isMobile ? '15px' : '25px', 
                          paddingRight: isMobile ? '15px' : '25px',
                          fontSize: isMobile ? '14px' : '16px',
                          height: isMobile ? '50px' : '60px'
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
                      />
                      <button
                        onClick={sendMessage}
                        className="btn btn-lg text-white fw-bold border-0"
                        disabled={isTyping || !inputMessage.trim()}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          paddingLeft: isMobile ? '20px' : '30px',
                          paddingRight: isMobile ? '20px' : '30px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        {isTyping ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <Send size={isMobile ? 18 : 22} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Mobile-responsive Footer Info */}
                <div className="row mt-3">
                  <div className={isMobile ? "col-12" : "col-md-4"}>
                    <small className="text-white d-flex align-items-center opacity-90" style={{fontSize: isMobile ? '10px' : '12px'}}>
                      <Shield size={isMobile ? 14 : 16} className="me-2" />
                      End-to-end encrypted
                    </small>
                  </div>
                  {!isMobile && (
                    <>
                      <div className="col-md-4 mb-2">
                        <small className="text-white d-flex align-items-center opacity-90">
                          <Headphones size={16} className="me-2" />
                          24/7 AI Support
                        </small>
                      </div>
                      <div className="col-md-4 mb-2">
                        <small className="text-white d-flex align-items-center opacity-90">
                          <Zap size={16} className="me-2" />
                          Instant responses
                        </small>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(-25px) rotate(-1deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          50% { 
            transform: scale(1.3); 
            opacity: 0.8; 
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
          }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .typing-indicator-advanced {
          display: flex;
          gap: 6px;
          padding: 12px 0;
        }
        
        .typing-indicator-advanced span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: typing-advanced 1.6s infinite ease-in-out;
        }
        
        .typing-indicator-advanced span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-indicator-advanced span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        .typing-indicator-advanced span:nth-child(3) {
          animation-delay: 0s;
        }
        
        @keyframes typing-advanced {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }

        /* Mobile-First Responsive Design */
        @media (max-width: 576px) {
          .navbar-brand div {
            font-size: 16px !important;
          }
          
          .modal-dialog {
            margin: 0.5rem;
          }
          
          .card-body {
            padding: 1rem !important;
          }
          
          .btn {
            font-size: 12px !important;
            padding: 0.5rem 1rem !important;
          }
          
          .form-control {
            font-size: 14px !important;
          }
          
          .message-card {
            border-radius: 12px !important;
          }
          
          .input-group {
            border-radius: 15px !important;
          }
          
          .bot-avatar, .user-avatar {
            padding: 0.5rem !important;
          }
        }

        @media (max-width: 768px) {
          .navbar-brand div {
            font-size: 18px !important;
          }
          
          .modal-dialog {
            margin: 1rem;
          }
          
          .btn {
            font-size: 13px !important;
          }
          
          .quick-actions .btn {
            margin-bottom: 0.5rem;
          }
          
          .system-indicators {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .message-timestamp {
            font-size: 10px !important;
          }
        }

        /* Touch-friendly buttons */
        @media (hover: none) and (pointer: coarse) {
          .btn {
            min-height: 44px;
            min-width: 44px;
          }
          
          .form-control {
            min-height: 44px;
          }
          
          .input-group .btn {
            min-width: 60px;
          }
        }

        /* Landscape phone optimization */
        @media (max-width: 896px) and (orientation: landscape) {
          .modal-dialog {
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .navbar {
            padding: 0.25rem 0 !important;
          }
          
          .chat-area {
            height: calc(100vh - 60px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;