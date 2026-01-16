/**
 *  Challenge 5: Get Departments with Product Count
 *
 * Create a function that takes an array of departments and products, and returns a new array of departments with the amount of products available in each department.
 *
 * Requirements:
 * - The function should accept an array of Department objects and an array of Product objects.
 * - Each department should include the quantity of products available in that department.
 * - The department should be idetified just by its name and id other properties should be excluded.
 * - In the information of the department, include the amount of products available in that department and just the name and id of the department.
 * - Add the name of the products in an array called productsNames inside the department object.
 */

import { Department, Product } from "./1-types";

type DepartmentWithProducts = {
  name: string;
  id: number;
  products: number;
  productsNames: string[];
};

export async function getDepartmentsWithProductCount(
  departments: Department[],
  products: Product[],
): Promise<DepartmentWithProducts[]> {
  //For each department, filter the products which aren't available there and count them
  let departmentsWithProducts: DepartmentWithProducts[] = departments.map(
    (department) => {
      let name: string = department.name;
      let id: number = department.id;
      let productsNames: string[] = products
        .filter((product) => product.departmentId == department.id)
        .map((product) => product.name);
      let DepartmentWithProducts = {
        name,
        id,
        products: productsNames.length,
        productsNames,
      };
      return DepartmentWithProducts;
    },
  );
  return departmentsWithProducts;
}
