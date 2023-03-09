import React, { useState } from 'react'
import { useFormik } from 'formik'

/**
 * This function validates the form data submitted by the user and 
 * returns an errors object with error messages for each invalid field.
 * @function validate
 * @param {Object} values - An object with the form data entered by the user
 * @param {string} values.sku - The SKU of the product
 * @param {string} values.name - The name of the product
 * @param {number} values.price - The price of the product
 * @param {string} values.product_type - The type of the product ('Book', 'DVD', or 'Furniture')
 * @param {number} values.size - The size of the product (required if product_type is 'DVD')
 * @param {number} values.height - The height of the product (required if product_type is 'Furniture')
 * @param {number} values.width - The width of the product (required if product_type is 'Furniture')
 * @param {number} values.length - The length of the product (required if product_type is 'Furniture')
 * @param {number} values.weight - The weight of the product (required if product_type is 'Book')
 * @returns {Object} An object with error messages for each invalid field
 */
const validate = values => {
    const errors = {}
    
    if (!values.sku) {
        errors.sku = 'Required';
    }

    if (!values.name) {
        errors.name = 'Required';
    }

    if (!values.price) {
        errors.price = 'Required';
    } else if (isNaN(values.price)) { // Price should be a number
        errors.price = 'Needs to be a number';
    }

    if (!values.product_type) {
        errors.product_type = 'Required';
    }

    // Additional validations for specific product types
    switch (values.product_type) {
        case 'DVD':
            if (!values.size) {
                errors.size = 'Required';
            } else if (isNaN(values.size)) { // Size should be a number
                errors.size = 'Needs to be a number';
            }
            break;
        case 'Furniture':
            if (!values.height) {
                errors.height = 'Required';
            } else if (isNaN(values.height)) { // Height should be a number
                errors.height = 'Needs to be a number';
            }

            if (!values.width) {
                errors.width = 'Required';
            } else if (isNaN(values.width)) { // Width should be a number
                errors.width = 'Needs to be a number';
            }

            if (!values.length) {
                errors.length = 'Required';
            } else if (isNaN(values.length)) { // Length should be a number
                errors.length = 'Needs to be a number';
            }
            break;
        case 'Book':
            if (!values.weight) {
                errors.weight = 'Required';
            } else if (isNaN(values.weight)) { // Weight should be a number
                errors.weight = 'Needs to be a number';
            }
            break;
        default:
            break;
    }

    return errors;
}


/**
 * This module defines a form to add a product to the database via API, 
 * with fields for SKU, name, price, product type, and additional details depending on the product type.
 * It uses the useFormik hook from Formik library for form handling, and sends a POST request to the API with the form data when submitted.
 * The form data is validated by the validate function based on rules for required fields and specific types of products.
 * If the input values are not valid, error messages will be displayed.
 * 
 * @module ProductAdd
 * @param {Object} props - The component's properties object
 * @param {string} props.api_url - The URL of the API endpoint to send the form data to
 * @returns {JSX.Element} A form element with fields for SKU, name, price, product type, and additional details depending on the product type, and a submit button
 */
