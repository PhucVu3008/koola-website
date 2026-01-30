import { pool } from '../db';
import bcrypt from 'bcrypt';
import type { AdminUserCreate, AdminUserUpdate } from '../schemas/users.schemas';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  roles: { id: number; name: string; description: string | null }[];
}

interface CreateUserParams {
  createdBy: number;
  data: AdminUserCreate;
}

interface UpdateUserParams {
  id: number;
  updatedBy: number;
  data: AdminUserUpdate;
}

interface ListUsersParams {
  page: number;
  pageSize: number;
  role?: string;
  isActive?: boolean;
}

/**
 * List users with pagination and filters
 */
export async function listUsers(params: ListUsersParams) {
  const { page, pageSize, role, isActive } = params;
  const offset = (page - 1) * pageSize;

  let whereClause = 'WHERE 1=1';
  const values: any[] = [];
  let paramIndex = 1;

  if (role) {
    whereClause += ` AND r.name = $${paramIndex}`;
    values.push(role);
    paramIndex++;
  }

  if (isActive !== undefined) {
    whereClause += ` AND u.is_active = $${paramIndex}`;
    values.push(isActive);
    paramIndex++;
  }

  // Get total count
  const countQuery = `
    SELECT COUNT(DISTINCT u.id)
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    ${whereClause}
  `;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count);

  // Get paginated users
  const query = `
    SELECT 
      u.id,
      u.email,
      u.full_name,
      u.is_active,
      u.last_login_at,
      u.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', r.id,
            'name', r.name,
            'description', r.description
          )
          ORDER BY r.id
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'::json
      ) as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    ${whereClause}
    GROUP BY u.id, u.email, u.full_name, u.is_active, u.last_login_at, u.created_at
    ORDER BY u.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  values.push(pageSize, offset);
  const result = await pool.query(query, values);

  return {
    users: result.rows as User[],
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

/**
 * Get user by ID with roles
 */
export async function getUserById(id: number): Promise<User | null> {
  const query = `
    SELECT 
      u.id,
      u.email,
      u.full_name,
      u.is_active,
      u.last_login_at,
      u.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', r.id,
            'name', r.name,
            'description', r.description
          )
          ORDER BY r.id
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'::json
      ) as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = $1
    GROUP BY u.id, u.email, u.full_name, u.is_active, u.last_login_at, u.created_at
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

/**
 * Create a new user with roles
 */
export async function createUser(params: CreateUserParams): Promise<number> {
  const { data } = params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Insert user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [data.email, passwordHash, data.full_name, data.is_active]
    );

    const userId = userResult.rows[0].id;

    // Insert user roles
    for (const roleId of data.role_ids) {
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userId, roleId]
      );
    }

    await client.query('COMMIT');
    return userId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Update user with optional role changes
 */
export async function updateUser(params: UpdateUserParams): Promise<boolean> {
  const { id, data } = params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      values.push(data.email);
      paramIndex++;
    }

    if (data.full_name !== undefined) {
      updates.push(`full_name = $${paramIndex}`);
      values.push(data.full_name);
      paramIndex++;
    }

    if (data.is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      values.push(data.is_active);
      paramIndex++;
    }

    if (updates.length > 0) {
      updates.push(`updated_at = NOW()`);
      values.push(id);

      const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
      `;

      const result = await client.query(query, values);
      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return false;
      }
    }

    // Update roles if provided
    if (data.role_ids !== undefined) {
      // Delete existing roles
      await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

      // Insert new roles
      for (const roleId of data.role_ids) {
        await client.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, roleId]
        );
      }
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete user (soft delete by setting is_active = false, or hard delete)
 */
export async function deleteUser(id: number): Promise<boolean> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete user roles first (foreign key constraint)
    await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

    // Delete refresh tokens
    await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);

    // Delete user
    const result = await client.query('DELETE FROM users WHERE id = $1', [id]);

    await client.query('COMMIT');
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(id: number, newPassword: string): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1, updated_at = NOW()
     WHERE id = $2`,
    [passwordHash, id]
  );

  return (result.rowCount ?? 0) > 0;
}

/**
 * Toggle user active status
 */
export async function toggleUserActive(id: number): Promise<{ is_active: boolean } | null> {
  const result = await pool.query(
    `UPDATE users
     SET is_active = NOT is_active, updated_at = NOW()
     WHERE id = $1
     RETURNING is_active`,
    [id]
  );

  return result.rows[0] || null;
}

/**
 * List all available roles
 */
export async function listRoles() {
  const result = await pool.query(
    `SELECT id, name, description
     FROM roles
     ORDER BY id`
  );

  return result.rows;
}
