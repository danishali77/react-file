import { useState, useEffect } from "react";

function ProductsTable() {
    const [products, setProducts] = useState([]);

    async function fetchProducts() {
        const response = await fetch("https://671fe962e7a5792f052ff4d2.mockapi.io/ProductsTable");
        const data = await response.json();
        setProducts(data);
    }

    useEffect(() => {
        fetchProducts();
        console.log(products);
    });

    return (
        <section className="products py-5">
            <div className="container">
                <div className="row text-center">
                    <div className="col-12 mb-4">
                        <h2 className="section-title">Our Products Table</h2>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    <table className="table table-bordered table-hover table-stripped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        {Array.isArray(products) && products.map((products) => (
                            <tbody>
                                <tr>
                                <td>{products.id}</td>
                                <td>{products.title}</td>
                                <td>{products.quantity}</td>
                                <td>{products.id}</td>
                                <td className="">
                                    <div className="btn btn-outline-success mx-3">Edit</div>
                                    <div className="btn btn-danger">Delete</div>
                                </td>
                            </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </section>
    );
}

export default ProductsTable;
