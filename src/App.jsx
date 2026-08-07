import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Checklist from "./pages/Checklist";



function Offers() {
  return <h1>Offers</h1>;
}

function About() {
  return <h1>About Us</h1>;
}


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* All Categories */}

        <Route
          path="/categories"
          element={<Categories />}
        />


        {/* Single Category */}

        <Route
          path="/category/:categoryId"
          element={<Category />}
        />


        {/* Other Pages */}

        <Route
          path="/checklist"
          element={<Checklist />}
        />

        <Route
          path="/offers"
          element={<Offers />}
        />

        <Route
          path="/about"
          element={<About />}
        />    <Route
  path="/product/:id"
  element={<ProductDetails />}
/>

      </Routes>
  

    </BrowserRouter>

  );
}

export default App;