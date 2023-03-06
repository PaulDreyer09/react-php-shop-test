import React, { useState } from 'react'

const ProductList = () => {

    const [products, setProducts] = useState([
        {
            sku: 'JVC200123',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000',
        },
        {
            sku: 'JVC200124',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
        {
            sku: 'JVC200125',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
        {
            sku: 'JVC200126',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
        {
            sku: 'JVC200127',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
        {
            sku: 'JVC200128',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
        {
            sku: 'JVC200129',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
        {
            sku: 'JVC200130',
            name: 'Acme DISC',
            price: 0,
            details: 'Size: 1000'
        },
    ]);

    const [selectedProducts, setSelectedProducts] = useState([])

    const handleSelectProduct = (e) => {
        let item = e.target
        let tempList = [...selectedProducts]

        if(tempList.includes(item.name)){
            tempList.splice(tempList.indexOf(item.name), 1);
        }else{
            tempList.push(item.name)
        }
        setSelectedProducts(tempList)
    }

    const handleMassDeleteClicked = (e) => {

        let tempList = [...products]
        selectedProducts.forEach(id => {
            tempList.forEach((item, index) => {
                if(item.sku === id){
                    tempList.splice(index, 1);
                }
            })            
        })
        setProducts(tempList)
    }

    const ProductDisplay = () => {
        return products.map(product => 
            <div className='product' key={product.sku}>
                <input name={product.sku} type='checkbox' className='delete-checkbox' onChange={handleSelectProduct} checked={selectedProducts.includes(product.sku)}></input>
                <ul>
                    <li>{product.sku}</li>
                    <li>{product.name}</li>
                    <li>{product.price}</li>
                    <li>{product.details}</li>
                </ul>
            </div>
        )
    }

    return (
        <div className='ProductList'>
            <div className="header">
                <h2>Product List</h2>
                <div className='buttons'>
                    <a href='./addproduct' className='btn'>
                        ADD
                    </a>
                    <a onClick={handleMassDeleteClicked}>
                        MASS DELETE
                    </a>
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