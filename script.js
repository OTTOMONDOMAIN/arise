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
    const ip = '140.238.165.91:7173';
    navigator.clipboard.writeText(ip).then(() => {
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

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        });
    });

    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
});

// Smooth Scrolling
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

// ===== SERVER STATUS =====
async function getServerStatus() {
    try {
        const response = await fetch("https://api.mcsrvstat.us/2/140.238.165.91:7173");
        const data = await response.json();

        const statusIndicator = document.getElementById("status-indicator");
        const statusText = document.getElementById("status-text");
        const playerCount = document.getElementById("player-count");

        if (data.online) {
            statusIndicator.className = "status-indicator online";
            statusText.innerText = "Server Online";
            playerCount.innerText = `${data.players.online}/${data.players.max} Players`;
            document.getElementById("active-players").innerText = data.players.online + "+";
        } else {
            statusIndicator.className = "status-indicator offline";
            statusText.innerText = "Server Offline";
            playerCount.innerText = "0/0 Players";
        }
    } catch (error) {
        console.error("Error fetching server status:", error);
        document.getElementById("status-text").innerText = "Server Status Unknown";
        document.getElementById("player-count").innerText = "?/? Players";
    }
}

// ===== LIVE LEADERBOARD using mcapi.us (WORKS!) =====
async function loadLiveLeaderboard() {
    const container = document.getElementById('leaderboard-body');
    if (!container) return;
    
    try {
        // Show loading
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;"><i class="fas fa-circle-notch fa-spin"></i> Loading live players...</td></tr>';
        
        // Get server status with player list
        const response = await fetch('https://mcapi.us/server/status?ip=140.238.165.91&port=7173');
        const data = await response.json();
        
        if (data.online && data.players && data.players.sample) {
            const players = data.players.sample.slice(0, 10); // Get top 10 players
            let html = '';
            
            players.forEach((player, index) => {
                // Generate random stats for demo (replace with real stats from your plugin)
                const hearts = Math.floor(Math.random() * 30) + 20;
                const kills = Math.floor(Math.random() * 200) + 50;
                const deaths = Math.floor(Math.random() * 50) + 10;
                
                html += `
                <tr ${index === 0 ? 'class="top-player"' : ''}>
                    <td>${index === 0 ? '#1 👑' : '#' + (index + 1)}</td>
                    <td><img src="https://mc-heads.net/avatar/${player.name}" alt="${player.name}" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve'"> ${player.name}</td>
                    <td><i class="fas fa-heart" style="color: #ff4d4d;"></i> ${hearts}</td>
                    <td>${kills}</td>
                    <td>${deaths}</td>
                </tr>
                `;
            });
            
            container.innerHTML = html;
        } else {
            // No players online - show message
            container.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                        <i class="fas fa-info-circle"></i> No players currently online
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Failed to load leaderboard:", error);
        container.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="color: #ff4d4d;"></i> 
                    Failed to load leaderboard. Server may be offline.
                    <br><button onclick="loadLiveLeaderboard()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: linear-gradient(135deg, #ff4d4d, #6b46c1); border: none; color: white; border-radius: 5px; cursor: pointer;">Retry</button>
                </td>
            </tr>
        `;
    }
}

// ===== ALTERNATIVE: If you want to use your WebStats port =====
function checkWebStats() {
    // This just checks if WebStats is accessible
    fetch('http://140.238.165.91:7030')
        .then(response => {
            if (response.ok) {
                console.log('✅ WebStats is accessible on port 7030');
                // You can access it at: http://140.238.165.91:7030
            }
        })
        .catch(err => {
            console.log('⚠️ WebStats not accessible on port 7030. Make sure it\'s installed and port is open.');
        });
}

// Add styles
const style = document.createElement('style');
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

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    getServerStatus();
    loadLiveLeaderboard();
    checkWebStats();
    
    // Update every 30 seconds
    setInterval(() => {
        getServerStatus();
        loadLiveLeaderboard();
    }, 30000);
});
