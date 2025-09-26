import { getSupabaseClient } from '../supabaseClient';

const TABLE = 'notes';

/**
 * Shape of a Note object
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Map Supabase error to a readable message.
 */
function formatError(err) {
  if (!err) return 'Unknown error';
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

// PUBLIC_INTERFACE
export async function listNotes({ search = '' } = {}) {
  /** List notes by updated_at desc, optional search on title/content */
  const supabase = getSupabaseClient();
  let query = supabase.from(TABLE).select('*').order('updated_at', { ascending: false });
  if (search) {
    // Use ilike for case-insensitive search across title and content via OR
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(formatError(error));
  return data || [];
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Fetch a single note by id */
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw new Error(formatError(error));
  return data;
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a new note */
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const payload = { title: title || 'Untitled', content: content || '', created_at: now, updated_at: now };
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single();
  if (error) throw new Error(formatError(error));
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update note title/content */
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(formatError(error));
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id */
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(formatError(error));
  return true;
}
