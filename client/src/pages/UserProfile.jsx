import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiArrowLeft } from 'react-icons/fi'
import api from '../utils/api'
import RecipeCard from '../components/Recipe/RecipeCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      const recipesResponse = await api.get(`/users/${userId}/recipes`)
      setRecipes(recipesResponse.data || [])
      
      if (recipesResponse.data && recipesResponse.data.length > 0) {
        setUser(recipesResponse.data[0].author)
      } else {
        setUser({ username: 'User', bio: 'This user has not added a bio yet.' })
        toast.info('This user has not shared any recipes yet')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast.error('Failed to load user profile')
      setRecipes([])
      setUser({ username: 'User', bio: '' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/recipes"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors"
        >
          <FiArrowLeft size={20} />
          <span>Back to Recipes</span>
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {user?.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user?.bio || 'This user has not added a bio yet.'}
              </p>
              <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <FiUser size={16} />
                  <span>{recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User's Recipes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recipes by {user?.username}
          </h2>
          
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <FiUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No recipes shared yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This user hasn't shared any recipes with the community yet.
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
