import { pool } from "../lib/db";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  img_src: string;
  category_id: number;
  is_on_sale: boolean;
  features: string[];
  created_at: Date;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  description: string;
  img_src: string;
  created_at: Date;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const result = await pool.query(`
    SELECT * FROM products 
    ORDER BY created_at DESC
  `);

  return result.rows;
};

export const getProductsByCategory = async (
  categorySlug: string
): Promise<Product[]> => {
  const result = await pool.query(
    `
    SELECT p.* FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = $1
    ORDER BY p.created_at DESC
  `,
    [categorySlug]
  );

  return result.rows;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

  return result.rows[0] || null;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const result = await pool.query(`
    SELECT * FROM categories 
    ORDER BY title
  `);

  return result.rows;
};

export const getCategoryBySlug = async (
  slug: string
): Promise<Category | null> => {
  const result = await pool.query("SELECT * FROM categories WHERE slug = $1", [
    slug,
  ]);

  return result.rows[0] || null;
};

export const getFeaturedProducts = async (
  limit: number = 4
): Promise<Product[]> => {
  const result = await pool.query(
    `
    SELECT * FROM products 
    ORDER BY created_at DESC 
    LIMIT $1
  `,
    [limit]
  );

  return result.rows;
};
