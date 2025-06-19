import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiSearch } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="text-9xl font-bold text-orange-500 mb-4">404</div>
          <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">🍴</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Recipe Not Found
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! It looks like this recipe has gone missing from our kitchen. 
          Don't worry, there are plenty more delicious recipes to discover!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center space-x-2"
          >
            <FiHome size={20} />
            <span>Back to Home</span>
          </Link>
          
          <Link
            to="/recipes"
            className="btn-secondary flex items-center space-x-2"
          >
            <FiSearch size={20} />
            <span>Browse Recipes</span>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still can't find what you're looking for? Try searching for something specific.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
