import { query } from './postgres';

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyRecord {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getBlogPosts(publishedOnly = false): Promise<BlogPostRecord[]> {
  const sql = publishedOnly
    ? 'SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC'
    : 'SELECT * FROM blog_posts ORDER BY created_at DESC';
  const result = await query<BlogPostRecord>(sql);
  return result.rows;
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  published?: boolean;
}): Promise<BlogPostRecord> {
  const result = await query<BlogPostRecord>(
    `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.title, data.slug, data.excerpt || null, data.content, data.cover_image || null, Boolean(data.published)]
  );
  return result.rows[0];
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPostRecord>
): Promise<BlogPostRecord | null> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && value !== undefined) {
      updates.push(`${key} = $${i}`);
      values.push(value);
      i += 1;
    }
  });

  if (!updates.length) return null;

  values.push(id);
  const result = await query<BlogPostRecord>(
    `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const result = await query('DELETE FROM blog_posts WHERE id = $1', [id]);
  return result.rowCount > 0;
}

export async function getCaseStudies(publishedOnly = false): Promise<CaseStudyRecord[]> {
  const sql = publishedOnly
    ? 'SELECT * FROM case_studies WHERE published = true ORDER BY created_at DESC'
    : 'SELECT * FROM case_studies ORDER BY created_at DESC';
  const result = await query<CaseStudyRecord>(sql);
  return result.rows;
}

export async function createCaseStudy(data: {
  title: string;
  slug: string;
  client_name?: string | null;
  summary?: string | null;
  challenge?: string | null;
  solution?: string | null;
  outcome?: string | null;
  cover_image?: string | null;
  published?: boolean;
}): Promise<CaseStudyRecord> {
  const result = await query<CaseStudyRecord>(
    `INSERT INTO case_studies
      (title, slug, client_name, summary, challenge, solution, outcome, cover_image, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.title,
      data.slug,
      data.client_name || null,
      data.summary || null,
      data.challenge || null,
      data.solution || null,
      data.outcome || null,
      data.cover_image || null,
      Boolean(data.published),
    ]
  );
  return result.rows[0];
}

export async function updateCaseStudy(
  id: string,
  data: Partial<CaseStudyRecord>
): Promise<CaseStudyRecord | null> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && value !== undefined) {
      updates.push(`${key} = $${i}`);
      values.push(value);
      i += 1;
    }
  });

  if (!updates.length) return null;

  values.push(id);
  const result = await query<CaseStudyRecord>(
    `UPDATE case_studies SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  const result = await query('DELETE FROM case_studies WHERE id = $1', [id]);
  return result.rowCount > 0;
}
