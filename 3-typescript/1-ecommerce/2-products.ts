/**
 * Products - Challenge 1: Product Price Analysis
 *
 * Create a function that analyzes pricing information from an array of products.
 *
 * Requirements:
 * - Create a function called `analyzeProductPrices` that accepts an array of Product objects
 * - The function should return an object containing:
 *   - totalPrice: The sum of all product prices
 *   - averagePrice: The average price of all products (rounded to 2 decimal places)
 *   - mostExpensiveProduct: The complete Product object with the highest price
 *   - cheapestProduct: The complete Product object with the lowest price
 *   - onSaleCount: The number of products that are currently on sale
 *   - averageDiscount: The average discount percentage for products on sale (rounded to 2 decimal places)
 * - Prices should be manage in regular prices and not in sale prices
 * - Use proper TypeScript typing for parameters and return values
 * - Implement the function using efficient array methods
 *
 *
 **/

import { Brand, Product } from "./1-types";

interface productPriceAnalysis {
  totalPrice: number;
  averagePrice: number;
  mostExpensiveProduct: Product | null;
  cheapestProduct: Product | null;
  onSaleCount: number;
  averageDiscount: number;
}

export async function analyzeProductPrices(
  products: Product[],
): Promise<productPriceAnalysis> {
  let totalPrice: number = 0;
  let totalDiscount: number = 0;
  let mostExpensiveProduct: Product | null = null;
  let cheapestProduct: Product | null = null;
  for (let product of products) {
    totalPrice += product.price;
    totalDiscount += product.salePrice
      ? product.price / product.salePrice - 1
      : 0;
    if (
      mostExpensiveProduct == null ||
      product.price > mostExpensiveProduct.price
    ) {
      mostExpensiveProduct = product;
    }
    if (cheapestProduct == null || product.price < cheapestProduct.price) {
      cheapestProduct = product;
    }
  }
  return {
    totalPrice: totalPrice,
    averagePrice: parseFloat((totalPrice / products.length).toFixed(2)),
    mostExpensiveProduct: mostExpensiveProduct,
    cheapestProduct: cheapestProduct,
    onSaleCount: products.length,
    averageDiscount: parseFloat((totalDiscount / products.length).toFixed(2)),
  };
}

/**
 *  Challenge 2: Build a Product Catalog with Brand Metadata
 *
 * Create a function that takes arrays of Product and Brand, and returns a new array of enriched product entries. Each entry should include brand details embedded into the product, under a new brandInfo property (excluding the id and isActive fields).
 *  e.g
 *  buildProductCatalog(products: Product[], brands: Brand[]): EnrichedProduct[]

  Requirements:
  - it should return an array of enriched product entries with brand details
  - Only include products where isActive is true and their corresponding brand is also active.
  - If a product’s brandId does not match any active brand, it should be excluded.
  - The brandInfo field should include the rest of the brand metadata (name, logo, description, etc.).
 */

interface catalogProduct extends Product {
  brandInfo: {
    name: string;
    logo: string;
    description: string;
    foundedYear: number;
    website: string;
    headquarters: string;
    signature: string;
    socialMedia: {
      instagram: string;
      twitter: string;
      facebook: string;
    };
  };
}
export async function buildProductCatalog(
  products: Product[],
  brands: Brand[],
): Promise<catalogProduct[]> {
  let activeProducts: Product[] = products.filter(
    (product) => product.isActive,
  );
  let activeBrands: Brand[] = brands.filter((brand) => brand.isActive);
  let productCatalog: catalogProduct[] = [];
  for (let product of activeProducts) {
    let brandIndex = activeBrands.findIndex(
      (brand) => brand.id == product.brandId,
    );
    if (brandIndex >= 0) {
      let { id, isActive, ...brandData } = activeBrands[brandIndex];
      productCatalog.push({
        ...product,
        brandInfo: brandData,
      });
    }
  }
  return productCatalog;
}

/**
 * Challenge 3: One image per product
 *
 * Create a function that takes an array of products and returns a new array of products, each with only one image.
 *
 * Requirements:
 * - The function should accept an array of Product objects.
 * - Each product should have only one image in the images array.
 * - The image should be the first one in the images array.
 * - If a product has no images, it should be excluded from the result.
 * - The function should return an array of Product objects with the modified images array.
 * - Use proper TypeScript typing for parameters and return values.
 */

export async function filterProductsWithOneImage(
  products: Product[],
): Promise<Product[]> {
  // Implement the function logic here

  return products.flatMap((product) =>
    product.images.length > 0
      ? [{ ...product, images: [product.images[0]] }]
      : [],
  );
}
