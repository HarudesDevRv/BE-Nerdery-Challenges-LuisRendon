/**
 *  Challenge 4: Get Countries with Brands and Amount of Products
 *
 * Create a function that takes an array of brands and products, and returns the countries with the amount of products available in each country.
 *
 * Requirements:
 * - The function should accept an array of Brand objects and an array of Product objects.
 * - Each brand should have a country property.
 * - Each product should have a brandId property that corresponds to the id of a brand.
 * - The function should return an array of objects, each containing a country and the amount of products available in that country.
 * - The amount of products should be calculated by counting the number of products that have a brandId matching the id of a brand in the same country.
 * - The return should be a type that allow us to define the country name as a key and the amount of products as a value.
 */

import { Brand, Product } from "./1-types";

export async function getCountriesWithBrandsAndProductCount(
  brands: Brand[],
  products: Product[],
): Promise<{ country: string; products: number }[]> {
  let filteredBrands = brands.filter((brand) => brand.headquarters != "");
  let filteredProducts = products.filter(
    (product) =>
      filteredBrands.findIndex((brand) => brand.id == product.brandId) >= 0,
  );
  console.log(filteredProducts.length);
  let countries = new Map<string, number>();
  for (let product of filteredProducts) {
    let brand = filteredBrands.find((brand) => brand.id == product.brandId);
    let country = brand!.headquarters.slice(
      brand!.headquarters.indexOf(",") + 2,
    );
    if (countries.has(country)) {
      countries.set(country, countries.get(country)! + 1);
    } else {
      countries.set(country, 1);
    }
  }

  return [...countries].map((country) => ({
    country: country[0],
    products: country[1],
  }));
}
