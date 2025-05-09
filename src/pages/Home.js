import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import zeptoVeg from '../images/zeptoVeggie.png';
import ZeptoPet from '../images/zeptoPetCare.png';
import ZeptoBaby from '../images/zeptoBabyCare.png';
import ZeptoHair from '../images/zeptoHaircare.png';
import ZeptoElectronics from '../images/zeptoElectronics.png';
import ZeptoIceCream from '../images/zeptoIceCream.png';
import ZeptoPackaged from '../images/zeptoPackagedFood.png';
import ZeptoCafe from '../images/zeptoCafe.png';
import ZeptoDairy from '../images/zeptoDairy.png';
import ZeptoFrozen from '../images/zeptoFrozen.png';
import ZeptoJewellery from '../images/zeptoJewellery.png';
import ZeptoSkincare from '../images/zeptoSkinCare.png';
import ZeptoTea from '../images/zeptoTea.png';
import ZeptoToys from '../images/zeptoToys.png';
import ZeptoAtta from '../images/zeptoAtta.png';
import zeptoMakeup from '../images/zeptoMakeup.png';
import zetpoBanner from '../images/zeptoHomeBanner.webp';
import zeptoEleBanner from '../images/zeptoEleBanner.webp';
import zeptoBeautyBanner from '../images/zeptoBeautyBanner.webp';
import { useCart } from '../contexts/cartContext';
import '../styles/home.css';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categoryImages = [
    { src: zeptoVeg, name: 'Vegetables' },
    { src: ZeptoPet, name: 'Pet' },
    { src: ZeptoBaby, name: 'Baby' },
    { src: ZeptoHair, name: 'Hair' },
    { src: ZeptoElectronics, name: 'Electronics' },
    { src: ZeptoIceCream, name: 'IceCream' },
    { src: ZeptoPackaged, name: 'Packaged' },
    { src: ZeptoCafe, name: 'Cafe' },
    { src: ZeptoDairy, name: 'Dairy' },
    { src: ZeptoFrozen, name: 'Frozen' },
    { src: ZeptoJewellery, name: 'Jewellery' },
    { src: ZeptoSkincare, name: 'Skincare' },
    { src: ZeptoTea, name: 'Tea' },
    { src: ZeptoToys, name: 'Toys' },
    { src: ZeptoAtta, name: 'Atta' },
    { src: zeptoMakeup, name: 'Makeup' },
  ];

  const electronicProducts = products.filter(
    (product) => product.ProductType === 'Electronic'
  );
  const BabyProducts = products.filter(
    (product) => product.ProductType === 'Baby'
  );
  const toyProducts = products.filter(
    (product) => product.ProductType === 'Toys'
  );
  const fashionProducts = products.filter(
    (product) => product.ProductType === 'Fashion'
  );
  const cafeProducts = products.filter(
    (product) => product.ProductType === 'Cafe'
  );
  const homeProducts = products.filter(
    (product) => product.ProductType === 'Home'
  );
  const mobileProducts = products.filter(
    (product) => product.ProductType === 'Mobile'
  );
  const beautyProducts = products.filter(
    (product) => product.ProductType === 'Beauty'
  );
  const makeupProducts = products.filter(
    (product) => product.ProductType === 'Makeup'
  );

  const ProductCard = ({ product }) => {
    const cartProduct = cartItems.find((item) => item.ProductID === product.ProductID);
    const quantity = cartProduct ? cartProduct.quantity : 0;
    const isOutOfStock = product.ProductQuantity === 0;

    return (
      <div
        className="col-lg-3"
        onClick={() => setSelectedProduct(product)}
        style={{ cursor: 'pointer' }}
      >
        <div className={`card h-100 ${isOutOfStock ? 'out-of-stock' : ''}`}>
          <img
            src={`data:image/png;base64,${product.ProductImage}`}
            className="card-img-top"
            alt={product.ProductName}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body">
            <h5 className="card-title">{product.ProductName}</h5>
            <p className="card-text">Brand: {product.ProductBrand}</p>
            <p className="card-text">Price: ₹{product.ProductPrice}</p>
            <div className="card-text">
              Rating:{' '}
              {Array.from({ length: Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i} className="fas fa-star text-warning" />
              ))}
              {Array.from({ length: 5 - Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i + Math.floor(product.ProductRating || 1)} className="far fa-star text-warning" />
              ))}
            </div>
            {(selectedCategory === 'Cafe' || selectedCategory === 'Electronics' || selectedCategory === 'All') && (
              isOutOfStock ? (
                <p className="text-danger mt-2">Out of Stock</p>
              ) : cartProduct ? (
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(product.ProductID);
                    }}
                  >
                    -
                  </button>
                  <span className="mx-2">{quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProductModal = ({ product, onClose }) => {
    const isOutOfStock = product.ProductQuantity === 0;

    return (
      <div
        className="modal"
        style={{
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
        }}
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: 'white',
            margin: '15% auto',
            padding: '20px',
            width: '70%',
            maxWidth: '500px',
            borderRadius: '5px',
          }}
        >
          <div className="modal-header">
            <h5>{product.ProductName}</h5>
            <button className="btn btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <img
              src={`data:image/png;base64,${product.ProductImage}`}
              alt={product.ProductName}
              style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '15px' }}
            />
            <p>
              <strong>Description:</strong> {product.ProductDescription}
            </p>
            <p>
              <strong>Brand:</strong> {product.ProductBrand}
            </p>
            <p>
              <strong>Price:</strong> ₹{product.ProductPrice}
            </p>
            <p>
              <strong>Rating:</strong>{' '}
              {Array.from({ length: Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i} className="fas fa-star text-warning" />
              ))}
              {Array.from({ length: 5 - Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i + Math.floor(product.ProductRating || 1)} className="far fa-star text-warning" />
              ))}
            </p>
            <p>
              <strong>Quantity:</strong> {product.ProductQuantity}
            </p>
            <p>
              <strong>Location:</strong> {product.ProductLocation}
            </p>
            <p>
              <strong>Type:</strong> {product.ProductType}
            </p>
            <p>
              <strong>Sub Type:</strong> {product.ProductSubType}
            </p>
            <p>
              <strong>Weight:</strong> {product.ProductWeight}
            </p>
            <p>
              <strong>Shelf:</strong> {product.ProductShelf}
            </p>
            <p>
              <strong>Material:</strong> {product.ProductMaterial}
            </p>
          </div>
          <div className="modal-footer">
            {isOutOfStock ? (
              <p className="text-danger">Out of Stock</p>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
              >
                Add to Cart
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="shadow-lg">
      <div className="container-fluid shadow-lg">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-9 d-flex justify-content-evenly">
            <a href="#" className="navTags" onClick={() => setSelectedCategory('All')}>
              All
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Cafe')}>
              Cafe
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Home')}>
              Home
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Toys')}>
              Toys
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Fresh')}>
              Fresh
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Electronics')}>
              Electronics
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Mobiles')}>
              Mobiles
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Beauty')}>
              Beauty
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Fashion')}>
              Fashion
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Deal')}>
              Deal Zone
            </a>
            <a href="#" className="navTags" onClick={() => setSelectedCategory('Baby')}>
              Baby Store
            </a>
          </div>
        </div>
      </div>

      <div className="row">
        {selectedCategory === 'All' && (
          <div className="col-lg-12">
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px' }}>
              {categoryImages.map((category, index) => (
                <img
                  key={index}
                  src={category.src}
                  alt={category.name}
                  style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => navigate(`/category/${category.name}`)}
                />
              ))}
            </div>
            <div className="col-lg-12">
              <img className="mt-5" src={zetpoBanner} alt="banner" />
            </div>
            <div className="container-fluid mt-4 mb-4">
              <div className="row">
                <div className="col-lg-6">
                  <img onClick={()=>navigate('/category/Electronics')}
                    src={zeptoEleBanner}
                    alt="banner"
                    className="img-fluid"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="col-lg-6">
                  <img onClick={()=>navigate('/category/makeup')}
                    src={zeptoBeautyBanner}
                    alt="banner"
                    className="img-fluid"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {(selectedCategory === 'Cafe' || selectedCategory === 'All') && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Cafe Products</h2>
            </div>
            {cafeProducts.length > 0 ? (
              <div className="row">
                {cafeProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No cafe products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Home' && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Home Products</h2>
            </div>
            {homeProducts.length > 0 ? (
              <div className="row">
                {homeProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No home products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Toys' && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Toy Products</h2>
            </div>
            {toyProducts.length > 0 ? (
              <div className="row">
                {toyProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No toy products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Fresh' && (
          <div className="col-lg-12">
            Fresh
          </div>
        )}

        {(selectedCategory === 'Electronics' || selectedCategory === 'All') && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Electronics</h2>
            </div>
            {electronicProducts.length > 0 ? (
              <div className="row">
                {electronicProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No electronics products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Mobiles' && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Mobiles</h2>
            </div>
            {mobileProducts.length > 0 ? (
              <div className="row">
                {mobileProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No mobile products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Beauty' && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Beauty</h2>
            </div>
            {beautyProducts.length > 0 ? (
              <div className="row">
                {beautyProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No beauty products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Fashion' && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Fashion Products</h2>
            </div>
            {fashionProducts.length > 0 ? (
              <div className="row">
                {fashionProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No fashion products available.</p>
              </div>
            )}
          </>
        )}

        {selectedCategory === 'Deal' && (
          <div className="col-lg-12">
            Deal
          </div>
        )}

        {(selectedCategory === 'Baby' || selectedCategory === 'All') && (
          <>
            <div className="col-lg-12 mb-4">
              <h2>Baby Products</h2>
            </div>
            {BabyProducts.length > 0 ? (
              <div className="row">
                {BabyProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-lg-12">
                <p>No baby products available.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export default Home;