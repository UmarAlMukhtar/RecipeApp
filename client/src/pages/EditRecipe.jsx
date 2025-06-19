import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiMinus, FiImage, FiUpload, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const EditRecipe = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const cuisines = [
    'Italian', 'American', 'Mediterranean', 'Asian', 'Mexican', 
    'Indian', 'French', 'Healthy', 'Chinese', 'Japanese', 'Thai', 'Other'
  ]

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`)
      const recipe = response.data
      
      // Check if user owns this recipe
      if (recipe.author._id !== user._id) {
        toast.error('You can only edit your own recipes')
        navigate('/profile')
        return
      }

      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime.toString(),
        cookTime: recipe.cookTime.toString(),
        servings: recipe.servings.toString(),
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags?.join(', ') || '',
        image: recipe.image?.url || null
      })

      if (recipe.image?.url) {
        setImagePreview(recipe.image.url)
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
      toast.error('Recipe not found')
      navigate('/profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Reduced to 2MB limit
        toast.error('Image size must be less than 2MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        // Compress the image by resizing it
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Set max dimensions
          const maxWidth = 800
          const maxHeight = 600
          
          let { width, height } = img
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7) // 70% quality
          
          setImagePreview(compressedImage)
          setFormData({
            ...formData,
            image: compressedImage
          })
        }
        img.src = reader.result
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
    setSaving(true)

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
        setSaving(false)
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

      await api.put(`/recipes/${id}`, recipeData)
      
      toast.success('Recipe updated successfully!')
      navigate(`/recipe/${id}`)
    } catch (error) {
      console.error('Update recipe error:', error)
      toast.error(error.response?.data?.message || 'Failed to update recipe')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back Button */}
          <Link
            to={`/recipe/${id}`}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors"
          >
            <FiArrowLeft size={20} />
            <span>Back to Recipe</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Recipe
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Update your recipe details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Recipe Details Section */}
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
                      PNG, JPG, JPEG up to 2MB (automatically optimized)
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
                  placeholder="Write step-by-step instructions..."
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You can use Markdown formatting for better presentation
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to={`/recipe/${id}`}
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="spinner border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    <span>Update Recipe</span>
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

export default EditRecipe
