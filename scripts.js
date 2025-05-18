const game = {
    levs: 0,
    levsPerClick: 1,
    levsPerSecond: 0,
    totalLevsMined: 0,
    clickCount: 0,
    lastSave: Date.now(),
    
    upgrades: [
        {
            id: 'farm',
            name: 'заедничка фарма',
            description: 'ги зголемува левовите по клик',
            baseCost: 15,
            level: 0,
            maxLevel: 25,
            effect: level => level * 1,
            emoji: '🌾'  
        },
        {
            id: 'selo',
            name: 'циганска населба',
            description: 'фабрика за крек',
            baseCost: 100,
            level: 0,
            maxLevel: 15,
            effect: level => level * 1,
            emoji: '🏚️'  
        },
        {
            id: 'fabrika',
            name: 'фабрика',
            description: 'купи фабрика на град "СТАРА ЗАГОРА"',
            baseCost: 1100,
            level: 0,
            maxLevel: 10,
            effect: level => level * 8,
            emoji: '🏭'  
        },
        {
            id: 'embezzlement',
            name: 'проневера',
            description: 'Проневерувале пари од проектот за автопат',
            baseCost: 12000,
            level: 0,
            maxLevel: 10,
            effect: level => level * 50,
            emoji: '💰'  
        },
        {
            id: 'oligarch',
            name: 'стане олигарх',
            description: 'стане делјан пеевски',
            baseCost: 130000,
            level: 0,
            maxLevel: 1,
            effect: level => level * 470,
            emoji: '👔'  
        },
        {
            id: 'win',
            name: 'фабрика на лева',
            description: 'масата автоматски произведува леви',
            baseCost: 999999,
            level: 0,
            maxLevel: 5,
            effect: level => level * 470,
            emoji: '🏦'  
        }
    ],
    
    achievements: [
        {
            id: 'first_lev',
            name: 'прв лев',
            description: 'го доби твојот прв лев',
            icon: 'лв.',
            unlocked: false,
            check: () => game.totalLevsMined >= 1
        },
        {
            id: 'capitalist',
            name: 'ризичен капиталист',
            description: 'зема 1.000 лева од сиромашните луѓе',
            icon: '💶',
            unlocked: false,
            check: () => game.totalLevsMined >= 1000
        },
        {
            id: 'councilman',
            name: 'иди нахуй',
            description: 'проневери 10.000 лева од градот',
            icon: '🏦',
            unlocked: false,
            check: () => game.levs >= 10000
        },
        {
            id: 'pieceofshit',
            name: 'ти си от стара загора,бг',
            description: 'докато мъдрите се намъдруват, лудите се налудуват',
            icon: '🍆',
            unlocked: false,
            check: () => game.levs >= 10000
        },
        {
            id: 'childlabour',
            name: 'детски труд',
            description: 'кинеските бебиња кликнале 500 пати',
            icon: '👆',
            unlocked: false,
            check: () => game.clickCount >= 500
        },
        {
            id: 'spy',
            name: 'шпион',
            description: 'ти си руски шпионин бонак, который есть много заводи',
            icon: '🇷🇺',
            unlocked: false,
            check: () => {
                const totalUpgrades = game.upgrades.reduce((sum, upgrade) => sum + upgrade.level, 0);
                return totalUpgrades >= 25;
            }
        },
        {
            id: 'oligarx',
            name: 'олигарх',
            description: 'забранен ти е достъпът до САЩ',
            icon: '💸',
            unlocked: false,
            check: () => game.levsPerSecond >= 100
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('bgMusic');
  const muteButton = document.getElementById('muteToggle');
  const muteIcon = document.getElementById('muteIcon');
  const muteStatus = document.getElementById('muteStatus');

  audio.load();

  const savedMuteState = localStorage.getItem('audioMuted');
  audio.muted = savedMuteState === 'true';
  muteIcon.src = audio.muted ? 'mute.png' : 'unmuted.png';
  muteStatus.textContent = audio.muted ? 'ЗАГЛУШЕН' : 'играјќи ја „POV: Стъпваш във скопие" од Најџел Фараж';
  muteButton.style.display = 'flex';

  muteButton.addEventListener('click', function(e) {
    e.stopPropagation();
    audio.muted = !audio.muted;
    muteIcon.src = audio.muted ? 'mute.png' : 'unmuted.png';
    muteStatus.textContent = audio.muted ? 'ЗАГЛУШЕН' : 'играјќи ја „POV: Стъпваш във скопие" од Најџел Фараж';
    localStorage.setItem('audioMuted', audio.muted);
    
    if (!audio.muted) {
      audio.play().catch(e => console.log("Playback failed:", e));
    }
    
    console.log("насра йд г на", audio.muted);
  });
  
  try {
    if (!audio.muted) {
      audio.play().catch(e => console.log("Initial playback failed:", e));
    }
  } catch (error) {
    console.log("има еррор", error);
  }
});

document.getElementById('reset-button').addEventListener('click', function() {
    if (confirm('ДАЛИ СИ СИГУРЕН? ЌЕ ГИ ИЗГУБИШ СИТЕ ПАРИ И НАДГРАДБИ!')) {
        localStorage.removeItem('levMinerSave');
        localStorage.removeItem('audioMuted');
        
        game.levs = 0;
        game.levsPerClick = 1;
        game.levsPerSecond = 0;
        game.totalLevsMined = 0;
        game.clickCount = 0;
        game.lastSave = Date.now();
        
        game.upgrades.forEach(upgrade => {
            upgrade.level = 0;
        });
        
        game.achievements.forEach(achievement => {
            achievement.unlocked = false;
        });
        
        const audio = document.getElementById('bgMusic');
        audio.muted = false;
        document.getElementById('muteIcon').src = 'unmuted.png';
        document.getElementById('muteStatus').textContent = 'играјќи ја „POV: Стъпваш във скопие" од Најџел Фараж';
        
        updateDisplay();
        renderUpgrades();
        renderAchievements();
        renderInventory();
        
        showNotification('ПРОГРЕСОТ Е РЕСЕТИРАН! ПОЧНИ ПОВТОРНО!');
    }
});

const levCountElement = document.getElementById('lev-count');
const levsPerClickElement = document.getElementById('levs-per-click');
const levsPerSecondElement = document.getElementById('levs-per-second');
const mineButton = document.getElementById('mine-btn');
const upgradesList = document.getElementById('upgrades-list');
const achievementsGrid = document.getElementById('achievements-grid');
const inventoryGrid = document.getElementById('inventory-grid');
const notification = document.getElementById('notification');

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'мил';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'хил';
    } else {
        return Math.floor(num);
    }
}

function calculateUpgradeCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
}

function updateDisplay() {
    levCountElement.textContent = formatNumber(game.levs);
    levsPerClickElement.textContent = formatNumber(game.levsPerClick);
    levsPerSecondElement.textContent = formatNumber(game.levsPerSecond);
}

function renderUpgrades() {
    upgradesList.innerHTML = '';
    
    game.upgrades.forEach(upgrade => {
        const cost = calculateUpgradeCost(upgrade);
        const canAfford = game.levs >= cost;
        const isMaxed = upgrade.level >= upgrade.maxLevel;
        
        const upgradeElement = document.createElement('div');
        upgradeElement.className = `upgrade-item ${(!canAfford || isMaxed) ? 'disabled' : ''}`;
        
        let description = upgrade.description;
        if (isMaxed) {
            description = 'СТОП! доста веќе, дебелако';
        }
        
        upgradeElement.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-description">${description}</div>
            </div>
            <div class="upgrade-cost">${isMaxed ? 'МАКС' : formatNumber(cost) + ' лв.'}</div>
            <div class="upgrade-level">${upgrade.level}</div>
        `;
        
        if (!isMaxed) {
            upgradeElement.addEventListener('click', () => {
                if (game.levs >= cost) {
                    game.levs -= cost;
                    upgrade.level++;
                    
                    if (upgrade.id === 'farm' || upgrade.id === 'fabrika') {
                        game.levsPerClick = 1 + game.upgrades[0].effect(game.upgrades[0].level) + game.upgrades[3].effect(game.upgrades[3].level);
                    } else {
                        game.levsPerSecond = game.upgrades[1].effect(game.upgrades[1].level) + game.upgrades[2].effect(game.upgrades[2].level) + game.upgrades[4].effect(game.upgrades[4].level);
                    }
                    
                    updateDisplay();
                    renderUpgrades();
                    checkAchievements();
                    renderInventory();
                    saveGame();
                }
            });
        }
        
        upgradesList.appendChild(upgradeElement);
    });
}

function renderAchievements() {
    achievementsGrid.innerHTML = '';
    
    game.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
        
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;
        
        achievementsGrid.appendChild(achievementElement);
    });
}

function renderInventory() {
    inventoryGrid.innerHTML = '';
    
    const bigInventoryDiv = document.createElement('div');
    bigInventoryDiv.className = 'big-inventory-container';
    
    const inventoryTitle = document.createElement('h2');
    inventoryTitle.className = 'inventory-title';
    inventoryTitle.textContent = 'какво имаш? ПИЗДЕЦ, ТОЛЬКО ПИЗДЕЦ!!!!';
    bigInventoryDiv.appendChild(inventoryTitle);
    
    const inventoryContent = document.createElement('div');
    inventoryContent.className = 'inventory-content';
    
    game.upgrades.forEach(upgrade => {
        if (upgrade.level > 0) {
            const inventoryItem = document.createElement('div');
            inventoryItem.className = 'inventory-item';
            
            const maxPerRow = 10;
            const fullRows = Math.floor(upgrade.level / maxPerRow);
            const remainingEmojis = upgrade.level % maxPerRow;
            
            let emojiDisplay = '';
            for (let i = 0; i < fullRows; i++) {
                emojiDisplay += `<div class="emoji-row">${upgrade.emoji.repeat(maxPerRow)}</div>`;
            }
            if (remainingEmojis > 0) {
                emojiDisplay += `<div class="emoji-row">${upgrade.emoji.repeat(remainingEmojis)}</div>`;
            }
            
            inventoryItem.innerHTML = `
                <div class="inventory-text">
                    <div class="inventory-name">${upgrade.name}</div>
                    <div class="inventory-level">ниво: ${upgrade.level}</div>
                </div>
                <div class="inventory-emojis">
                    ${emojiDisplay}
                </div>
            `;
            
            inventoryContent.appendChild(inventoryItem);
        }
    });
    
    if (inventoryContent.children.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-inventory';
        emptyMessage.textContent = 'скъперник';
        inventoryContent.appendChild(emptyMessage);
    }
    
    bigInventoryDiv.appendChild(inventoryContent);
    inventoryGrid.appendChild(bigInventoryDiv);
}

function checkAchievements() {
    game.achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.check()) {
            achievement.unlocked = true;
            showNotification(`отклучено: ${achievement.name}`);
            renderAchievements();
        }
    });
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

mineButton.addEventListener('click', () => {
    const levsGained = game.levsPerClick;
    game.levs += levsGained;
    game.totalLevsMined += levsGained;
    game.clickCount++;
    
    const mineSound = document.getElementById('mineSound');
    mineSound.currentTime = 0;
    mineSound.play().catch(e => console.log("Mine sound playback failed:", e));

    const levFloat = document.createElement('div');
    levFloat.className = 'lev-float';
    levFloat.textContent = `+${formatNumber(levsGained)}`;
    
    const rect = mineButton.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
    const y = rect.top + rect.height / 2 + (Math.random() * 80 - 40);
    
    levFloat.style.left = `${x}px`;
    levFloat.style.top = `${y}px`;
    
    document.body.appendChild(levFloat);
    
    setTimeout(() => {
        document.body.removeChild(levFloat);
    }, 2000);
    
    updateDisplay();
    checkAchievements();
});

function produceLevsAutomatically() {
    if (game.levsPerSecond > 0) {
        const now = Date.now();
        const deltaTime = (now - game.lastSave) / 1000;
        const levsGained = game.levsPerSecond * deltaTime;
        
        game.levs += levsGained;
        game.totalLevsMined += levsGained;
        game.lastSave = now;
        
        updateDisplay();
        checkAchievements();
    }
}

function saveGame() {
    const saveData = {
        levs: game.levs,
        levsPerClick: game.levsPerClick,
        levsPerSecond: game.levsPerSecond,
        totalLevsMined: game.totalLevsMined,
        clickCount: game.clickCount,
        lastSave: Date.now(),
        upgrades: game.upgrades.map(upgrade => ({ id: upgrade.id, level: upgrade.level })),
        achievements: game.achievements.map(achievement => ({ id: achievement.id, unlocked: achievement.unlocked }))
    };
    
    localStorage.setItem('levMinerSave', JSON.stringify(saveData));
}

function loadGame() {
    const saveData = localStorage.getItem('levMinerSave');
    
    if (saveData) {
        const parsed = JSON.parse(saveData);
        
        game.levs = parsed.levs;
        game.levsPerClick = parsed.levsPerClick;
        game.levsPerSecond = parsed.levsPerSecond;
        game.totalLevsMined = parsed.totalLevsMined;
        game.clickCount = parsed.clickCount;
        
        if (parsed.upgrades) {
            parsed.upgrades.forEach(savedUpgrade => {
                const upgrade = game.upgrades.find(u => u.id === savedUpgrade.id);
                if (upgrade) {
                    upgrade.level = savedUpgrade.level;
                }
            });
        }
        
        if (parsed.achievements) {
            parsed.achievements.forEach(savedAchievement => {
                const achievement = game.achievements.find(a => a.id === savedAchievement.id);
                if (achievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
        
        game.levsPerClick = 1 + game.upgrades[0].effect(game.upgrades[0].level) + game.upgrades[3].effect(game.upgrades[3].level);
        game.levsPerSecond = game.upgrades[1].effect(game.upgrades[1].level) + game.upgrades[2].effect(game.upgrades[2].level) + game.upgrades[4].effect(game.upgrades[4].level);
        
        if (parsed.lastSave) {
            const now = Date.now();
            const offlineTime = (now - parsed.lastSave) / 1000;
            
            if (offlineTime > 5 && game.levsPerSecond > 0) {
                const offlineLevs = game.levsPerSecond * Math.min(offlineTime, 86400);
                game.levs += offlineLevs;
                game.totalLevsMined += offlineLevs;
                
                showNotification(`Честитки! Заработи ${formatNumber(offlineLevs)} лв додека бевте отсутни.`);
            }
        }
        
        game.lastSave = Date.now();
    }
}

function gameLoop() {
    produceLevsAutomatically();
    requestAnimationFrame(gameLoop);
}

function init() {
    loadGame();
    updateDisplay();
    renderUpgrades();
    renderAchievements();
    renderInventory();
    gameLoop();
    
    setInterval(saveGame, 30000);
}

init();