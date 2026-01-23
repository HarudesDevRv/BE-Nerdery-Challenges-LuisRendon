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

//Alternative for working with limited possible values
type Countries = "USA" | "Japan" | "Germany";
type LimitedCountriesInfo = Record<Countries, number>;

type CountryInfo = Record<string, number>;

export async function getCountriesWithBrandsAndProductCount(
  brands: Brand[],
  products: Product[],
): Promise<CountryInfo> {
  let countries: CountryInfo = {};
  //Filter the products whose brand isn't active
  let filteredBrandsIndexes: Map<number, number> = new Map<number, number>();
  brands.forEach((brand, index) => {
    if (brand.isActive && brand.headquarters != "")
      filteredBrandsIndexes.set(
        typeof brand.id == "string" ? parseInt(brand.id) : brand.id,
        index,
      );
  });
  for (let product of products) {
    //Dynamically fill the CountryInfo object
    if (product.isActive) {
      let brandIndex: number | undefined = filteredBrandsIndexes.get(
        product.brandId,
      );
      console.log(brandIndex);
      if (brandIndex != undefined && brandIndex >= 0) {
        let brand: Brand = brands[brandIndex];
        let country: string = brand.headquarters.slice(
          brand.headquarters.indexOf(",") + 2,
        );
        if (countries[country]) {
          countries[country]++;
        } else {
          countries[country] = 1;
        }
      }
    }
  }
  return countries;
}
