// Particles Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ff4d4d'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#6b46c1',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Copy IP Function
function copyIP() {
    const ip = 'arisemc.cbu.net:7173';
    navigator.clipboard.writeText(ip).then(() => {
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Server IP copied to clipboard!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 5, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const menuIcon = menuBtn.querySelector('i');
    
    if (!menuBtn || !navMenu) {
        console.error('Menu elements not found!');
        return;
    }
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        navMenu.classList.toggle('show');
        
        if (navMenu.classList.contains('show')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
});

// Smooth Scrolling for Navigation Links
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

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Card Click Handler
document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = e.target.closest('.card');
        const className = card.querySelector('h3').textContent;
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${className} class selected! Join the server to play.`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });
});

// ===== WEBSTATS LIVE LEADERBOARD =====
async function initWebStats() {
    const container = document.getElementById('webstats-container');
    if (!container) return;
    
    try {
        // Try to fetch directly first to test connection
        const testResponse = await fetch(`http://arisemc.cbu.net:7030/api/players`, {
            mode: 'no-cors',
            timeout: 5000
        }).catch(err => {
            console.log('CORS test failed, but might still work with WebStats library');
        });
        
        // Dynamically import WebStats
        const { WebStats } = await import('https://cdn.jsdelivr.net/npm/webstats@latest/dist/WebStats-dist.js');
        
        await WebStats.init({
            host: 'arisemc.cbu.net',
            port: 7030,
            autoRefresh: true,
            refreshInterval: 10,
            container: container,
            theme: 'dark',
            showHead: true,
            showOnlineStatus: true,
            headers: ['Rank', 'Player', 'Hearts', 'Kills', 'Deaths'],
            format: {
                hearts: (value) => `<i class="fas fa-heart" style="color: #ff4d4d;"></i> ${value}`,
                kills: (value) => value,
                deaths: (value) => value
            }
        });
        
        console.log('✅ WebStats connected successfully on port 7030!');
        
    } catch (error) {
        console.error('❌ WebStats error:', error);
        showWebStatsError(error.message);
    }
}

function showWebStatsError(message) {
    const container = document.getElementById('webstats-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="webstats-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>⚠️ Cannot Connect to Live Server</h3>
            <p>Could not connect to WebStats on port 7030.</p>
            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 10px; text-align: left; margin: 1rem 0;">
                <p style="color: #ff4d4d; margin-bottom: 0.5rem;"><strong>🔍 Debug Info:</strong></p>
                <p>📡 Server: arisemc.cbu.net:7030</p>
                <p>🔌 Error: ${message || 'Connection timeout'}</p>
            </div>
            <p><strong>Possible fixes:</strong></p>
            <ul style="list-style: none; padding: 0;">
                <li>✅ Check if server is online</li>
                <li>✅ Make sure port 7030 is open in firewall</li>
                <li>✅ Verify WebStats plugin is installed</li>
                <li>✅ Check if serve-webpage is set to false in config</li>
            </ul>
            <button class="retry-btn" onclick="retryWebStats()">
                <i class="fas fa-redo"></i> Retry Connection
            </button>
            <button class="retry-btn" onclick="loadFallbackLeaderboard()" style="background: #6b46c1; margin-left: 1rem;">
                <i class="fas fa-database"></i> Show Sample Data
            </button>
        </div>
    `;
}

// Retry function
window.retryWebStats = function() {
    const container = document.getElementById('webstats-container');
    if (container) {
        container.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i><p>Retrying connection to port 7030...</p></div>';
        initWebStats();
    }
};

// Fallback leaderboard
window.loadFallbackLeaderboard = function() {
    const container = document.getElementById('webstats-container');
    if (!container) return;
    
    container.innerHTML = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Hearts</th>
                    <th>Kills</th>
                    <th>Deaths</th>
                </tr>
            </thead>
            <tbody>
                <tr class="top-player">
                    <td>#1 👑</td>
                    <td><img src="https://mc-heads.net/avatar/Notch"> Notch</td>
                    <td><i class="fas fa-heart" style="color: #ff4d4d;"></i> 42</td>
                    <td>156</td>
                    <td>23</td>
                </tr>
                <tr>
                    <td>#2</td>
                    <td><img src="https://mc-heads.net/avatar/Dream"> Dream</td>
                    <td><i class="fas fa-heart" style="color: #ff4d4d;"></i> 38</td>
                    <td>142</td>
                    <td>31</td>
                </tr>
                <tr>
                    <td>#3</td>
                    <td><img src="https://mc-heads.net/avatar/Technoblade"> Technoblade</td>
                    <td><i class="fas fa-heart" style="color: #ff4d4d;"></i> 35</td>
                    <td>128</td>
                    <td>19</td>
                </tr>
                <tr>
                    <td>#4</td>
                    <td><img src="https://mc-heads.net/avatar/George"> George</td>
                    <td><i class="fas fa-heart" style="color: #ff4d4d;"></i> 31</td>
                    <td>98</td>
                    <td>27</td>
                </tr>
                <tr>
                    <td>#5</td>
                    <td><img src="https://mc-heads.net/avatar/Sapnap"> Sapnap</td>
                    <td><i class="fas fa-heart" style="color: #ff4d4d;"></i> 29</td>
                    <td>87</td>
                    <td>34</td>
                </tr>
            </tbody>
        </table>
        <p style="text-align: center; margin-top: 1rem; color: rgba(255,255,255,0.5);">
            <i class="fas fa-info-circle"></i> Showing sample data - Live connection to port 7030 failed
        </p>
    `;
};

// Add notification styles if they don't exist
if (!document.querySelector('#webstats-styles')) {
    const style = document.createElement('style');
    style.id = 'webstats-styles';
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4d4d, #6b46c1);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .loading-spinner {
            text-align: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
        }
        
        .loading-spinner i {
            font-size: 3rem;
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        .webstats-error {
            background: rgba(255, 77, 77, 0.1);
            border: 2px solid #ff4d4d;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            margin: 2rem 0;
        }
        
        .webstats-error i {
            font-size: 3rem;
            color: #ff4d4d;
            margin-bottom: 1rem;
        }
        
        .webstats-error h3 {
            color: #ff4d4d;
            margin-bottom: 1rem;
        }
        
        .retry-btn {
            background: linear-gradient(135deg, #ff4d4d, #6b46c1);
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            margin: 0.5rem;
        }
        
        .retry-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 77, 77, 0.3);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize WebStats
    initWebStats();
    
    // Auto-retry after 30 seconds if still loading
    setTimeout(() => {
        const container = document.getElementById('webstats-container');
        if (container && container.querySelector('.loading-spinner')) {
            console.log('Auto-retrying WebStats...');
            retryWebStats();
        }
    }, 30000);
});
