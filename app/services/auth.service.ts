import { pool } from "../lib/db";
import { hashPassword, verifyPassword } from "../lib/auth";

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
    [email, hashedPassword, name]
  );

  return result.rows[0];
};

export const authenticateUser = async (
  loginData: LoginData
): Promise<User | null> => {
  const { email, password } = loginData;

  const result = await pool.query(
    "SELECT id, email, name, password, created_at FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  };
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query(
    "SELECT id, email, name, created_at FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
};
