import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiMinus, FiImage, FiUpload } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const SubmitRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    difficulty: 'Easy',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: '',
    tags: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  const cuisines = [
    'Italian', 'American', 'Mediterranean', 'Asian', 'Mexican', 
    'Indian', 'French', 'Healthy', 'Chinese', 'Japanese', 'Thai', 'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({
          ...formData,
          image: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: '', unit: '' }]
    })
  }

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      ingredients: newIngredients
    })
  }

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index][field] = value
    setFormData({
      ...formData,
      ingredients: newIngredients
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)

      // Filter out empty ingredients
      const ingredients = formData.ingredients.filter(
        ing => ing.name.trim() && ing.amount.trim()
      )

      if (ingredients.length === 0) {
        toast.error('Please add at least one ingredient')
        setLoading(false)
        return
      }

      const recipeData = {
        title: formData.title,
        description: formData.description,
        cuisine: formData.cuisine,
        difficulty: formData.difficulty,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        ingredients,
        instructions: formData.instructions,
        tags,
        image: formData.image
      }

      const response = await api.post('/recipes', recipeData)
      
      toast.success('Recipe submitted successfully!')
      
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('profileCache')
      }
      
      navigate(`/recipe/${response.data.recipe._id}`)
    } catch (error) {
      console.error('Submit recipe error:', error)
      toast.error(error.response?.data?.message || 'Failed to submit recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Share Your Recipe
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Help others discover amazing dishes by sharing your culinary creations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Recipe Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="form-label">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter an appetizing title for your recipe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Brief description of your recipe"
                  />
                </div>

                <div>
                  <label htmlFor="cuisine" className="form-label">
                    Cuisine Type *
                  </label>
                  <select
                    id="cuisine"
                    name="cuisine"
                    required
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select cuisine type</option>
                    {cuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="form-label">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prepTime" className="form-label">
                    Prep Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="prepTime"
                    name="prepTime"
                    required
                    min="1"
                    value={formData.prepTime}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label htmlFor="cookTime" className="form-label">
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="cookTime"
                    name="cookTime"
                    required
                    min="1"
                    value={formData.cookTime}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label htmlFor="servings" className="form-label">
                    Servings *
                  </label>
                  <input
                    type="number"
                    id="servings"
                    name="servings"
                    required
                    min="1"
                    value={formData.servings}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="vegetarian, quick, healthy (comma separated)"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Separate tags with commas
                  </p>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Recipe Image
              </h2>

              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        setFormData({ ...formData, image: null })
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiMinus size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Upload a photo of your dish
                        </span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                        <span className="btn-secondary mt-4 inline-flex items-center space-x-2">
                          <FiUpload size={16} />
                          <span>Choose Image</span>
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Ingredients
                </h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiPlus size={16} />
                  <span>Add Ingredient</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="form-label">Ingredient Name</label>
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="e.g., All-purpose flour"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Amount</label>
                      <input
                        type="text"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                        className="form-input"
                        placeholder="2"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="form-label">Unit</label>
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                          className="form-input"
                          placeholder="cups"
                        />
                      </div>
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="self-end p-3 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiMinus size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Instructions
              </h2>
              <div>
                <label htmlFor="instructions" className="form-label">
                  Cooking Instructions *
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={10}
                  required
                  value={formData.instructions}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Write step-by-step instructions. You can use Markdown formatting:

# Main Steps
1. **Preheat oven** to 350°F
2. **Mix ingredients** in a large bowl
3. **Bake for 25-30 minutes** until golden brown

## Tips:
- Make sure all ingredients are at room temperature
- Don't overmix the batter"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You can use Markdown formatting for better presentation (headers, bold text, lists, etc.)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="spinner border-white"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    <span>Publish Recipe</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default SubmitRecipe
