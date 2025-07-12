// Diet Plan Data
const dietPlan = [
    {
        id: 'breakfast',
        time: '9:00 AM',
        name: 'Breakfast',
        description: '3 Boiled Eggs + 1 Banana + 1 Scoop Whey',
        protein: 42,
        carbs: 27,
        fat: 14,
        calories: 400,
        cost: 53,
        completed: false
    },
    {
        id: 'mid-morning',
        time: '11:30 AM',
        name: 'Mid-Morning Snack',
        description: '50g Roasted Chana + 1 Seasonal Fruit (Banana/Apple)',
        protein: 10,
        carbs: 35,
        fat: 3,
        calories: 200,
        cost: 12,
        completed: false
    },
    {
        id: 'lunch',
        time: '1:30 PM',
        name: 'Lunch (Ghar ka khana)',
        description: '1.5 Cup Dal + 3 Roti + 1 Cup Sabzi',
        protein: 25,
        carbs: 75,
        fat: 10,
        calories: 550,
        cost: 25,
        completed: false
    },
    {
        id: 'pre-workout',
        time: '4:30 PM',
        name: 'Pre-Workout',
        description: '150g Boiled Kala Chana Chaat (onion, lemon, masala)',
        protein: 15,
        carbs: 40,
        fat: 2,
        calories: 260,
        cost: 10,
        completed: false
    },
    {
        id: 'post-workout',
        time: '7:30 PM',
        name: 'Post-Workout/Dinner',
        description: '3 Boiled Eggs + 50g Soya Curry + 2 Roti + 200g Curd',
        protein: 40,
        carbs: 40,
        fat: 12,
        calories: 550,
        cost: 30,
        completed: false
    },
    {
        id: 'night-meal',
        time: '9:30 PM',
        name: 'Night Meal',
        description: '50g Roasted Chana + 5 Soaked Almonds',
        protein: 10,
        carbs: 28,
        fat: 6,
        calories: 220,
        cost: 10,
        completed: false
    }
];

// App State
let currentProgress = {
    calories: 0,
    protein: 0,
    cost: 0
};

// Editable title logic
function setupEditableTitle() {
    const titleText = document.getElementById('diet-title-text');
    const editBtn = document.getElementById('edit-title-btn');
    const editInput = document.getElementById('edit-title-input');
    const LS_KEY = 'dietAppTitle';

    // Load from localStorage
    const savedTitle = localStorage.getItem(LS_KEY);
    if (savedTitle) {
        titleText.textContent = savedTitle;
    }

    editBtn.addEventListener('click', function(e) {
        editInput.value = titleText.textContent;
        titleText.style.display = 'none';
        editBtn.style.display = 'none';
        editInput.style.display = 'inline-block';
        editInput.focus();
        editInput.select();
    });

    function saveTitle() {
        const newTitle = editInput.value.trim() || 'Sr Daya Diet Plan';
        titleText.textContent = newTitle;
        localStorage.setItem(LS_KEY, newTitle);
        editInput.style.display = 'none';
        titleText.style.display = 'inline';
        editBtn.style.display = 'inline-block';
    }

    editInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveTitle();
        } else if (e.key === 'Escape') {
            editInput.style.display = 'none';
            titleText.style.display = 'inline';
            editBtn.style.display = 'inline-block';
        }
    });
    editInput.addEventListener('blur', saveTitle);
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    renderMeals();
    updateProgressDisplay();
    handleStickyProgressCard();
    setupEditableTitle();
});

// Load progress from localStorage
function loadProgress() {
    const today = new Date().toDateString();
    const savedProgress = localStorage.getItem(`dietProgress_${today}`);
    
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentProgress = progress.progress;
        
        // Update meal completion status
        dietPlan.forEach(meal => {
            meal.completed = progress.meals[meal.id] || false;
        });
    } else {
        // Reset for new day
        resetProgress();
    }
}

// Save progress to localStorage
function saveProgress() {
    const today = new Date().toDateString();
    const meals = {};
    dietPlan.forEach(meal => {
        meals[meal.id] = meal.completed;
    });
    
    const progressData = {
        progress: currentProgress,
        meals: meals,
        date: today
    };
    
    localStorage.setItem(`dietProgress_${today}`, JSON.stringify(progressData));
}

