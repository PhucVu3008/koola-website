/**
 * Admin Jobs SQL Queries
 * 
 * CRUD operations for job_posts table
 */

/**
 * LIST_JOBS
 * 
 * Parameters:
 * - $1 locale
 * - $2 status (nullable)
 * - $3 limit
 * - $4 offset
 */
export const LIST_JOBS = `
  SELECT 
    id,
    locale,
    title,
    slug,
    slug_group,
    department,
    location,
    employment_type,
    level,
    summary,
    status,
    published_at,
    created_at,
    updated_at
  FROM job_posts
  WHERE locale = $1
    AND ($2::job_status IS NULL OR status = $2::job_status)
  ORDER BY created_at DESC
  LIMIT $3 OFFSET $4
`;

/**
 * COUNT_JOBS
 * 
 * Parameters:
 * - $1 locale
 * - $2 status (nullable)
 */
export const COUNT_JOBS = `
  SELECT COUNT(*) as count
  FROM job_posts
  WHERE locale = $1
    AND ($2::job_status IS NULL OR status = $2::job_status)
`;

/**
 * GET_JOB_BY_ID
 * 
 * Parameters:
 * - $1 id
 */
export const GET_JOB_BY_ID = `
  SELECT 
    id,
    locale,
    title,
    slug,
    slug_group,
    department,
    location,
    employment_type,
    level,
    summary,
    responsibilities_md,
    requirements_md,
    status,
    published_at,
    created_by,
    updated_by,
    created_at,
    updated_at
  FROM job_posts
  WHERE id = $1
`;

/**
 * CREATE_JOB
 * 
 * Parameters:
 * - $1 locale
 * - $2 title
 * - $3 slug
 * - $4 slug_group
 * - $5 department
 * - $6 location
 * - $7 employment_type
 * - $8 level
 * - $9 summary
 * - $10 responsibilities_md
 * - $11 requirements_md
 * - $12 status
 * - $13 published_at
 * - $14 created_by
 */
export const CREATE_JOB = `
  INSERT INTO job_posts (
    locale,
    title,
    slug,
    slug_group,
    department,
    location,
    employment_type,
    level,
    summary,
    responsibilities_md,
    requirements_md,
    status,
    published_at,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
    NOW(), NOW()
  )
  RETURNING id
`;

/**
 * UPDATE_JOB
 * 
 * Parameters:
 * - $1 id
 * - $2 locale
 * - $3 title
 * - $4 slug
 * - $5 slug_group
 * - $6 department
 * - $7 location
 * - $8 employment_type
 * - $9 level
 * - $10 summary
 * - $11 responsibilities_md
 * - $12 requirements_md
 * - $13 status
 * - $14 published_at
 * - $15 updated_by
 */
export const UPDATE_JOB = `
  UPDATE job_posts
  SET
    locale = $2,
    title = $3,
    slug = $4,
    slug_group = $5,
    department = $6,
    location = $7,
    employment_type = $8,
    level = $9,
    summary = $10,
    responsibilities_md = $11,
    requirements_md = $12,
    status = $13,
    published_at = $14,
    updated_by = $15,
    updated_at = NOW()
  WHERE id = $1
  RETURNING id
`;

/**
 * DELETE_JOB
 * 
 * Parameters:
 * - $1 id
 */
export const DELETE_JOB = `
  DELETE FROM job_posts
  WHERE id = $1
  RETURNING id
`;

/**
 * GET_JOB_APPLICATIONS
 * 
 * Get all applications for a specific job
 * 
 * Parameters:
 * - $1 job_id
 */
export const GET_JOB_APPLICATIONS = `
  SELECT 
    ja.id,
    ja.job_id,
    ja.full_name,
    ja.email,
    ja.phone,
    ja.resume_asset_id,
    ja.cover_letter,
    ja.status,
    ja.created_at,
    -- Include resume file info
    ma.filename as resume_filename,
    ma.storage_path as resume_path
  FROM job_applications ja
  LEFT JOIN media_assets ma ON ja.resume_asset_id = ma.id
  WHERE ja.job_id = $1
  ORDER BY ja.created_at DESC
`;

/**
 * UPDATE_APPLICATION_STATUS
 * 
 * Parameters:
 * - $1 application_id
 * - $2 status (reviewing, shortlisted, rejected, accepted)
 */
/**
 * UPDATE_JOB_STATUS
 *
 * Quick status update for a job post
 *
 * Parameters:
 * - $1 id
 * - $2 status (draft, published, archived)
 */
export const UPDATE_JOB_STATUS = `
  UPDATE job_posts
  SET
    status = $2::job_status,
    published_at = CASE
      WHEN $2::job_status = 'published' AND status != 'published' THEN NOW()
      WHEN $2::job_status != 'published' THEN NULL
      ELSE published_at
    END,
    updated_at = NOW()
  WHERE id = $1
  RETURNING id, status, published_at
`;

export const UPDATE_APPLICATION_STATUS = `
  UPDATE job_applications
  SET status = $2
  WHERE id = $1
  RETURNING id
`;
