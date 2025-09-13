import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Checkout from './components/checkout';
import Cart from './components/cart';
import Home from './components/Home';
import Shop from './components/shop/shop';
import ContactUs from './components/contactus';
import AdminPanel from './components/AdminPanel';
import Details from './components/shop/details'; 



function App() {
  return (
    <>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/cart" element={<Cart />} />

          {/* All shop pages now handled by one Shop component */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<Details />} /> 

          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
