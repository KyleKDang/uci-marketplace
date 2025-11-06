
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductInfoPage = () => {
  const { id } = useParams(); // Get the listing ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/listings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow flex items-center gap-2"
        >
          <span>←</span> Back to Main Dashboard!
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-blue-600">
          <div className="grid md:grid-cols-2 gap-8 p-8 bg-gradient-to-br from-white to-blue-50">
            
            {/* Product Image Section */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
              <img
                src={`http://localhost:8000${product.image_url}`}
                alt={product.title}
                className="max-w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-center">
              
              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              {/* Product Price */}
              <div className="text-3xl font-bold text-blue-600 mb-6">
                ${product.price}
              </div>

              {/* Product Category */}
              <div className="text-2xl font-semibold text-gray-700 mb-6">
                Category: {product.category}
              </div>

              {/* Description */}
              {product.description && (
                <div className="text-gray-700 mb-6">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Chat Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">
                Chat with Student Seller!
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPage;