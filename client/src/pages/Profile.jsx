import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit3, FiHeart, FiBookmark, FiUser, FiPlus, FiMoreVertical, FiTrash2, FiEdit } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import RecipeCard from '../components/Recipe/RecipeCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('my-recipes')
  const [myRecipes, setMyRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    bio: user?.bio || ''
  })
  const [dropdownOpen, setDropdownOpen] = useState({})

  const tabs = [
    { id: 'my-recipes', label: 'My Recipes', icon: FiUser },
    { id: 'saved', label: 'Saved Recipes', icon: FiBookmark }
  ]

  useEffect(() => {
    fetchUserData()
  }, [user?._id])

  // Add effect to refetch data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?._id) {
        fetchUserData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also refetch when component mounts
    if (user?._id) {
      fetchUserData()
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchUserData = async () => {
    if (!user?._id) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      console.log('Fetching data for user ID:', user._id);
      console.log('Full user object:', user);
      
      // Use the same endpoint that works for other users
      try {
        const myRecipesResponse = await api.get(`/users/${user._id}/recipes`)
        console.log('My recipes API response:', myRecipesResponse.data);
        setMyRecipes(myRecipesResponse.data || [])
      } catch (error) {
        console.error('Error fetching my recipes:', error);
        console.log('Error details:', error.response?.data);
        
        // Fallback: try to get recipes from general endpoint
        try {
          console.log('Trying fallback method for my recipes...');
          const allRecipesResponse = await api.get('/recipes?limit=100')
          console.log('All recipes response:', allRecipesResponse.data);
          
          const userRecipes = allRecipesResponse.data.recipes?.filter(recipe => {
            const authorId = recipe.author?._id || recipe.author
            const userId = user._id || user.id
            const matches = authorId === userId
            console.log(`Recipe "${recipe.title}" author: ${authorId}, user: ${userId}, matches: ${matches}`);
            return matches
          }) || []
          
          console.log('Filtered user recipes:', userRecipes);
          setMyRecipes(userRecipes)
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setMyRecipes([])
        }
      }

      // Fetch saved recipes
      try {
        const savedRecipesResponse = await api.get('/users/profile/saved')
        console.log('Saved recipes response:', savedRecipesResponse.data);
        setSavedRecipes(savedRecipesResponse.data || [])
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        setSavedRecipes([])
      }

    } catch (error) {
      console.error('Error in fetchUserData:', error)
      toast.error('Failed to load profile data')
      setMyRecipes([])
      setSavedRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put('/users/profile', profileData)
      updateUser(response.data.user)
      setEditMode(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/recipes/${recipeId}`)
      setMyRecipes(prev => prev.filter(recipe => recipe._id !== recipeId))
      toast.success('Recipe deleted successfully!')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      toast.error('Failed to delete recipe')
    }
  }

  const toggleDropdown = (recipeId) => {
    setDropdownOpen(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="form-input max-w-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="form-input max-w-md"
                      placeholder="Tell us about yourself and your cooking style..."
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false)
                        setProfileData({
                          username: user?.username || '',
                          bio: user?.bio || ''
                        })
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.username}
                    </h1>
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      <FiEdit3 size={20} />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {user?.bio || 'No bio added yet. Click the edit button to add one!'}
                  </p>
                  <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FiUser size={16} />
                      <span>{myRecipes.length} Recipes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiHeart size={16} />
                      <span>{savedRecipes.length} Saved</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              to="/submit"
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus size={16} />
              <span>Add Recipe</span>
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {id === 'my-recipes' ? myRecipes.length : savedRecipes.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'my-recipes' && (
            <div>
              {myRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <FiUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No recipes yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start sharing your favorite recipes with the community
                  </p>
                  <Link to="/submit" className="btn-primary">
                    Submit Your First Recipe
                  </Link>
                </div>
              ) : (
                <div className="recipe-grid">
                  {myRecipes.map((recipe) => (
                    <div key={recipe._id} className="relative">
                      <RecipeCard recipe={recipe} />
                      
                      {/* Recipe Actions Dropdown */}
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          onClick={() => toggleDropdown(recipe._id)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiMoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        {dropdownOpen[recipe._id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700 z-20">
                            <Link
                              to={`/edit-recipe/${recipe._id}`}
                              onClick={() => setDropdownOpen({})}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FiEdit className="mr-2" size={16} />
                              Edit Recipe
                            </Link>
                            <button
                              onClick={() => {
                                handleDeleteRecipe(recipe._id)
                                setDropdownOpen({})
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <FiTrash2 className="mr-2" size={16} />
                              Delete Recipe
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              {savedRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <FiBookmark className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No saved recipes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start saving recipes you love to cook them later
                  </p>
                  <Link to="/recipes" className="btn-primary">
                    Discover Recipes
                  </Link>
                </div>
              ) : (
                <div className="recipe-grid">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
