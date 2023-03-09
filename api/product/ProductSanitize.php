<?php

$product_fields = [
    'sku' => 'string',
    'name' => 'string',
    'price' => 'float',
    'product_type' => 'string',
    'size' => 'int',
    'height' => 'float',
    'width' => 'float',
    'length' => 'float',
    'weight' => 'float'
];

const FILTERS = [
    'string' => FILTER_SANITIZE_FULL_SPECIAL_CHARS,
    'int' => [
        'filter' => FILTER_SANITIZE_NUMBER_INT,
        'flags' => FILTER_REQUIRE_SCALAR
    ],
    'float' => [
        'filter' => FILTER_SANITIZE_NUMBER_FLOAT,
        'flags' => FILTER_FLAG_ALLOW_FRACTION
    ]
];

/**
 * Recursively trim strings in an array
 * @param array $items
 * @return array
 */
function array_trim(array $items): array
{
    return array_map(function ($item) {
        if (is_string($item)) {
            return trim($item);
        } elseif (is_array($item)) {
            return array_trim($item);
        } else
            return $item;
    }, $items);
}

/**
 * Sanitize the inputs based on the rules an optionally trim the string
 * @param array $inputs
 * @param array $fields
 * @param int $default_filter FILTER_SANITIZE_STRING
 * @param array $filters FILTERS
 * @param bool $trim
 * @return array
 */
function sanitize(array $inputs, array $fields = [], int $default_filter = FILTER_SANITIZE_FULL_SPECIAL_CHARS, array $filters = FILTERS, bool $trim = true): array
{
    if ($fields) {
        $options = array_map(function ($field) use ($filters) {
            return $filters[$field];
        }, $fields);
        $data = filter_var_array($inputs, $options);
    } else {
        $data = filter_var_array($inputs, $default_filter);
    }

    return $trim ? array_trim($data) : $data;
}
?>