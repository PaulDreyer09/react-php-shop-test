<?php
/**
 * The Product class represents a product with basic properties such as SKU, name, price, type, size, weight, height, width and length.
 */
abstract class Product
{
    protected $sku;
    protected $name;
    protected $price;
    protected $product_type;
    protected $size;
    protected $height;
    protected $width;
    protected $length;
    protected $weight;

    /**
     * Constructor method to initialize the properties of the product class.
     *
     * @param string $sku - The stock keeping unit of the product.
     * @param string $name - The name of the product.
     * @param float $price - The price of the product.
     * @param string $product_type - The type of the product.
     * @param float $size - The size of the product (if applicable).
     * @param float $height - The height of the product (if applicable).
     * @param float $width - The width of the product (if applicable).
     * @param float $length - The length of the product (if applicable).
     * @param float $weight - The weight of the product (if applicable).
     */
    public function __construct($sku, $name, $price, $product_type, $size = 0, $height = 0, $width = 0, $length = 0, $weight = 0)
    {
        $this->sku = $sku;
        $this->name = $name;
        $this->price = $price;
        $this->product_type = $product_type;
        $this->size = $size;
        $this->height = $height;
        $this->width = $width;
        $this->length = $length;
        $this->weight = $weight;
    }

    /**
     * Returns the SKU of the product.
     *
     * @return string
     */
    public function getSku()
    {
        return $this->sku;
    }

    /**
     * Returns the name of the product.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Returns the price of the product.
     *
     * @return float
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Returns the type of the product.
     *
     * @return string
     */
    public function getproduct_type()
    {
        return $this->product_type;
    }

    /**
     * Abstract method to be implemented by the product subclasses to get the description of the product.
     */
    abstract public function getDescription();
}

/**
 * The Book class is a subclass of Product which represents a book product.
 */
class Book extends Product
{
    /**
     * Constructor method to initialize the properties of the book class.
     *
     * @param string $sku - The stock keeping unit of the book.
     * @param string $name - The name of the book.
     * @param float $price - The price of the book.
     * @param string $product_type - The type of the book.
     * @param float $weight - The weight of the book.
     */
    public function __construct($sku, $name, $price, $product_type, $weight = 0)
    {
        parent::__construct($sku, $name, $price, $product_type, 0,0,0,0,$weight); 
    }

    /**
     * Returns the description of the book.
     *
     * @return string
     */
    public function getDescription()
    {
        return "Weight: {$this->weight}KG";
    }
}

class Furniture extends Product
{
    public function __construct($sku, $name, $price, $product_type, $height = 0, $width = 0, $length = 0)
    {
        parent::__construct($sku, $name, $price, $product_type, 0, $height, $width, $length);
    }

    public function getDescription()
    {
        return "Dimensions: {$this->height}x{$this->width}x{$this->length}";
    }
}

class Dvd extends Product
{
    public function __construct($sku, $name, $price, $product_type, $size = 0)
    {
        parent::__construct($sku, $name, $price, $product_type, $size);
    }

    public function getDescription()
    {
        return "Size: {$this->size} MB";
    }
}
/**
 *
 *Factory method for Product subclasses
 */
class ProductFactory
{
    public static function createProduct($sku, $name, $price, $product_type, $size = 0, $height = 0, $width = 0, $length = 0, $weight = 0)
    {
        switch ($product_type) {
            case 'Book':
                return new Book($sku, $name, $price, $product_type, $weight);
            case 'Furniture':
                return new Furniture($sku, $name, $price, $product_type, $height, $width, $length);
            case 'DVD':
                return new DVD($sku, $name, $price, $product_type, $size);
            default:
                throw new Exception("Invalid product type: " . $product_type);
        }
    }
}
// Example usage:
// $product = Product::createProduct('book', 'B001', 'The Catcher in the Rye', 9.99, 6, 0, 0, 0, 0);
// echo $product->getDescription();

?>