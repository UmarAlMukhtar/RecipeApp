import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import QRCode from 'qrcode'
import { 
  FiClock, 
  FiUsers, 
  FiHeart, 
  FiBookmark, 
  FiShare2, 
  FiEye,
  FiX,
  FiDownload
} from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const RecipeDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchRecipe()
  }, [id])

  useEffect(() => {
    if (showQR) {
      generateQRCode()
    }
  }, [showQR])

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`)
      setRecipe(response.data)
      setIsLiked(response.data.isLiked || false)
      setIsSaved(response.data.isSaved || false)
      setLikeCount(response.data.likes?.length || 0)
    } catch (error) {
      console.error('Error fetching recipe:', error)
      toast.error('Recipe not found')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async () => {
    try {
      const url = window.location.href
      const qr = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCode(qr)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like recipes')
      return
    }

    try {
      const response = await api.post(`/recipes/${id}/like`)
      setIsLiked(response.data.isLiked)
      setLikeCount(response.data.likes)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to like recipe')
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save recipes')
      return
    }

    try {
      const response = await api.post(`/users/profile/save/${id}`)
      setIsSaved(response.data.isSaved)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to save recipe')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Recipe link copied to clipboard!')
      } catch (error) {
        setShowQR(true)
      }
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `${recipe.title}-qr-code.png`
    link.href = qrCode
    link.click()
  }

  if (loading) return <LoadingSpinner />

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Recipe not found
          </h2>
          <Link to="/recipes" className="btn-primary">
            Browse Recipes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={recipe.image?.url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1200&h=600&fit=crop'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="recipe-tag bg-white text-gray-900">
                  {recipe.cuisine}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  recipe.difficulty === 'Easy' 
                    ? 'bg-green-500 text-white'
                    : recipe.difficulty === 'Medium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {recipe.title}
              </h1>
              <p className="text-xl text-gray-200 mb-6 max-w-3xl">
                {recipe.description}
              </p>
              
              {/* Recipe Stats */}
              <div className="flex flex-wrap gap-6 text-white">
                <div className="flex items-center space-x-2">
                  <FiClock size={20} />
                  <span>{recipe.prepTime + recipe.cookTime} min total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers size={20} />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiEye size={20} />
                  <span>{recipe.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiHeart size={20} />
                  <span>{likeCount} likes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <FiHeart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSaved
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                }`}
              >
                <FiBookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiShare2 size={20} />
                <span>Share</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Instructions
              </h2>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {recipe.instructions}
                </ReactMarkdown>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/recipes?tags=${tag}`}
                      className="recipe-tag hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recipe by
              </h3>
              <button
                onClick={() => navigate(`/profile/${recipe.author._id}`)}
                className="flex items-center space-x-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {recipe.author?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {recipe.author?.username}
                  </h4>
                  {recipe.author?.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {recipe.author.bio}
                    </p>
                  )}
                </div>
              </button>
            </div>

            {/* Timing */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Timing
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Prep Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {recipe.prepTime} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cook Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {recipe.cookTime} min
                  </span>
                </div>
                <div className="flex justify-between border-t dark:border-gray-700 pt-3">
                  <span className="text-gray-600 dark:text-gray-400">Total Time:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white">
                      {ingredient.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Share Recipe
              </h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Scan this QR code to share the recipe
              </p>
              <button
                onClick={downloadQR}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <FiDownload size={16} />
                <span>Download QR Code</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default RecipeDetail
