import React from 'react'
import { useFormik } from 'formik'

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
    }
    console.log('Errors: ' + JSON.stringify(errors))

    if (!values.productType) {
        errors.productType = 'Required';
    }

    switch (values.productType) {
        case 'DVD':
            if (!values.size) {
                errors.size = 'Required';
            }
            break;
        case 'Furniture':
            if (!values.height) {
                errors.height = 'Required';
            }

            if (!values.width) {
                errors.width = 'Required';
            }

            if (!values.length) {
                errors.length = 'Required';
            }
            break;
        case 'Book':
            if (!values.weight) {
                errors.weight = 'Required';
            }
            break;
        default:
            break;

    }

    return errors;
}

const ProductAdd = () => {
    //Can replace with DB Types model
    const ProductTypes = [
        'Book',
        'DVD',
        'Furniture'
    ]

    const onSubmit = (data) => {
        alert(JSON.stringify(data, null, 2))
    }

    const numberRegex = '([0-9]*[.])?[0-9]+'
    const formik = useFormik({
        initialValues: {
            sku: '',
            name: '',
            price: '',
            productType: ProductTypes[0],
            size: '',
            height: '',
            width: '',
            length: '',
            weight: '',
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
        return ProductTypes.map((productType, index) => {
            return <option id={productType} value={productType} name='productType' key={index}>{productType}</option>
        })
    }

    const handleSubmitClicked = async (e) => {
        console.log(formik.errors.toString())
        console.log(formik.errors)
        formik.handleSubmit(e)

    }

    return (
        <div className='ProductAdd'>
            <div className='header'>
                <h2>Product Add</h2>
                <div className='buttons'>
                    <a type='submit' value='Save' onClick={handleSubmitClicked}>Submit</a>
                    <a href='/'>Cancel</a>
                </div>
            </div>
            <hr/>
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
                    <label htmlFor='productType'>Type Switcher</label>
                    <select className={formik.touched.productType && formik.errors.productType ? ' validation-error' : ''}
                        id='productType'
                        name='productType'
                        {...formik.getFieldProps('productType')}
                    >
                        {getProductTypeOptions()}
                    </select>
                </div>

                <div id='details'>
                    {/* {productDetailsInputSections['DVD']} */}
                    {productDetailsInputSections[formik.values.productType]}
                </div>
                <div className='validation-message'>{!(JSON.stringify(formik.errors) == '{}') ? 'Please, submit required data' : ''}</div>
            </form>
            <hr/>
        </div>
    )
}

export default ProductAdd