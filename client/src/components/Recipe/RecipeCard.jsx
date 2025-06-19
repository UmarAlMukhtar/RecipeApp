import { Link } from 'react-router-dom'
import { FiClock, FiUsers, FiHeart, FiBookmark } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useState } from 'react'

const RecipeCard = ({ recipe }) => {
  const { isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(recipe.isLiked || false)
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false)
  const [likeCount, setLikeCount] = useState(recipe.likes?.length || 0)

  const handleLike = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to like recipes')
      return
    }

    try {
      const response = await api.post(`/recipes/${recipe._id}/like`)
      setIsLiked(response.data.isLiked)
      setLikeCount(response.data.likes)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to like recipe')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to save recipes')
      return
    }

    try {
      const response = await api.post(`/users/profile/save/${recipe._id}`)
      setIsSaved(response.data.isSaved)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to save recipe')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="recipe-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <Link to={`/recipe/${recipe._id}`}>
        <div className="relative">
          <img
            src={recipe.image?.url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop'}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="recipe-tag">
              {recipe.cuisine}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-red-50'
              }`}
            >
              <FiHeart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleSave}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isSaved 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-orange-50'
              }`}
            >
              <FiBookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FiClock size={16} />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiUsers size={16} />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <FiHeart size={16} />
              <span>{likeCount}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {recipe.author?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {recipe.author?.username}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              recipe.difficulty === 'Easy' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : recipe.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RecipeCard