// Render meals
function renderMeals() {
    const container = document.getElementById('meals-container');
    container.innerHTML = '';
    
    dietPlan.forEach(meal => {
        const mealCard = createMealCard(meal);
        container.appendChild(mealCard);
    });
}

// Create meal card element
function createMealCard(meal) {
    const card = document.createElement('div');
    card.className = `meal-card ${meal.completed ? 'completed' : ''}`;
    card.id = `meal-${meal.id}`;
    
    card.innerHTML = `
        <div class="meal-header">
            <div class="meal-time">
                <i class="fas fa-clock"></i>
                <span>${meal.time}</span>
            </div>
            <button class="complete-btn ${meal.completed ? 'completed' : ''}" 
                    onclick="toggleMeal('${meal.id}')">
                <i class="fas ${meal.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                ${meal.completed ? 'Completed' : 'Mark Complete'}
            </button>
        </div>
        
        <div class="meal-name">${meal.name}</div>
        <div class="meal-description">${meal.description}</div>
        
        <div class="macros-grid">
            <div class="macro-item protein">
                <i class="fas fa-dumbbell"></i>
                <div class="macro-label">Protein</div>
                <div class="macro-value">${meal.protein}g</div>
            </div>
            <div class="macro-item carbs">
                <i class="fas fa-bread-slice"></i>
                <div class="macro-label">Carbs</div>
                <div class="macro-value">${meal.carbs}g</div>
            </div>
            <div class="macro-item fat">
                <i class="fas fa-fire"></i>
                <div class="macro-label">Fat</div>
                <div class="macro-value">${meal.fat}g</div>
            </div>
        </div>
        
        <div class="meal-footer">
            <div class="meal-cost">
                <i class="fas fa-rupee-sign"></i>
                <span>₹${meal.cost}</span>
            </div>
            <div class="meal-calories">
                <i class="fas fa-fire"></i>
                <span>${meal.calories} kcal</span>
            </div>
        </div>
    `;
    
    return card;
}

// Toggle meal completion
function toggleMeal(mealId) {
    const meal = dietPlan.find(m => m.id === mealId);
    if (!meal) return;
    
    meal.completed = !meal.completed;
    
    if (meal.completed) {
        // Add to progress
        currentProgress.calories += meal.calories;
        currentProgress.protein += meal.protein;
        currentProgress.cost += meal.cost;
    } else {
        // Subtract from progress
        currentProgress.calories -= meal.calories;
        currentProgress.protein -= meal.protein;
        currentProgress.cost -= meal.cost;
    }
    
    // Ensure values don't go below 0
    currentProgress.calories = Math.max(0, currentProgress.calories);
    currentProgress.protein = Math.max(0, currentProgress.protein);
    currentProgress.cost = Math.max(0, currentProgress.cost);
    
    // Update UI
    updateMealCard(mealId);
    updateProgressDisplay();
    saveProgress();
}

// Update meal card appearance
function updateMealCard(mealId) {
    const meal = dietPlan.find(m => m.id === mealId);
    const card = document.getElementById(`meal-${mealId}`);
    const button = card.querySelector('.complete-btn');
    const icon = button.querySelector('i');
    
    if (meal.completed) {
        card.classList.add('completed');
        button.classList.add('completed');
        button.innerHTML = '<i class="fas fa-check-circle"></i>Completed';
    } else {
        card.classList.remove('completed');
        button.classList.remove('completed');
        button.innerHTML = '<i class="fas fa-circle"></i>Mark Complete';
    }
}

