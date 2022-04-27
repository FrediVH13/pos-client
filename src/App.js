import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Products from "./pages/Products";
import Main from "./components/Main";
import NewOrder from "./pages/NewOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Main />}>
          <Route index element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="sales">
            <Route path="new-order" element={<NewOrder />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
