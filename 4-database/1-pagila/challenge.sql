
/*
    Challenge 1.
    Write a SQL query that counts the number of films in each category in the Pagila database.
    - The query should return two columns: category and film_count
    - category should display the name of each category
    - film_count should show the total number of films in that category
    - Results should be grouped by category name
 */


-- your query here

SELECT c.name category, COUNT(c.category_id) film_count 
FROM film f INNER JOIN film_category fc USING(film_id)
INNER JOIN category c USING(category_id)
GROUP BY c.category_id;

 /*
    Challenge 2.
    Write a SQL query that finds the top 5 customers who have spent the most money in the Pagila database.
    - The query should return three columns: first_name, last_name, and total_spent
    - total_spent should show the sum of all payments made by that customer
    - Results should be ordered by total_spent in descending order
    - The query should limit results to only the top 5 highest-spending customers
 */

 -- your query here


SELECT c.first_name, c.last_name, SUM(p.amount) total_spent
FROM customer c INNER JOIN payment p USING(customer_id)
GROUP BY c.customer_id
ORDER BY total_spent DESC
LIMIT 5;


/*
    Challenge 3.
    Write a SQL query that lists all film titles that have been rented in the past 10 years in the Pagila database.
    - The query should return one column: title
    - title should display the name of each film that has been rented
    - The time period for "recent" should be within the last 10 years from the current date
    - Results should only include films that have rental records in this time period
*/


-- your query here

SELECT f.title
FROM rental r INNER JOIN inventory i USING(inventory_id)
INNER JOIN film f USING(film_id)
GROUP BY f.title
HAVING CURRENT_DATE - MAX(r.rental_date) < '10 years';

/*
    Challenge 4.
    Write a SQL query that lists all films that have never been rented in the Pagila database.
    - The query should return two columns: title and inventory_id
    - title should display the name of each film that has never been rented
    - inventory_id should show the inventory ID of the specific copy
*/


-- your query here


SELECT f.title
FROM rental r LEFT JOIN inventory i USING(inventory_id)
RIGHT JOIN film f USING(film_id)
WHERE rental_id IS NULL;


/*
    Challenge 5.
    Write a SQL query that lists all films that were rented more times than the average rental count per film in the Pagila database.
    - The query should return two columns: title and rental_count
    - title should display the name of each film
    - rental_count should show the total number of times the film was rented
*/



-- your query here

WITH rental_by_film (rental_count) AS(
    SELECT COUNT(film_id) rental_count
    FROM rental
    INNER JOIN inventory USING(inventory_id)
    INNER JOIN film USING(film_id)
    GROUP BY film_id
)
SELECT f.title, COUNT(f.title) rental_count
FROM rental r
INNER JOIN inventory i USING(inventory_id)
INNER JOIN film f USING(film_id)
GROUP BY f.title
HAVING COUNT(f.title) > (
    SELECT AVG(rf.rental_count)
    FROM rental_by_film as rf
);


/*
    Challenge 6.
    Write a SQL query that calculates rental activity for each customer.
    - The query should return the customer's first_name and last_name
    - It should also return their first rental date as first_rental
    - Their most recent rental date should be shown as last_rental
    - The difference in days between the first and last rentals should be shown as rental_span_days
    - Results should be grouped by customer and ordered by rental_span_days in descending order
*/

-- your query here
WITH customer_first_and_last_rental as (
    SELECT customer.first_name, 
    customer.last_name,
    MIN(rental.rental_date) first_rental,
    MAX(rental.rental_date) last_rental
    FROM customer
    INNER JOIN rental USING(customer_id)
    GROUP BY (first_name, last_name)
)
SELECT 
first_name, 
last_name,
first_rental::DATE,
last_rental::DATE,
EXTRACT(DAYS FROM last_rental - first_rental) rental_span_days
FROM customer_first_and_last_rental
ORDER BY rental_span_days DESC;

/*
    Challenge 7.
    Find all customers who have not rented movies from every available genre.
    - The result should include the customer's first_name and last_name
    - Only include customers who are missing at least one genre in their rental history
*/


-- your query here

CREATE OR REPLACE VIEW category_rentals 
AS
SELECT c.name category_name, c.category_id, r.rental_id, r.customer_id
FROM rental r INNER JOIN inventory i USING (inventory_id)
INNER JOIN film f USING (film_id)
INNER JOIN film_category fc USING (film_id)
INNER JOIN category c USING (category_id)
;

WITH customer_categories_count AS(
    select COUNT(category_id) categories,
    cus.first_name, 
    cus.last_name
    FROM customer cus
    INNER JOIN category_rentals USING (customer_id)
    GROUP BY (cus.customer_id, category_id)
)
select first_name, last_name
FROM customer_categories_count
GROUP BY (first_name, last_name)
HAVING COUNT(categories) != (
    SELECT COUNT(*) 
    FROM category
);

/*
    Challenge 8.
    Create a materialized view that summarizes total rental revenue per film category.

    First, write a SQL query that returns the category name and the total revenue generated by rentals in that category.

    Use the following tables: payment, rental, inventory, film, film_category, and category.

    - Group the results by category name and order them by total revenue (descending).
    - Then, turn your query into a materialized view named revenue_by_category.
    - Query the materialized view to return:
    - All categories and their total revenue.
    - The top 3 categories by revenue.
    - Finally, refresh the materialized view manually using SQL.

    Once you finish the exercise, please answer the following questions: 
    
    When would you prefer a materialized view over a regular view? 
    How often should it be refreshed?
*/

-- your work here

SELECT cr.category_name, SUM(p.amount) revenue
FROM payment p INNER JOIN category_rentals cr USING(rental_id)
GROUP BY cr.category_name
ORDER BY SUM(p.amount) DESC;

DROP MATERIALIZED VIEW revenue_by_category;

CREATE MATERIALIZED VIEW revenue_by_category
AS
SELECT cr.category_name, SUM(p.amount) revenue
FROM payment p INNER JOIN category_rentals cr USING(rental_id)
GROUP BY cr.category_name
ORDER BY SUM(p.amount) DESC;

SELECT * FROM revenue_by_category;

SELECT * FROM revenue_by_category LIMIT 3;

REFRESH MATERIALIZED VIEW revenue_by_category;

/*
When would you prefer a materialized view over a regular view?
I would prefer materialized views on situations when the computing of the query takes so much time,
is used often and it doesn't need fully accurate information each time it's called. Eg. Statistics based
on monthly/yearly sales.

How often should it be refreshed?
It depends on how much time the data can be outdated before affecting the results, and how often the query
can be executed without interfering on the application performance.
*/