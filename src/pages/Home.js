import React,{useState,useEffect} from 'react'
import axios from 'axios'
import zeptoVeg from '../images/zeptoVeggie.png'
import ZeptoPet from '../images/zeptoPetCare.png'
import ZeptoBaby from '../images/zeptoBabyCare.png'
import ZeptoHair from '../images/zeptoHaircare.png'
import ZeptoElectronics from '../images/zeptoElectronics.png'
import ZeptoIceCream from '../images/zeptoIceCream.png'
import ZeptoPackaged from '../images/zeptoPackagedFood.png'
import ZeptoCafe from '../images/zeptoCafe.png'
import ZeptoDairy from '../images/zeptoDairy.png'
import ZeptoFrozen from '../images/zeptoFrozen.png'
import ZeptoJewellery from '../images/zeptoJewellery.png' 
import ZeptoSkincare from '../images/zeptoSkinCare.png'
import ZeptoTea from '../images/zeptoTea.png'
import ZeptoToys from '../images/zeptoToys.png'
import ZeptoAtta from '../images/zeptoAtta.png'
import zetpoBanner from '../images/zeptoHomeBanner.webp'
import zeptoEleBanner from '../images/zeptoEleBanner.webp'
import zeptoBeautyBanner from '../images/zeptoBeautyBanner.webp'
function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);

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
    const electronicProducts = products.filter(
      (product) => product.ProductType === 'Electronic'
    );
    const BabyProducts = products.filter(
      (product) => product.ProductType === 'Baby'
    );
  return (
    <div  className='shadow-lg'>
      <div className='container-fluid shadow-lg'>




<div className='row'>
  <div className='col-lg-1'></div>
  <div className='col-lg-9  d-flex justify-content-evenly'>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('All')} >All</a>
  <a href="#" className="navTags"  onClick={()=>setSelectedCategory('Cafe')}>Cafe</a>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('Home')}>Home</a>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('Toys')}>Toys</a>
  <a href="#" className="navTags"  onClick={()=>setSelectedCategory('Fresh')}>Fresh</a>
  <a href="#" className="navTags"  onClick={()=>setSelectedCategory('Electronics')}>Electronics</a>
  <a href="#" className="navTags"  onClick={()=>setSelectedCategory('Mobiles')}>Mobiles</a>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('Beauty')}>Beauty</a>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('Fashion')}>Fashion</a>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('Deal')}>Deal Zone</a>
  <a href="#" className="navTags" onClick={()=>setSelectedCategory('Baby')}>Baby Store</a>
</div>
</div>
      </div>
      
<div className='row'>
{selectedCategory=='All'&&(
  <div className='col-lg-12'>
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px' }}>
    <img src={zeptoVeg} alt="Vegetables" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoPet} alt="Pet" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoBaby} alt="Baby" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoHair} alt="Hair" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoElectronics} alt="Electronics" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoIceCream} alt="Ice Cream" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoPackaged} alt="Packaged" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoCafe} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoDairy} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoFrozen} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoJewellery} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoSkincare} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoToys} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoTea} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
    <img src={ZeptoAtta} alt="Cafe" style={{ width: '100px', height: '100px', marginRight: '20px', objectFit: 'contain' }} />
  </div>
  <div className='col-lg-12'>
  <img className='mt-5' src={zetpoBanner} alt='banner'/>
  </div>
  <div className="container-fluid mt-4 mb-4">
  <div className="row">
    <div className="col-lg-6">
      <img src={zeptoEleBanner} alt="banner" className="img-fluid" style={{ width: '100%', height: 'auto' }} />
    </div>
    <div className="col-lg-6">
      <img src={zeptoBeautyBanner} alt="banner" className="img-fluid" style={{ width: '100%', height: 'auto' }} />
    </div>
  </div>
</div>


  </div>
      )}

      {selectedCategory=='Cafe'&&(
<div className='col-lg-12'>
    cafe
    </div>


      )}

{selectedCategory=='Home'&&(
<div className='col-lg-12'>
Home
    </div>


      )}
         {selectedCategory=='Toys'&&(
<div className='col-lg-12'>
Toys
    </div>


      )}
         {selectedCategory=='Fresh'&&(
<div className='col-lg-12'>
Fresh
    </div>


      )}
     {selectedCategory === 'Electronics'&& (
  <>
    <div className='col-lg-12 mb-4'>
      <h2>Electronics</h2>
    </div>

    {electronicProducts.length > 0 ? (
      <div className="row">   {/* <<< Added row here */}
        {electronicProducts.map((product) => (
          <div key={product._id} className="col-lg-3">
            <div className="card h-100">
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
              </div>
            </div>
          </div>
        ))}
      </div> 
    ) : (
      <div className="col-lg-12">
        <p>No electronics products available.</p>
      </div>
    )}
  </>
)}
      
    
  
         {selectedCategory=='Mobiles'&&(
<div className='col-lg-12'>
Mobiles
    </div>


      )}
         {selectedCategory=='Beauty'&&(
<div className='col-lg-12'>
Beauty
    </div>


      )}
         {selectedCategory=='Fashion'&&(
<div className='col-lg-12'>
Fashion
    </div>


      )}
         {selectedCategory=='Deal'&&(
<div className='col-lg-12'>
Deal
    </div>


      )}

{selectedCategory === 'Baby' && (
  <>
    <div className='col-lg-12 mb-4'>
      <h2>Baby Products</h2>
    </div>

    {BabyProducts.length > 0 ? (
      <div className="row">
        {BabyProducts.map((product) => (
          <div key={product._id} className="col-lg-3">
            <div className="card h-100">
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
              </div>
            </div>
          </div>
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


    </div>
  )
}


export default Home
