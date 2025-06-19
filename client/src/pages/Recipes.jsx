import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiSearch, FiX } from 'react-icons/fi'
import api from '../utils/api'
import RecipeCard from '../components/Recipe/RecipeCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '')
  const [selectedTags, setSelectedTags] = useState(searchParams.get('tags')?.split(',') || [])
  const [maxTime, setMaxTime] = useState(searchParams.get('maxTime') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest')

  const cuisines = ['Italian', 'American', 'Mediterranean', 'Asian', 'Mexican', 'Indian', 'French', 'Healthy']
  const tags = ['vegetarian', 'vegan', 'gluten-free', 'quick', 'healthy', 'dessert', 'breakfast', 'dinner', 'lunch']
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' }
  ]

  useEffect(() => {
    fetchRecipes()
  }, [searchParams])

  const fetchRecipes = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCuisine) params.append('cuisine', selectedCuisine)
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))
      if (maxTime) params.append('maxTime', maxTime)
      if (sortBy) params.append('sort', sortBy)
      params.append('page', page)
      params.append('limit', 12)

      const response = await api.get(`/recipes?${params}`)
      
      if (page === 1) {
        setRecipes(response.data.recipes)
      } else {
        setRecipes(prev => [...prev, ...response.data.recipes])
      }
      
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.append('search', searchQuery)
    if (selectedCuisine) params.append('cuisine', selectedCuisine)
    if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))
    if (maxTime) params.append('maxTime', maxTime)
    if (sortBy) params.append('sort', sortBy)

    setSearchParams(params)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCuisine('')
    setSelectedTags([])
    setMaxTime('')
    setSortBy('latest')
    setSearchParams(new URLSearchParams())
  }

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchRecipes(pagination.page + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore our collection of delicious recipes from around the world
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search recipes, ingredients, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                className="form-input pl-12"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input lg:w-48"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FiFilter size={20} />
              <span>Filters</span>
            </button>

            <button onClick={applyFilters} className="btn-primary">
              Search
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cuisine Filter */}
                <div>
                  <label className="form-label">Cuisine</label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Cuisines</option>
                    {cuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Max Cook Time */}
                <div>
                  <label className="form-label">Max Total Time (minutes)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="form-label">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-2"
                >
                  <FiX size={16} />
                  <span>Clear Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        {loading && recipes.length === 0 ? (
          <LoadingSpinner />
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Found {pagination.total} recipes
              </p>
            </div>

            <div className="recipe-grid">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {pagination.page < pagination.pages && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <div className="spinner border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Recipes</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Recipes
