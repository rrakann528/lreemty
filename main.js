// Lremty - Main JavaScript File

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParticles();
    initializeScrollEffects();
});

// Initialize entrance animations
function initializeAnimations() {
    // Animate hero elements
    anime({
        targets: '#main-title',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 500
    });
    
    anime({
        targets: '#subtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 800
    });
    
    anime({
        targets: '#hero-buttons',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 1200
    });
    
    // Animate feature cards
    const featureCards = document.querySelectorAll('.glass-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    scale: [0.9, 1],
                    duration: 600,
                    easing: 'easeOutExpo',
                    delay: index * 100
                });
            }
        });
    });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Initialize floating particles animation
function initializeParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    // Create more particles dynamically
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const hero = document.querySelector('#home');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Room Management Functions
function createRoom() {
    const roomId = generateRoomId();
    const roomUrl = `${window.location.origin}/room.html?id=${roomId}`;
    
    // Store room data in localStorage
    const roomData = {
        id: roomId,
        createdAt: new Date().toISOString(),
        participants: [],
        videoUrl: null,
        isPlaying: false,
        currentTime: 0
    };
    
    localStorage.setItem(`room_${roomId}`, JSON.stringify(roomData));
    
    // Show notification
    showNotification('تم إنشاء الغرفة بنجاح! جاري التحويل...');
    
    // Redirect to room page
    setTimeout(() => {
        window.location.href = roomUrl;
    }, 1500);
}

function showJoinRoom() {
    const joinSection = document.getElementById('join-room-section');
    joinSection.classList.remove('hidden');
    
    anime({
        targets: joinSection,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutExpo'
    });
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('room-url').focus();
    }, 500);
}

function joinRoom() {
    const roomUrlInput = document.getElementById('room-url');
    const roomUrl = roomUrlInput.value.trim();
    
    if (!roomUrl) {
        showNotification('الرجاء إدخال رابط الغرفة', 'error');
        return;
    }
    
    // Extract room ID from URL
    let roomId = null;
    
    if (roomUrl.includes('room.html?id=')) {
        roomId = roomUrl.split('id=')[1];
    } else if (roomUrl.length === 10) {
        roomId = roomUrl;
    } else {
        showNotification('رابط الغرفة غير صحيح', 'error');
        return;
    }
    
    // Check if room exists
    const roomData = localStorage.getItem(`room_${roomId}`);
    if (!roomData && !isValidRoomId(roomId)) {
        showNotification('الغرفة غير موجودة', 'error');
        return;
    }
    
    // Redirect to room
    window.location.href = `room.html?id=${roomId}`;
}

function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function isValidRoomId(roomId) {
    return /^[A-Za-z0-9]{10}$/.test(roomId);
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    
    // Set color based on type
    if (type === 'error') {
        notification.className = notification.className.replace('bg-green-500', 'bg-red-500');
    } else {
        notification.className = notification.className.replace('bg-red-500', 'bg-green-500');
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key in room URL input
    if (e.key === 'Enter' && e.target.id === 'room-url') {
        joinRoom();
    }
    
    // Escape key to hide join room section
    if (e.key === 'Escape') {
        const joinSection = document.getElementById('join-room-section');
        if (!joinSection.classList.contains('hidden')) {
            joinSection.classList.add('hidden');
        }
    }
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// WebSocket simulation for demo purposes
class WatchTogetherSocket {
    constructor() {
        this.connected = false;
        this.roomId = null;
        this.participants = [];
    }
    
    connect(roomId) {
        this.roomId = roomId;
        this.connected = true;
        
        // Simulate connection
        console.log(`Connected to room: ${roomId}`);
        
        // Add current user as participant
        this.participants.push({
            id: 'current_user',
            name: 'أنت',
            joinedAt: new Date().toISOString()
        });
        
        return true;
    }
    
    disconnect() {
        this.connected = false;
        this.roomId = null;
        this.participants = [];
    }
    
    sendMessage(type, data) {
        if (!this.connected) return false;
        
        // Simulate sending message
        console.log('Sending message:', { type, data, roomId: this.roomId });
        
        // Simulate receiving response after delay
        setTimeout(() => {
            this.handleMessage(type, data);
        }, 100);
        
        return true;
    }
    
    handleMessage(type, data) {
        switch (type) {
            case 'join':
                this.participants.push({
                    id: data.userId,
                    name: data.userName,
                    joinedAt: new Date().toISOString()
                });
                break;
                
            case 'leave':
                this.participants = this.participants.filter(p => p.id !== data.userId);
                break;
                
            case 'video_sync':
                // Handle video synchronization
                break;
                
            case 'chat_message':
                // Handle chat messages
                break;
        }
    }
    
    getParticipants() {
        return this.participants;
    }
}

// Global socket instance
window.watchTogetherSocket = new WatchTogetherSocket();

// Export functions for global access
window.createRoom = createRoom;
window.showJoinRoom = showJoinRoom;
window.joinRoom = joinRoom;

// PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}