# RecipeShare - Recipe Sharing Website

A modern, full-stack recipe sharing platform built with React, Node.js, Express, and MongoDB. Share your favorite recipes, discover new dishes, and connect with food lovers around the world.

## 🌟 Features

### Core Features
- **User Authentication** - Secure registration and login with JWT
- **Recipe Management** - Create, edit, delete, and share recipes
- **Recipe Discovery** - Browse, search, and filter recipes
- **AI Recipe Suggestions** - Get recipe recommendations based on available ingredients
- **Social Features** - Like, save, and comment on recipes
- **User Profiles** - Manage your recipes and saved favorites

### Advanced Features
- **QR Code Sharing** - Generate QR codes for easy recipe sharing
- **Markdown Support** - Rich text formatting for recipe instructions
- **Image Upload** - Upload beautiful photos of your dishes
- **Dark/Light Mode** - Theme switching for better user experience
- **Responsive Design** - Works perfectly on all devices
- **Real-time Search** - Instant search with advanced filtering

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications
- **React Markdown** - Markdown rendering
- **QRCode** - QR code generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Express Validator** - Input validation

## 📁 Project Structure

```
RecipeApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── index.js            # Server entry point
│   └── package.json
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/RecipeApp.git
cd RecipeApp
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Add MongoDB URI, JWT secret, Cloudinary credentials
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipeapp
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### 5. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create cluster and get connection string
- Update MONGODB_URI in .env

### 6. Run the Application

**Development Mode:**
```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend development server
cd client
npm run dev
```

**Production Mode:**
```bash
# Build frontend
cd client
npm run build

# Start backend server
cd ../server
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Recipes
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/like` - Like/unlike recipe
- `POST /api/recipes/suggest` - Get AI recipe suggestions

### Users
- `GET /api/users/:id/recipes` - Get user's recipes
- `GET /api/users/profile/saved` - Get saved recipes
- `POST /api/users/profile/save/:recipeId` - Save/unsave recipe
- `PUT /api/users/profile` - Update user profile

## 🎨 Features in Detail

### AI Recipe Suggestions
Enter ingredients you have available, and our AI will suggest recipes you can make. The system uses intelligent matching to find recipes that best utilize your ingredients.

### QR Code Sharing
Every recipe has a unique QR code that can be generated and shared. Perfect for sharing recipes in person or at cooking events.

### Markdown Support
Write recipe instructions with rich formatting using Markdown syntax. Support for headers, lists, bold text, and more.

### Advanced Search & Filtering
- Search by recipe name, ingredients, or description
- Filter by cuisine type, difficulty level, cooking time
- Sort by popularity, date, or trending

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd server
# Deploy to your preferred platform
```

### Environment Variables for Production
Update your environment variables for production:
- Use production MongoDB URI
- Set strong JWT secret
- Configure Cloudinary for production
- Set NODE_ENV=production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for food images
- [React Icons](https://react-icons.github.io/react-icons/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling
- [MongoDB](https://mongodb.com) for database

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Email: your.email@example.com

---

Made with ❤️ for food lovers everywhere
