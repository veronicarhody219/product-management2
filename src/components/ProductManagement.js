import React, {useEffect, useState} from "react";
import "./productManagement.css";
export default function ProductManagement() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductRating, setNewProductRating] = useState("");

  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductRating, setEditProductRating] = useState("");
  const [editReviewContent, setEditReviewContent] = useState("");
  const [editReviewRating, setEditReviewRating] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);

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
    const ratingValue = parseInt(newProductRating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5");
    }
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
    setNewProductPrice("");
    setNewProductRating("");
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
    const ratingValue = parseInt(editProductRating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5");
      return;
    }
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
  function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  }
  function addReview(productId, reviewContent, rating) {
    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5");
      return;
    }
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedReviews = [
          ...product.reviews,
          {id: Date.now(), content: reviewContent, rating: rating},
        ];
        // const averageRating = calculateAverageRating(updatedReviews);
        return {...product, reviews: updatedReviews, rating: ratingValue};
      }
      return product;
    });
    setProducts(updatedProducts);
  }
  function deleteReview(productId, reviewId) {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedReviews = product.reviews.filter(
          (review) => review.id !== reviewId
        );
        const averageRating = calculateAverageRating(updatedReviews);
        return {...product, reviews: updatedReviews, rating: averageRating};
      }
      return product;
    });
    setProducts(updatedProducts);
  }
  function editReview(productId, reviewId) {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const reviewToEdit = product.reviews.find(
          (review) => review.id === reviewId
        );
        setEditReviewId(reviewToEdit.id);
        setEditReviewContent(reviewToEdit.content);
        setEditReviewRating(reviewToEdit.rating);
      }
      return product;
    });
    setProducts(updatedProducts);
  }
  function saveEditedReview(productId, reviewId) {
    const ratingValue = parseInt(editReviewRating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      alert("Rating must be a number between 1 and 5");
      return;
    }
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedReviews = product.reviews.map((review) =>
          review.id === reviewId
            ? {...review, content: editReviewContent, rating: ratingValue}
            : review
        );
        const averageRating = calculateAverageRating(updatedReviews);
        return {...product, reviews: updatedReviews, rating: averageRating};
      }
      return product;
    });
    setProducts(updatedProducts);
    setEditReviewId(null);
  }
  return (
    <div className="product-management">
      <input
        type="text"
        value={newProductName}
        placeholder="Product name"
        onChange={handleNewProductName}
      />
      <input
        type="number"
        value={newProductPrice}
        placeholder="Product price"
        onChange={handleNewProductPrice}
      />
      <input
        type="number"
        value={newProductRating}
        placeholder="Product rating"
        min="1"
        max="5 "
        step="1"
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
          <form
            className="review-form"
            onSubmit={(e) => {
              e.preventDefault();
              const reviewContent = e.target.review.value;
              const rating = parseInt(e.target.rating.value);
              addReview(product.id, reviewContent, rating);
              e.target.reset();
            }}>
            <input
              type="text"
              name="review"
              placeholder="Write your review here"
              required
            />
            <input type="number" name="rating" placeholder="Rating" required />
            <button type="submit">Add review</button>
          </form>
          <ul className="review-list">
            {product.reviews.map((review) => (
              <li key={review.id} className="review-item">
                <p>
                  {[...Array(parseInt(review.rating))].map((_, index) => (
                    <span key={index} className="rating">
                      &#9733;
                    </span>
                  ))}
                </p>
                <p>{review.content}</p>

                <button
                  onClick={() => deleteReview(product.id, review.id)}
                  className="button button-delete">
                  Delete
                </button>
                <button
                  onClick={() => editReview(product.id, review.id)}
                  className="button button-edit">
                  Edit
                </button>
              </li>
            ))}
          </ul>
          {editReviewId && (
            <div className="edit-review-form">
              <input
                type="text"
                value={editReviewContent}
                onChange={(e) => setEditReviewContent(e.target.value)}
                placeholder="Edit review content"
              />
              <input
                type="number"
                value={editReviewRating}
                onChange={(e) => setEditReviewRating(e.target.value)}
                placeholder="Edit review rating"
              />
              <button
                className="button button-edit"
                onClick={() => saveEditedReview(product.id, editReviewId)}>
                Save
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
