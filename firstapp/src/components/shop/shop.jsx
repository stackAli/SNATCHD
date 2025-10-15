import React from 'react';
import ShopMain from './shop-main';
import CategoryNav from './shop-nav';
import ProductGrid from './products';
import Footer from './shop-footer';
import { useParams } from 'react-router-dom';


function Shop() {
  const { category } = useParams();

  return (
    <div>
      <ShopMain />
      <CategoryNav />
      <ProductGrid key={category} />
      <Footer />
    </div>
  );
}

export default Shop;
