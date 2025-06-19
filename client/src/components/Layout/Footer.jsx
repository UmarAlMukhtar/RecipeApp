import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiHeart } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold">RecipeShare</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover, share, and enjoy amazing recipes from food lovers around the world. 
              Create your culinary journey with our community-driven recipe platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/UmarAlMukhtar/RecipeApp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-400 hover:text-orange-400 transition-colors">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Submit Recipe
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/recipes?cuisine=Italian" 
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Italian
                </Link>
              </li>
              <li>
                <Link 
                  to="/recipes?cuisine=American" 
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  American
                </Link>
              </li>
              <li>
                <Link 
                  to="/recipes?tags=healthy" 
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Healthy
                </Link>
              </li>
              <li>
                <Link 
                  to="/recipes?tags=dessert" 
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Desserts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Umar Al Mukhtar. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <FiHeart className="text-red-500 mx-1" size={16} /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
