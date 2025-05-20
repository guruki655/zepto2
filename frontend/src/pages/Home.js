import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
import zeptoBanner from '../images/zeptoHomeBanner.webp';
import zeptoEleBanner from '../images/zeptoEleBanner.webp';
import zeptoBeautyBanner from '../images/zeptoBeautyBanner.webp';
import { useCart } from '../contexts/cartContext';
import cafe1 from '../images/cafe11.png'
import toys11 from '../images/toys11.png'
import fruits11 from '../images/fruits11.png'
import baby11 from '../images/baby11.png'
import all22 from '../images/all22.png'
import home22 from '../images/home22.png'
import deal22 from '../images/deal22.png'
import elec22 from '../images/elec22.png'
import mo22 from '../images/mo22.png'
import beauty22 from '../images/beauty22.png'
import fash22 from '../images/fash22.png'
import allp from '../images/allp.png'
import babyp from '../images/babyp.png'
import beautyp from '../images/beautyp.png'
import dealp from '../images/dealp.png'
import elecppp from '../images/elecppp.png'
import mobp from '../images/mobp.png'
import toypp from '../images/toypp.png'
import homepp from '../images/homepp.png'
import fashp from '../images/fashp.png'
import fruitspp from '../images/fruitspp.png'
import '../styles/home.css';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', `${process.env.REACT_APP_API_BASE_URL}/api/customers`);
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customers`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categoryImages = [
    { src: zeptoVeg, name: 'FruitsandVegetables' },
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

  const imageWidth = 120; // Increased to match Zepto's larger icons
  const marginRight = 10; // Reduced for compact layout
  const scrollAmount = imageWidth + marginRight;
  const visibleImages = 5; // Adjusted to fit larger images
  const loopOffset = categoryImages.length * scrollAmount;

  const extendedImages = [
    ...categoryImages.slice(-visibleImages),
    ...categoryImages,
    ...categoryImages.slice(0, visibleImages),
  ];

  const handlePrev = () => {
    setScrollPosition((prev) => {
      const newPosition = prev - scrollAmount;
      if (newPosition < 0) {
        return newPosition + loopOffset;
      }
      return newPosition;
    });
  };

  const handleNext = () => {
    setScrollPosition((prev) => {
      const newPosition = prev + scrollAmount;
      if (newPosition >= loopOffset) {
        return newPosition - loopOffset;
      }
      return newPosition;
    });
  };

  useEffect(() => {
    if (scrollPosition < 0) {
      setScrollPosition(scrollPosition + loopOffset);
    } else if (scrollPosition >= loopOffset) {
      setScrollPosition(scrollPosition - loopOffset);
    }
  }, [scrollPosition, loopOffset]);

  const electronicProducts = products.filter((product) => product.ProductType === 'Electronics');
  const babyProducts = products.filter((product) => product.ProductType === 'Baby');
  const toyProducts = products.filter((product) => product.ProductType === 'Toys');
  const fashionProducts = products.filter((product) => product.ProductType === 'Fashion');
  const cafeProducts = products.filter((product) => product.ProductType === 'Cafe');
  const homeProducts = products.filter((product) => product.ProductType === 'Home');
  const mobileProducts = products.filter((product) => product.ProductType === 'Mobile');
  const beautyProducts = products.filter((product) => product.ProductType === 'Beauty');
  const makeupProducts = products.filter((product) => product.ProductType === 'Makeup');
  const fruitsAndVegetablesProducts = products.filter((product) => product.ProductType === "FruitsandVegetables");

      console.log(fruitsAndVegetablesProducts.length,"fruitsAndVegetablesProducts")
      console.log(electronicProducts.length,"Electronics")


  console.log('Cafe Products Count:', cafeProducts.length);

  const ProductCard = ({ product }) => {
    const cartProduct = cartItems.find((item) => item.ProductID === product.ProductID);
    const quantity = cartProduct ? cartProduct.quantity : 0;
    const isOutOfStock = product.ProductQuantity === 0;

    return (
      <div
        className="col-lg-3 col-md-4 col-sm-6 mb-4"
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedProduct(product)} // Added to open the modal
      >
        <div className={`card h-100 ${isOutOfStock ? 'out-of-stock' : ''}`}>
          <img
            src={`data:image/png;base64,${product.ProductImage}`}
            className="card-img-top"
            alt={product.ProductName}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-truncate">{product.ProductName}</h5>
            <p className="card-text">Brand: {product.ProductBrand}</p>
            <p className="card-text">Price: ₹{product.ProductPrice}</p>
            <div className="card-text mb-2">
              Rating:{' '}
              {Array.from({ length: Math.floor(product.ProductRating || 1) }, (_, i) => (
                <i key={i} className="fas fa-star text-warning" />
              ))}
              {Array.from(
                { length: 5 - Math.floor(product.ProductRating || 1) },
                (_, i) => (
                  <i
                    key={i + Math.floor(product.ProductRating || 1)}
                    className="far fa-star text-warning"
                  />
                )
              )}
            </div>
            {(selectedCategory === 'Cafe' ||
              selectedCategory === 'Electronics' ||
              selectedCategory === 'FruitsandVegetables' ||
              selectedCategory === 'All') && (
              <div className="button-container mt-auto">
                {isOutOfStock ? (
                  <p className="text-danger mt-2 mb-0">Out of Stock</p>
                ) : cartProduct ? (
                  <div className="d-flex align-items-center justify-content-center">
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
                )}
              </div>
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
            margin: '10% auto',
            padding: '20px',
            width: '90%',
            maxWidth: '500px',
            borderRadius: '5px',
          }}
        >
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{product.ProductName}</h5>
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
              {Array.from(
                { length: 5 - Math.floor(product.ProductRating || 1) },
                (_, i) => (
                  <i
                    key={i + Math.floor(product.ProductRating || 1)}
                    className="far fa-star text-warning"
                  />
                )
              )}
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
          <div className="modal-footer d-flex justify-content-between">
            {isOutOfStock ? (
              <p className="text-danger mb-0">Out of Stock</p>
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container-fluid">
      <div className="container-fluid shadow-lg  mb-4">
        <div className="row">
          <div className="col-lg-1"></div>
<div className="col-lg-10 col-12 d-flex flex-wrap justify-content-evenly">
  {[
    { name: 'All', icon: all22, selectedIcon: allp },
    { name: 'Cafe', icon: cafe1, selectedIcon: cafe1 },
    { name: 'Home', icon: home22, selectedIcon: homepp },
    { name: 'Toys', icon: toys11, selectedIcon: toypp },
    { name: 'FruitsandVegetables', icon: fruits11, selectedIcon: fruitspp },
    { name: 'Electronics', icon: elec22, selectedIcon: elecppp },
    { name: 'Mobiles', icon: mo22, selectedIcon: mobp },
    { name: 'Beauty', icon: beauty22, selectedIcon: beautyp },
    { name: 'Fashion', icon: fash22, selectedIcon: fashp },
    { name: 'Deal Zone', icon: deal22, selectedIcon: dealp },
    { name: 'Baby Store', icon: baby11, selectedIcon: babyp }
  ].map((category) => {
    const isSelected = selectedCategory === category.name.replace(/ &/g, '');
    return (
      <a
        key={category.name}
        href="#"
        className={`navTags mx-2 my-1 d-flex flex-column align-items-center ${isSelected ? 'active' : ''}`}
        onClick={() => handleCategoryClick(category.name.replace(/ &/g, ''))}
      >
        <img
          src={isSelected ? category.selectedIcon : category.icon}
          alt={category.name}
          className="category-icon mb-1"
          style={{ width: '24px', height: '24px' }}
        />
        <span style={{ color: isSelected ? undefined : '#586274' }}>{category.name}</span>
      </a>
    );
  })}
</div>


          <div className="col-lg-1"></div>
        </div>
      </div>

      <div className="container">
        {selectedCategory === 'All' && (
          <div className="row">
            <div className="col-12">
              <div className="carousel-container">
                <button
                  className="carousel-arrow carousel-arrow-left"
                  onClick={handlePrev}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="carousel-content">
                  <div
                    ref={carouselRef}
                    style={{
                      display: 'flex',
                      transform: `translateX(-${scrollPosition}px)`,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {extendedImages.map((category, index) => (
                      <img
                        key={`${category.name}-${index}`}
                        src={category.src}
                        alt={category.name}
                        className="carousel-image"
                        onClick={() => navigate(`/category/${category.name}`)}
                      />
                    ))}
                  </div>
                </div>
                <button
                  className="carousel-arrow carousel-arrow-right"
                  onClick={handleNext}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <Link to="/paancorner">
                <img
                  src={zeptoBanner}
                  alt="banner"
                  className="img-fluid mt-4 mb-4"
                  style={{ width: '100%' }}
                />
              </Link>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <img
                    onClick={() => navigate('/category/Electronics')}
                    src={zeptoEleBanner}
                    alt="Electronics Banner"
                    className="img-fluid "
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <img
                    onClick={() => navigate('/category/Makeup')}
                    src={zeptoBeautyBanner}
                    alt="Beauty Banner"
                    className="img-fluid"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="mb-0">Fruits and Vegetables</h2>
                  {fruitsAndVegetablesProducts.length > 4 && (
                    <a
                      href="#"
                      className="see-more-link"
                      onClick={() => navigate('/category/FruitsandVegetables')}
                    >
                      See More <i className="fas fa-chevron-right ms-2" />
                    </a>
                  )}
                </div>
                <div className="row">
                  {fruitsAndVegetablesProducts.length > 0 ? (
                    fruitsAndVegetablesProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  ) : (
                    <div className="col-12">
                      <p>No products available.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {(selectedCategory === 'Cafe' || selectedCategory === 'All') && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Cafe Products</h2>
                {cafeProducts.length > 4 && (
                  <a
                    href="#"
                    className="see-more-link"
                    onClick={() => navigate('/category/Cafe')}
                  >
                    See More <i className="fas fa-chevron-right ms-2" />
                  </a>
                )}
              </div>
              <div className="row">
                {cafeProducts.length > 0 ? (
                  cafeProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No cafe products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Home' && (
          <div className="row">
            <div className="col-12 mb-4">
              <h2 className="mb-3">Home Products</h2>
              <div className="row">
                {homeProducts.length > 0 ? (
                  homeProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No home products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Toys' && (
          <div className="row">
            <div className="col-12 mb-4">
              <h2 className="mb-3">Toy Products</h2>
              <div className="row">
                {toyProducts.length > 0 ? (
                  toyProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No toy products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'FruitsandVegetables' && (
          <div className="row">
            <div className="col-12 mb-4">
              <h2 className="mb-3">Fruits and Vegetables</h2>
              <div className="row">
                {fruitsAndVegetablesProducts.length > 0 ? (
                  fruitsAndVegetablesProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No Fruits and Vegetables products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(selectedCategory === 'Electronics' || selectedCategory === 'All') && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Electronics</h2>
                {electronicProducts.length > 4 && (
                  <a
                    href="#"
                    className="see-more-link"
                    onClick={() => navigate('/category/Electronics')}
                  >
                    See More <i className="fas fa-chevron-right ms-2" />
                  </a>
                )}
              </div>
              <div className="row">
                {electronicProducts.length > 0 ? (
                  electronicProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No electronics products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Mobiles' && (
          <div className="row">
            <div className="col-12 mb-4">
              <h2 className="mb-3">Mobiles</h2>
              <div className="row">
                {mobileProducts.length > 0 ? (
                  mobileProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No mobile products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Beauty' && (
          <div className="row">
            <div className="col-12 mb-4">
              <h2 className="mb-3">Beauty</h2>
              <div className="row">
                {beautyProducts.length > 0 ? (
                  beautyProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className ="col-12">
                    <p>No beauty products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Fashion' && (
          <div className="row">
            <div className="col-12 mb-4">
              <h2 className="mb-3">Fashion Products</h2>
              <div className="row">
                {fashionProducts.length > 0 ? (
                  fashionProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No fashion products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'Deal' && (
          <div className="row">
            <div className="col-12">
              <p>Deal</p>
            </div>
          </div>
        )}

        {(selectedCategory === 'Baby' || selectedCategory === 'All') && (
          <div className="row">
            <div className="col-12 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">

              <h2 className="mb-3">Baby Products</h2>
              </div>
              <div className="row">
                {babyProducts.length > 0 ? (
                  babyProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-12">
                    <p>No baby products available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </div>
  );
}

export default Home;