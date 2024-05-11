import React, {useEffect, useState} from "react";
import "./productManagement.css";
export default function ProductManagement() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(null);
  const [newProductRating, setNewProductRating] = useState(null);

  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState(null);
  const [editProductRating, setEditProductRating] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  function handleNewProductName(event) {
    setNewProductName(event.target.value);
  }

  function handleNewProductPrice(event) {
    setNewProductPrice(event.target.value);
  }
  function handleNewProductRating(event) {
    setNewProductRating(event.target.value);
  }

  function addProduct() {
    const newProduct = {
      id: Date.now(),
      name: newProductName,
      price: parseFloat(newProductPrice).toLocaleString("vi-VN") + " VND",
      rating: parseInt(newProductRating),
      favorite: false,
      reviews: [],
    };
    setProducts([...products, newProduct]);
    setNewProductName("");
    setNewProductPrice(null);
    setNewProductRating(null);
  }
  function deleteProduct(index) {
    const newProducts = products.filter((product) => product.id !== index);
    setProducts(newProducts);
  }
  function editProduct(index) {
    const productToEdit = products.find((product) => product.id === index);
    setEditProductId(index);
    setEditProductName(productToEdit.name);
    setEditProductPrice(productToEdit.price);
    setEditProductRating(productToEdit.rating);
  }

  function saveEditedProduct() {
    const updatedProducts = products.map((product) =>
      product.id === editProductId
        ? {
            ...product,
            name: editProductName,
            price:
              parseFloat(editProductPrice).toLocaleString("vi-VN") + " VND",
            rating: editProductRating,
          }
        : product
    );
    setProducts(updatedProducts);
    setEditProductId(null);
  }
  function handleToggleFavorite(id) {
    const updatedProducts = products.map((product) =>
      product.id === id ? {...product, favorite: !product.favorite} : product
    );
    setProducts(updatedProducts);
  }

  function addReview(productId, reviewContent, rating) {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? {
            ...product,
            reviews: [
              ...product.reviews,
              {content: reviewContent, rating: rating},
            ],
          }
        : product
    );
  }
  return (
    <div className="product-management">
      <input
        type="text"
        placeholder="Product name"
        onChange={handleNewProductName}
      />
      <input
        type="number"
        placeholder="Product price"
        onChange={handleNewProductPrice}
      />
      <input
        type="number"
        placeholder="Product rating"
        // min="1"
        // max="5 "
        // step="1"
        onChange={handleNewProductRating}
      />
      <button className="product-add-btn" onClick={addProduct}>
        Add product
      </button>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <div className="rating">
            {[
              ...Array(
                editProductId === product.id
                  ? parseInt(editProductRating)
                  : parseInt(product.rating)
              ),
            ].map((_, index) => (
              <span key={index}>&#9733;</span>
            ))}
          </div>
          <span
            className={product.favorite ? "heart" : "no-heart"}
            onClick={() => handleToggleFavorite(product.id)}>
            &hearts;
          </span>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
          <button onClick={() => editProduct(product.id)}>Edit</button>
          <button onClick={() => addReview()}>Add review</button>
          {editProductId === product.id && (
            <div className="edit-form">
              <input
                type="text"
                value={editProductName}
                onChange={(e) => setEditProductName(e.target.value)}
                placeholder="Edit product name"
              />
              <input
                type="text"
                value={editProductPrice}
                onChange={(e) => setEditProductPrice(e.target.value)}
                placeholder="Edit product price"
              />
              <input
                type="text"
                value={editProductRating}
                onChange={(e) => setEditProductRating(e.target.value)}
                placeholder="Edit product rating"
              />
              <button onClick={saveEditedProduct}>Save</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
