import React, { useState, useEffect } from 'react'
import axios from 'axios'

/**
 * This component displays a list of products fetched from an API using axios. 
 * It allows the user to select and delete one or more products from the list. 
 * When the user clicks the "MASS DELETE" button, it deletes all the selected 
 * products from the API in parallel using Promise.all with async/await.
 *
 * Props:
 * - api_url: string - the URL to fetch products from
 * - setRoute: function - a function to set the current route in the parent component
 *
 * State:
 * - products: array - an array of product objects fetched from the API
 * - selectedProducts: array - an array of product SKUs that are currently selected for deletion
 * - isDeleting: boolean - a flag indicating whether a mass delete operation is currently in progress
 *
 * Methods:
 * - handleSelectProduct: function - updates the selectedProducts state when a product checkbox is clicked
 * - deleteProduct: function - deletes a single product from the API using axios
 * - handleMassDeleteClicked: function - deletes all selected products in parallel using Promise.all with async/await
 * - ProductDisplay: function - renders the list of products as HTML
 *
 * @returns React Component
 */
const ProductList = (props) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([])
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // Fetch the products data from the API when the component mounts
        const fetchProducts = async () => {
            await axios.get(props.api_url)
                .then((res) => {
                    console.log(res)
                    setProducts(res.data);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Something went wrong.\n Could not fetch product list.\n Please check console logs for more information around this error.')
                });
        }

        fetchProducts()
    }, []);

    const handleSelectProduct = (e) => {
        // Handle when a user selects or deselects a product from the list
        let item = e.target
        let tempList = [...selectedProducts]

        if (tempList.includes(item.name)) {
            tempList.splice(tempList.indexOf(item.name), 1);
        } else {
            tempList.push(item.name)
        }
        setSelectedProducts(tempList)
    }

    const deleteProduct = async (productSku) => {
        // Delete a product from the API based on its SKU
        await axios.delete(`${props.api_url}?sku=${productSku}`)
            .then(response => {
                if (response.data.status === 1) {
                    console.log('Product: ' + productSku + ' deleted')
                    // remove the deleted product from the products array
                    setProducts(prevProducts => prevProducts.filter(product => product.sku !== productSku));
                    setSelectedProducts(prevProducts => prevProducts.filter(product => product.sku !== productSku));
                } else {
                    alert('Could not delete product SKU: ' + productSku)
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.error(error);
                alert('Something went wrong.\n Could not delete product :' + productSku)
            });
    }

    const handleMassDeleteClicked = async () => {
        // Handle when the user clicks the "Mass Delete" button
        if (!selectedProducts.length) {
            alert('No products selected to delete.')
            return;
        }

        let deletedProducts = []
        setIsDeleting(true);

        try {
            // Delete all selected products in parallel using Promise.all
            await Promise.all(selectedProducts.map(async (product_sku) => {
                await deleteProduct(product_sku)
                    .then(() => { deletedProducts.push(product_sku); });
            }));
            setIsDeleting(false);            
        } catch (error) {
            console.error(error);
            alert('Something went wrong with the delete request. Please check the console log data for more information.');
        } finally {
            alert('Successfully deleted products: \n' + deletedProducts.join(', '));
        }
    }

    const ProductDisplay = () => {
        // Render the list of products with checkboxes for selecting products to delete
        return products.map(product =>
            <div className='product_item_display' key={product.sku}>
                <input name={product.sku} type='checkbox' className='delete-checkbox' onChange={handleSelectProduct} checked={selectedProducts.includes(product.sku)}></input>
                <ul>
                    <li>{product.sku}</li>
                    <li>{product.name}</li>
                    <li>${product.price.toFixed(2)}</li>
                    <li>{product.description}</li>
                </ul>
            </div>
        )
    }

    return (
        <div className='ProductList'>
            <div className="header">
                <h2>Product List</h2>
                <div className='buttons'>
                    <button onClick={() => props.setRoute('/add')} className='btn'>
                        ADD
                    </button>
                    <button className={/*(isDeleting || selectedProducts.length === 0) ? 'disabled' : */''} onClick={handleMassDeleteClicked}>
                        MASS DELETE
                    </button>
                </div>
            </div>
            <hr />

            <div className='gallery'>

                {ProductDisplay()}
            </div>
            
        </div>
    )
}

export default ProductList