const ProductAdd = (props) => {


    //Can replace with DB Types model
    const [is_submitting, setIsSubmitting] = useState(false);
    const [product_types, setProductTypes] = useState([
        'Book',
        'DVD',
        'Furniture'
    ]);

    const onSubmit = async (input) => {
        setIsSubmitting(true)
        //Conver numerical string data to number
        let data = {
            ...input,
            price: parseFloat(input.price),
            size: parseFloat(input.size),
            height: parseFloat(input.height),
            width: parseFloat(input.width),
            length: parseFloat(input.length),
            weight: parseFloat(input.weight),
        };

        //Check numerical data before sending to api
        Object.getOwnPropertyNames(data).forEach(propName => {

            if (typeof data[propName] === 'number' && isNaN(data[propName])) {
                alert(`Error: ${propName} needs to be a number, please check the entered value and try again`)
                return
            }

        })

        // Send a POST request to the API with the form data
        fetch(props.api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((data) => { // response data
                setIsSubmitting(false)
                console.log(data)
                if (data.status === 200) {
                    alert('Record created successfully.');
                } else if (data.status === 409) {
                    alert('Failed to create record: Duplicate SKU supplied');
                }else{
                    alert('Failed to create record.');
                }
            })
            .catch((error) => {
                setIsSubmitting(false)
                console.error(error.response)
                if (error.response && error.response.status === 409) {
                    alert('Error: Duplicate SKU supplied.');
                } else {
                    alert('Error: Failed to create record.');

                }
            });
    }

    const numberRegex = '([0-9]*[.])?[0-9]+'
    const formik = useFormik({
        initialValues: {
            sku: '',
            name: '',
            price: 0,
            product_type: product_types[0],
            size: 0,
            height: 0,
            width: 0,
            length: 0,
            weight: 0,
        },
        validate,
        onSubmit: onSubmit
    })

    const productDetailsInputSections = {
        Book:
            <div>
                <div className='form-control'>
                    <label htmlFor='weight'>Weight (KG)</label>
                    <input className={formik.touched.weight && formik.errors.weight ? ' validation-error' : ''}
                        type='text'
                        name='weight'
                        pattern={numberRegex}
                        {...formik.getFieldProps('weight')} />

                </div>
                <p>Please, provide weight in KG</p>
            </div>,
        DVD:
            <div>
                <div className='form-control'>
                    <label htmlFor='size'>Size (MB)</label>
                    <input className={formik.touched.size && formik.errors.size ? ' validation-error' : ''} type='text' name='size' pattern={numberRegex}  {...formik.getFieldProps('size')}></input>

                </div>
                <p>Please, provide size in MB</p>
            </div>,
        Furniture:
            <div>
                <div className='form-control'>
                    <label htmlFor='height'>Height (CM)</label>
                    <input className={formik.touched.height && formik.errors.height ? ' validation-error' : ''} type='text' name='height' pattern={numberRegex}  {...formik.getFieldProps('height')}></input>

                </div>
                <div className='form-control'>
                    <label htmlFor='width'>Width (CM)</label>
                    <input className={formik.touched.width && formik.errors.width ? ' validation-error' : ''} type='text' name='width' pattern={numberRegex}  {...formik.getFieldProps('width')}></input>

                </div>
                <div className='form-control'>
                    <label htmlFor='length'>Length (CM)</label>
                    <input className={formik.touched.length && formik.errors.length ? ' validation-error' : ''} type='text' name='length' pattern={numberRegex}  {...formik.getFieldProps('length')}></input>

                </div>
                <p>Please, provide dimentions in CM</p>
            </div>,
    }

    const getProductTypeOptions = () => {
        return product_types.map((product_type, index) => {
            return <option id={product_type} value={product_type} name='product_type' key={index}>{product_type}</option>
        })
    }

    const handleSubmitClicked = async (e) => {
        formik.handleSubmit(e);
    }

    return (
        <div className='ProductAdd'>
            <div className='header'>
                <h2>Product Add</h2>
                <div className='buttons'>
                    <a type='submit' className={(is_submitting) ? 'disabled' : ''} value='Save' onClick={handleSubmitClicked}>Submit</a>
                    <a onClick={() => props.setRoute('/')} >Cancel</a>
                </div>
            </div>
            <hr />
            <form id="product_form" onSubmit={handleSubmitClicked}>

                <div className='form-control'>
                    <label htmlFor="sku">Sku</label>
                    <input className={formik.touched.sku && formik.errors.sku ? ' validation-error' : ''}
                        id="sku"
                        name="sku"
                        type="text"
                        {...formik.getFieldProps('sku')}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="name">Name</label>
                    <input className={formik.touched.name && formik.errors.name ? ' validation-error' : ''}
                        id="name"
                        name="name"
                        type="text"
                        {...formik.getFieldProps('name')}
                    />

                </div>

                <div className='form-control'>
                    <label htmlFor="price">Price</label>
                    <input className={formik.touched.price && formik.errors.price ? ' validation-error' : ''}
                        id="price"
                        name="price"
                        type="text"
                        pattern={numberRegex}
                        {...formik.getFieldProps('price')}
                    />

                </div>

                <div className='form-control'>
                    <label htmlFor='product_type'>Type Switcher</label>
                    <select className={formik.touched.product_type && formik.errors.product_type ? ' validation-error' : ''}
                        id='product_type'
                        name='product_type'
                        {...formik.getFieldProps('product_type')}
                    >
                        {getProductTypeOptions()}
                    </select>
                </div>

                <div id='details'>
                    {productDetailsInputSections[formik.values.product_type]}
                </div>
                <div className='validation-message'>{!(JSON.stringify(formik.errors) == '{}') ? 'Please, submit required data' : ''}</div>
            </form>
            
        </div>
    )
}

export default ProductAdd