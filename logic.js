const foodForm = document.getElementById('foodForm');
const foodList = document.getElementById('foodList');
const recipeSuggestions = document.getElementById('recipeSuggestions');
const foodItemInput = document.getElementById('foodItem');

// Replace with your own Spoonacular API key
const SPOONACULAR_API_KEY = 'YOUR_API_KEY';
const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes/autocomplete';

let foodItems = [];

// Event listener for form submission
foodForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const foodItem = foodItemInput.value;
    const expirationDate = document.getElementById('expirationDate').value;

    const newFood = { item: foodItem, expirationDate };
    
    foodItems.push(newFood);
    
    updateFoodList();
    
    // Clear the input fields
    foodForm.reset();
});

// Update the food inventory list
function updateFoodList() {
    foodList.innerHTML = '';
    
    foodItems.forEach((food, index) => {
        const li = document.createElement('li');
        li.textContent = `${food.item} - Expires on ${food.expirationDate}`;
        
        // Check if the item is expired
        if (new Date(food.expirationDate) < new Date()) {
            li.style.color = 'red';
            li.textContent += ' (Expired)';
        }
        
        foodList.appendChild(li);
        
        // Suggest recipes based on the added food item
        suggestRecipes(food.item);
    });
}

// Suggest recipes based on the ingredient
async function suggestRecipes(ingredient) {
    try {
        const response = await fetch(`${SPOONACULAR_API_URL}?query=${ingredient}&number=5&apiKey=${SPOONACULAR_API_KEY}`);
        const data = await response.json();

        // Clear previous suggestions
        recipeSuggestions.innerHTML = '';

        if (data.length > 0) {
            data.forEach(recipe => {
                const p = document.createElement('p');
                p.textContent = `Try making ${recipe.title} with ${ingredient}!`;
                recipeSuggestions.appendChild(p);
            });
        } else {
            recipeSuggestions.innerHTML = `<p>No recipe suggestions found for ${ingredient}.</p>`;
        }
    } catch (error) {
        console.error('Error fetching recipe suggestions:', error);
        recipeSuggestions.innerHTML = `<p>Error fetching recipes. Please try again later.</p>`;
    }
}

// Autocomplete feature for food item input
foodItemInput.addEventListener('input', async function() {
    const query = this.value;

    if (query.length > 2) { // Trigger autocomplete after 3 characters
        try {
            const response = await fetch(`${SPOONACULAR_API_URL}?query=${query}&number=5&apiKey=${SPOONACULAR_API_KEY}`);
            const data = await response.json();

            // Clear previous suggestions in the dropdown or display area
            clearAutocomplete();

            if (data.length > 0) {
                data.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = item.title;
                    suggestionItem.classList.add('suggestion-item');
                    suggestionItem.onclick = () => {
                        foodItemInput.value = item.title; // Set input to selected suggestion
                        clearAutocomplete(); // Clear suggestions after selection
                    };
                    document.body.appendChild(suggestionItem); // Append to body or a specific container
                });
            }
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
        }
    }
});

// Function to clear autocomplete suggestions
function clearAutocomplete() {
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => item.remove());
}