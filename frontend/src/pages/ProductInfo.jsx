import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ProductInfo({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/listings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Fetch seller info
          fetchSeller(data.user_id);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Cannot connect to server');
      } finally {
        setLoading(false);
      }
    };

    const fetchSeller = async (userId) => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSeller(data);
        }
      } catch (err) {
        console.error('Could not fetch seller info');
      }
    };

    fetchProduct();
  }, [id]);

  const handleContactSeller = () => {
    if (seller && seller.email) {
      const subject = encodeURIComponent(`Interested in: ${product.title}`);
      const body = encodeURIComponent(`Hi,\n\nI'm interested in your listing "${product.title}" for $${product.price}.\n\nPlease let me know if it's still available.\n\nThanks!`);
      
      window.location.href = `mailto:${seller.email}?subject=${subject}&body=${body}`;
    } else {
      alert('Seller contact information not available');
    }
  };

  if (loading) {
    return (
      <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar user={user} onLogout={onLogout} />
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
        >
          ← Back to Dashboard
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
              {product.image_url ? (
                <img
                  src={`${API_URL}${product.image_url}`}
                  alt={product.title}
                  className="max-w-full h-auto object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              <div className="text-3xl font-bold text-blue-600 mb-6">
                ${product.price.toFixed(2)}
              </div>

              {/* Category and Region badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.region && (
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {product.region}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="text-gray-700 mb-6">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Seller info */}
              {seller && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Seller: <span className="font-medium">{seller.name}</span></p>
                </div>
              )}

              <button 
                onClick={handleContactSeller}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                Contact Seller
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductInfo;