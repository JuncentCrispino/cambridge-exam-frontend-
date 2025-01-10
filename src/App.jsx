import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [newProduct, setNewProduct] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [searchId, setSearchId] = useState("");

  const apiUrl = "http://localhost:3000/api"; // Adjust the URL based on your backend

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(apiUrl + "/products");
      console.log(response.data);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(error?.response?.data?.message || "Something went wrong.")
    }
  };

  const fetchProductById = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products/${searchId}`);
      setProductDetails(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert(error?.response?.data?.message || "Something went wrong.")
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product-types`);
      setProductTypes(response.data.productTypes);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl + "/product", newProduct);
      alert("Product added successfully");
      setNewProduct({});
      fetchAllProducts()
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error?.response?.data?.message || "Something went wrong.")
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/product/${deleteId}`);
      alert("Product deleted successfully");
      setDeleteId("");
      fetchAllProducts()
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="App">
      <h1>Product Manager</h1>
      <div className="buttons">
        <button onClick={fetchAllProducts}>All Products</button>
        <button onClick={fetchProductTypes}>Product Types</button>
      </div>

      <div className="section">
        <h2>Search Product by ID</h2>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Product ID"
        />
        <button onClick={fetchProductById}>Search</button>
        {productDetails && (
          <div>
            <h3>Product Details</h3>
            <pre>{JSON.stringify(productDetails, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Add Product</h2>
        <form onSubmit={addProduct}>
          <input
            type="text"
            placeholder="ID"
            value={newProduct.id || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, id: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Type"
            value={newProduct.type || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, type: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price || ""}
            onChange={(e) => {
              const priceValue = e.target.value;
              if (!isNaN(priceValue)) {
                setNewProduct({ ...newProduct, price: parseFloat(priceValue) });
              }
            }}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="section">
        <h2>Delete Product</h2>
        <input
          type="text"
          placeholder="Enter Product ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />
        <button onClick={deleteProduct}>Delete</button>
      </div>

      <div className="section">
        <h2>All Products</h2>
        {products.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.type}</td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products to display</p>
        )}
      </div>

      <div className="section">
        <h2>Product Types</h2>
        {productTypes.length > 0 ? (
          <ul>
            {productTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        ) : (
          <p>No types to display</p>
        )}
      </div>
    </div>
  );
}

export default App;
