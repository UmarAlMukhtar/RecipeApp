import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiX, FiSearch, FiCoffee } from 'react-icons/fi'
import api from '../../utils/api'
import RecipeCard from './RecipeCard'
import toast from 'react-hot-toast'

const IngredientSuggestion = () => {
  const [ingredients, setIngredients] = useState([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient('')
    }
  }

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  const getSuggestions = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/recipes/suggest', { ingredients })
      setSuggestions(response.data.suggestions)
      if (response.data.suggestions.length === 0) {
        toast.info('No recipes found with those ingredients. Try different ones!')
      } else {
        toast.success(`Found ${response.data.suggestions.length} recipe suggestions!`)
      }
    } catch (error) {
      toast.error('Failed to get recipe suggestions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6"
          >
            <FiCoffee className="text-white" size={32} />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            AI Recipe Suggestions
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Got ingredients but no idea what to cook? Let our AI suggest perfect recipes for you!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Ingredient Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              What ingredients do you have?
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter an ingredient (e.g., chicken, tomatoes, garlic)"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="form-input"
                />
              </div>
              <button
                onClick={addIngredient}
                disabled={!currentIngredient.trim()}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <FiPlus size={20} />
                <span>Add</span>
              </button>
            </div>

            {/* Ingredients List */}
            {ingredients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Your Ingredients:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-2 rounded-full"
                    >
                      <span>{ingredient}</span>
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                      >
                        <FiX size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={getSuggestions}
              disabled={ingredients.length === 0 || loading}
              className="btn-primary w-full sm:w-auto disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="spinner border-white"></div>
                  <span>Finding Recipes...</span>
                </>
              ) : (
                <>
                  <FiSearch size={20} />
                  <span>Get Recipe Suggestions</span>
                </>
              )}
            </button>
          </div>

          {/* Recipe Suggestions */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Recipe Suggestions for You
              </h3>
              <div className="recipe-grid">
                {suggestions.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default IngredientSuggestion
