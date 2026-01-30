import { pool } from '../db';

/**
 * Email Notifications Repository
 *
 * Data access layer for email_notifications table.
 * All queries use parameterized SQL to prevent injection.
 */

export interface EmailNotificationCreate {
  type: 'lead_notification' | 'job_application' | 'system';
  recipient: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  metadata?: Record<string, any>;
}

/**
 * Create a new email notification record.
 *
 * @param data - Email notification data
 * @returns ID of created record
 */
export const create = async (data: EmailNotificationCreate): Promise<number> => {
  const sql = `
    INSERT INTO email_notifications (type, recipient, subject, body, status, metadata)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;

  const result = await pool.query(sql, [
    data.type,
    data.recipient,
    data.subject,
    data.body,
    data.status,
    data.metadata ? JSON.stringify(data.metadata) : null,
  ]);

  return result.rows[0].id;
};

/**
 * Update email notification status.
 *
 * @param id - Notification ID
 * @param status - New status
 * @param sentAt - Timestamp when email was sent (for 'sent' status)
 * @param errorMessage - Error message (for 'failed' status)
 */
export const updateStatus = async (
  id: number,
  status: 'pending' | 'sent' | 'failed',
  sentAt: Date | null,
  errorMessage?: string
): Promise<void> => {
  const sql = `
    UPDATE email_notifications
    SET status = $1, sent_at = $2, error_message = $3
    WHERE id = $4
  `;

  await pool.query(sql, [status, sentAt, errorMessage || null, id]);
};

/**
 * Get email notification by ID.
 *
 * @param id - Notification ID
 */
export const findById = async (id: number) => {
  const sql = `
    SELECT 
      id, type, recipient, subject, body, status, 
      error_message, metadata, sent_at, created_at
    FROM email_notifications
    WHERE id = $1
  `;

  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
};

/**
 * List email notifications with filters and pagination.
 *
 * @param filters - Query filters
 */
export const list = async (filters: {
  type?: string;
  status?: string;
  limit: number;
  offset: number;
}) => {
  let sql = `
    SELECT 
      id, type, recipient, subject, status, 
      error_message, sent_at, created_at
    FROM email_notifications
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.type) {
    sql += ` AND type = $${paramIndex++}`;
    params.push(filters.type);
  }

  if (filters.status) {
    sql += ` AND status = $${paramIndex++}`;
    params.push(filters.status);
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(filters.limit, filters.offset);

  const result = await pool.query(sql, params);
  return result.rows;
};

/**
 * Count email notifications with filters.
 */
export const count = async (filters: { type?: string; status?: string }): Promise<number> => {
  let sql = `SELECT COUNT(*) FROM email_notifications WHERE 1=1`;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.type) {
    sql += ` AND type = $${paramIndex++}`;
    params.push(filters.type);
  }

  if (filters.status) {
    sql += ` AND status = $${paramIndex++}`;
    params.push(filters.status);
  }

  const result = await pool.query(sql, params);
  return parseInt(result.rows[0].count, 10);
};
