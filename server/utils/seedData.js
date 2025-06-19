const User = require("../models/User");
const Recipe = require("../models/Recipe");

const seedData = async () => {
  try {
    // Check if we can connect to the database first
    const userCount = await User.countDocuments();
    const recipeCount = await Recipe.countDocuments();

    if (userCount > 0 || recipeCount > 0) {
      console.log("📊 Database already has data, skipping seed");
      return;
    }

    console.log("🌱 Seeding database with sample data...");

    // Create sample users
    const users = await User.create([
      {
        username: "chefmario",
        email: "mario@example.com",
        password: "password123",
        bio: "Italian cuisine enthusiast and professional chef with 15+ years experience.",
      },
      {
        username: "bakingbella",
        email: "bella@example.com",
        password: "password123",
        bio: "Pastry chef and baking instructor. Love creating sweet treats!",
      },
      {
        username: "healthyhelen",
        email: "helen@example.com",
        password: "password123",
        bio: "Nutritionist and healthy cooking advocate. Making healthy food delicious!",
      },
    ]);

    // Create sample recipes
    const recipes = [
      {
        title: "Classic Spaghetti Carbonara",
        description:
          "A traditional Italian pasta dish with eggs, cheese, and pancetta.",
        ingredients: [
          { name: "Spaghetti", amount: "400", unit: "g" },
          { name: "Pancetta", amount: "200", unit: "g" },
          { name: "Eggs", amount: "3", unit: "large" },
          { name: "Parmesan cheese", amount: "100", unit: "g" },
          { name: "Black pepper", amount: "1", unit: "tsp" },
        ],
        instructions: `# Classic Spaghetti Carbonara

## Steps:
1. **Prepare the ingredients** - Grate the Parmesan cheese and crack the eggs into a bowl
2. **Cook the pasta** - Boil salted water and cook spaghetti until al dente
3. **Cook the pancetta** - Fry pancetta until crispy
4. **Mix everything** - Combine hot pasta with egg mixture and pancetta
5. **Serve immediately** - Garnish with extra cheese and black pepper`,
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        difficulty: "Medium",
        cuisine: "Italian",
        tags: ["pasta", "italian", "quick", "traditional"],
        author: users[0]._id,
        image: {
          url: "https://images.unsplash.com/photo-1588013273468-315900bafd4c?w=800&h=600&fit=crop",
        },
      },
      {
        title: "Chocolate Chip Cookies",
        description:
          "Soft and chewy chocolate chip cookies that everyone will love.",
        ingredients: [
          { name: "All-purpose flour", amount: "2¼", unit: "cups" },
          { name: "Butter", amount: "1", unit: "cup" },
          { name: "Brown sugar", amount: "¾", unit: "cup" },
          { name: "White sugar", amount: "¾", unit: "cup" },
          { name: "Eggs", amount: "2", unit: "large" },
          { name: "Vanilla extract", amount: "2", unit: "tsp" },
          { name: "Chocolate chips", amount: "2", unit: "cups" },
        ],
        instructions: `# Perfect Chocolate Chip Cookies

## Instructions:
1. **Preheat oven** to 375°F (190°C)
2. **Mix dry ingredients** - Combine flour, baking soda, and salt
3. **Cream butter and sugars** until light and fluffy
4. **Add eggs and vanilla** - Mix until combined
5. **Add dry ingredients** gradually
6. **Fold in chocolate chips**
7. **Bake for 9-11 minutes** until golden brown`,
        prepTime: 20,
        cookTime: 11,
        servings: 24,
        difficulty: "Easy",
        cuisine: "American",
        tags: ["dessert", "cookies", "chocolate", "baking", "sweet"],
        author: users[1]._id,
        image: {
          url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop",
        },
      },
      {
        title: "Quinoa Buddha Bowl",
        description:
          "A nutritious and colorful bowl packed with quinoa, vegetables, and tahini dressing.",
        ingredients: [
          { name: "Quinoa", amount: "1", unit: "cup" },
          { name: "Sweet potato", amount: "1", unit: "large" },
          { name: "Chickpeas", amount: "1", unit: "can" },
          { name: "Kale", amount: "2", unit: "cups" },
          { name: "Avocado", amount: "1", unit: "medium" },
          { name: "Tahini", amount: "3", unit: "tbsp" },
          { name: "Lemon juice", amount: "2", unit: "tbsp" },
        ],
        instructions: `# Nutritious Quinoa Buddha Bowl

## Preparation:
1. **Cook quinoa** according to package instructions
2. **Roast sweet potato** - Cube and roast at 400°F for 25 minutes
3. **Prepare chickpeas** - Drain, rinse, and season
4. **Make dressing** - Whisk tahini, lemon juice, and water
5. **Massage kale** with a little olive oil
6. **Assemble bowl** - Layer quinoa, vegetables, and avocado
7. **Drizzle with dressing** and enjoy!`,
        prepTime: 20,
        cookTime: 30,
        servings: 2,
        difficulty: "Easy",
        cuisine: "Mediterranean",
        tags: [
          "healthy",
          "vegan",
          "quinoa",
          "bowl",
          "nutritious",
          "vegetarian",
        ],
        author: users[2]._id,
        image: {
          url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
        },
      },
      {
        title: "Homemade Pizza Margherita",
        description:
          "Classic Italian pizza with fresh basil, mozzarella, and tomato sauce.",
        ingredients: [
          { name: "Pizza dough", amount: "1", unit: "ball" },
          { name: "Tomato sauce", amount: "½", unit: "cup" },
          { name: "Fresh mozzarella", amount: "8", unit: "oz" },
          { name: "Fresh basil", amount: "¼", unit: "cup" },
          { name: "Olive oil", amount: "2", unit: "tbsp" },
          { name: "Salt", amount: "1", unit: "tsp" },
        ],
        instructions: `# Authentic Pizza Margherita

## Steps:
1. **Preheat oven** to 500°F (260°C) with pizza stone
2. **Roll out dough** on floured surface
3. **Add sauce** - Spread evenly leaving border for crust
4. **Add cheese** - Tear mozzarella into chunks
5. **Bake for 10-12 minutes** until crust is golden
6. **Add fresh basil** and drizzle with olive oil
7. **Slice and serve** immediately`,
        prepTime: 30,
        cookTime: 12,
        servings: 2,
        difficulty: "Medium",
        cuisine: "Italian",
        tags: ["pizza", "italian", "margherita", "cheese", "basil"],
        author: users[0]._id,
        image: {
          url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        },
      },
      {
        title: "Green Smoothie Bowl",
        description:
          "A refreshing and nutritious smoothie bowl topped with fresh fruits and granola.",
        ingredients: [
          { name: "Frozen spinach", amount: "1", unit: "cup" },
          { name: "Frozen banana", amount: "1", unit: "large" },
          { name: "Frozen mango", amount: "½", unit: "cup" },
          { name: "Coconut milk", amount: "½", unit: "cup" },
          { name: "Granola", amount: "¼", unit: "cup" },
          { name: "Fresh berries", amount: "½", unit: "cup" },
          { name: "Chia seeds", amount: "1", unit: "tbsp" },
        ],
        instructions: `# Energizing Green Smoothie Bowl

## Instructions:
1. **Blend frozen ingredients** - Spinach, banana, mango, and coconut milk
2. **Blend until smooth** - Add more liquid if needed
3. **Pour into bowl** - Should be thick like soft-serve ice cream
4. **Add toppings** - Arrange granola, berries, and chia seeds
5. **Serve immediately** with a spoon and enjoy!`,
        prepTime: 10,
        cookTime: 1,
        servings: 1,
        difficulty: "Easy",
        cuisine: "Healthy",
        tags: [
          "smoothie",
          "healthy",
          "breakfast",
          "vegan",
          "green",
          "nutritious",
        ],
        author: users[2]._id,
        image: {
          url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=600&fit=crop",
        },
      },
    ];

    await Recipe.create(recipes);

    console.log("✅ Sample data seeded successfully!");
    console.log("📝 Sample users created:");
    users.forEach((user) => {
      console.log(`   - ${user.username} (${user.email})`);
    });
    console.log(`🍽️  Sample recipes created: ${recipes.length}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
  }
};

// Only run seed if this file is executed directly
if (require.main === module) {
  const mongoose = require("mongoose");
  require("dotenv").config();

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB for seeding");
      return seedData();
    })
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = seedData;