// Update progress display
function updateProgressDisplay() {
    const caloriesProgress = document.getElementById('calories-progress');
    const proteinProgress = document.getElementById('protein-progress');
    const costProgress = document.getElementById('cost-progress');
    
    const caloriesCurrent = document.getElementById('calories-current');
    const proteinCurrent = document.getElementById('protein-current');
    const costCurrent = document.getElementById('cost-current');
    
    // Calculate percentages
    const caloriesPercent = Math.min((currentProgress.calories / 2250) * 100, 100);
    const proteinPercent = Math.min((currentProgress.protein / 130) * 100, 100);
    const costPercent = Math.min((currentProgress.cost / 190) * 100, 100);
    
    // Update progress bars
    caloriesProgress.style.width = `${caloriesPercent}%`;
    proteinProgress.style.width = `${proteinPercent}%`;
    costProgress.style.width = `${costPercent}%`;
    
    // Update text
    caloriesCurrent.textContent = Math.round(currentProgress.calories);
    proteinCurrent.textContent = Math.round(currentProgress.protein);
    costCurrent.textContent = `₹${Math.round(currentProgress.cost)}`;
    
    // Add color coding for progress
    if (caloriesPercent >= 100) {
        caloriesProgress.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
    }
    if (proteinPercent >= 100) {
        proteinProgress.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
    }
    if (costPercent >= 100) {
        costProgress.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a24)';
    }
}

// Reset progress for new day
function resetProgress() {
    currentProgress = {
        calories: 0,
        protein: 0,
        cost: 0
    };
    
    dietPlan.forEach(meal => {
        meal.completed = false;
    });
    
    renderMeals();
    updateProgressDisplay();
    saveProgress();
    
    // Show success message
    showNotification('Day reset successfully!', 'success');
}

// Toggle notes modal
function toggleNotes() {
    const modal = document.getElementById('notes-modal');
    modal.classList.toggle('show');
    
    // Close modal when clicking outside
    if (modal.classList.contains('show')) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                toggleNotes();
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('notes-modal');
        if (modal.classList.contains('show')) {
            toggleNotes();
        }
    }
    
    // Number keys 1-6 to toggle meals
    if (e.key >= '1' && e.key <= '6') {
        const mealIndex = parseInt(e.key) - 1;
        if (mealIndex < dietPlan.length) {
            toggleMeal(dietPlan[mealIndex].id);
        }
    }
});

// Add swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - could be used for next day
            console.log('Swiped left');
        } else {
            // Swipe right - could be used for previous day
            console.log('Swiped right');
        }
    }
}

// Auto-save progress every 30 seconds
setInterval(saveProgress, 30000);

// Check if it's a new day and reset if needed
function checkNewDay() {
    const today = new Date().toDateString();
    const lastSaved = localStorage.getItem('lastSavedDate');
    
    if (lastSaved && lastSaved !== today) {
        // It's a new day, reset progress
        resetProgress();
        localStorage.setItem('lastSavedDate', today);
    }
}

// Check for new day on app load
checkNewDay(); 

// Add stuck class to progress card when sticky
function handleStickyProgressCard() {
    const progressSection = document.querySelector('.progress-section');
    const progressCard = document.querySelector('.progress-card');
    const appContainer = document.querySelector('.app-container');
    if (!progressSection || !progressCard || !appContainer) return;

    // Create placeholder if not exists
    let placeholder = progressCard.nextElementSibling;
    if (!placeholder || !placeholder.classList.contains('progress-placeholder')) {
        placeholder = document.createElement('div');
        placeholder.className = 'progress-placeholder';
        progressCard.parentNode.insertBefore(placeholder, progressCard.nextSibling);
    }

    function setPlaceholderHeight() {
        const cardHeight = progressCard.offsetHeight;
        placeholder.style.setProperty('--progress-card-height', cardHeight + 'px');
    }

    setPlaceholderHeight();
    window.addEventListener('resize', setPlaceholderHeight);

    const observer = new window.IntersectionObserver(
        ([e]) => {
            if (e.intersectionRatio < 1) {
                progressCard.classList.add('stuck');
                progressSection.classList.add('stuck');
                appContainer.classList.add('stuck');
                setPlaceholderHeight();
            } else {
                progressCard.classList.remove('stuck');
                progressSection.classList.remove('stuck');
                appContainer.classList.remove('stuck');
                placeholder.style.setProperty('--progress-card-height', '0px');
            }
        },
        { threshold: [1] }
    );
    observer.observe(progressSection);
} 