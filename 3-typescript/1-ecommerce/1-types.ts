/**
 * Challenge 1: Type Definitions for Product Catalog
 *
 * You need to define proper TypeScript types for the product catalog data.
 * These types should accurately represent the structure of the JSON data and establish
 * the relationships between different entities (e.g., products and brands).
 *
 * The JSON data is provided in the `data` folder.
 *
 * Consider:
 * - Handle all of the properties in the JSON data as accurately as possible in typescript types
 * - Use appropriate types for each property (e.g., string, number, boolean, etc.)
 * - Optional properties and mandatory properties
 * - The use of union types for properties that can have multiple types
 * - The use of enums for properties that can have a limited set of values
 * - The use of interfaces and type aliases to create a clear and maintainable structure
 */

// PRODUCTS JSON
interface Image {
  id: number;
  url: string;
  alt: string;
  isMain: boolean;
}

interface Specifications {
  material: string;
  weight: string;
  cushioning: string;
  closure: string;
}

interface Product {
  id: number;
  name: string;
  departmentId: number;
  categoryId: number;
  brandId: number;
  linkId: string;
  refId: string;
  isVisible: boolean;
  description: string;
  descriptionShort: string;
  releaseDate: string;
  keywords: string;
  title: string;
  isActive: boolean;
  taxCode: string;
  metaTagDescription: string;
  supplierId: number;
  showWithoutStock: boolean;
  adWordsRemarketingCode: string;
  lomadeeCampaignCode: string;
  score: number;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  colors: string[];
  sizes: number[];
  tags: string[];
  images: Image[];
  specifications: Specifications;
}
//! Add necessary type definitions for the products json file

// CATEGORIES JSON
interface Category {
  id: number;
  name: string;
  departmentId: number;
  description: string;
  keywords: string;
  isActive: boolean;
  iconUrl: string;
  bannerUrl: string;
  displayOrder: number;
  metaDescription: string;
  filters: {
    name: string;
    values: string[];
  }[];
}
//! Add necessary type definitions for the brands json file

// BRANDS JSON
interface Brand {
  id: string | number;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  website: string;
  isActive: boolean;
  headquarters: string;
  signature: string;
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
}
//! Add necessary type definitions for the brands json file

// DEPARTMENTS JSON
interface Department {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  iconUrl: string;
  bannerUrl: string;
  metaDescription: string;
  featuredCategories: number[];
  slug: string;
}
//! Add necessary type definitions for the departments json file

export { Product, Department, Brand, Category };
