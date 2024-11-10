import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ProgressBar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


// LoadingPage Component
const LoadingPage = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return oldProgress + 10;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
            <h4>Loading, please wait...</h4>
            <ProgressBar now={progress} label={`${progress}%`} style={{ width: '50%' }} />
        </div>
    );
};

// Main Component
function ProductsTable() {
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true); // New state to handle loading

    // Fetch products with loading state
    async function fetchProducts() {
        setLoading(true);
        const response = await fetch("https://671fe962e7a5792f052ff4d2.mockapi.io/ProductsTable");
        const data = await response.json();
        setProducts(data);
        setLoading(false); // Set loading to false once data is fetched
    }

    async function saveProduct() {
        const product = { title, quantity, price };
        try {
            if (editId) {
                const response = await fetch(`https://671fe962e7a5792f052ff4d2.mockapi.io/ProductsTable/${editId}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                });
                const updatedProduct = await response.json();
                setProducts((prevProducts) => prevProducts.map((p) => (p.id === editId ? updatedProduct : p)));
                setEditId(null);
                Swal.fire("Updated!", "The product has been updated.", "success");
            } else {
                const response = await fetch("https://671fe962e7a5792f052ff4d2.mockapi.io/ProductsTable", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                });
                const newProduct = await response.json();
                setProducts((prevProducts) => [...prevProducts, newProduct]);
                Swal.fire("Saved!", "The product has been saved.", "success");
            }
            setTitle("");
            setQuantity("");
            setPrice("");
        } catch (error) {
            console.error("Failed to save product", error);
            Swal.fire("Error!", "Failed to save product.", "error");
        }
    }

    function editProduct(product) {
        setTitle(product.title);
        setQuantity(product.quantity);
        setPrice(product.price);
        setEditId(product.id);
        Swal.fire("Edit Mode", "You are now editing the product.", "info");
    }

    async function deleteProduct(e) {
        const id = e.target.value;
        const url = `https://671fe962e7a5792f052ff4d2.mockapi.io/ProductsTable/${id}`;

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(url, { method: "DELETE" });
                if (response.ok) {
                    setProducts((products) => products.filter((product) => product.id !== id));
                    Swal.fire("Deleted!", "The product has been deleted.", "success");
                } else {
                    console.error("Failed to delete product");
                    Swal.fire("Error!", "Failed to delete product.", "error");
                }
            }
        });
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    // Show loading page until data is loaded
    if (loading) {
        return <LoadingPage />;
    }

    return (
        <section className="products py-5">
            <div className="container">
                <div className="row text-center">
                    <div className="col-12 mb-4">
                        <h2 className="section-title">Our Products Table</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col lg-3">
                        <label htmlFor="name">Name</label>
                        <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="name" />
                    </div>
                    <div className="col lg-3">
                        <label htmlFor="quantity">Quantity</label>
                        <input className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" id="quantity" />
                    </div>
                    <div className="col lg-3">
                        <label htmlFor="price">Price</label>
                        <input className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} type="text" id="price" />
                    </div>
                    <div className="col lg-3">
                        <button className="btn btn-success mt-4" onClick={saveProduct}>
                            {editId ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    <table className="table table-bordered table-hover table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <button className="btn btn-outline-success mx-3" onClick={() => editProduct(product)}>Edit</button>
                                        <button className="btn btn-danger" value={product.id} onClick={deleteProduct}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default ProductsTable
