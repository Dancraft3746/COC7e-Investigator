import { openDB, type IDBPDatabase } from 'idb';
import type { InvestigatorData, CharacterSummary } from '../types/investigator';

const DB_NAME = 'ArkhamInvestigatorCodexDB';
const DB_VERSION = 1;
const STORE_CHARACTERS = 'characters';
const STORE_SETTINGS = 'settings';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser environment'));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_CHARACTERS)) {
          const charStore = db.createObjectStore(STORE_CHARACTERS, { keyPath: 'id' });
          charStore.createIndex('by_updatedAt', 'updatedAt');
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS);
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Save an investigator into IndexedDB (and sync active state)
 */
export async function saveInvestigatorToDB(data: InvestigatorData): Promise<void> {
  try {
    const db = await getDB();
    data.updatedAt = Date.now();
    await db.put(STORE_CHARACTERS, JSON.parse(JSON.stringify(data)));
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to LocalStorage', err);
    try {
      localStorage.setItem(`coc_char_${data.id}`, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage save failed', e);
    }
  }
}

/**
 * Get all investigator summaries for the character switcher drawer
 */
export async function getAllInvestigatorSummaries(): Promise<CharacterSummary[]> {
  try {
    const db = await getDB();
    const all = (await db.getAll(STORE_CHARACTERS)) as InvestigatorData[];
    return all.map((c) => ({
      id: c.id,
      name: c.investigator.name,
      job: c.investigator.job,
      age: c.investigator.age,
      hp: c.investigator.hp,
      maxHP: Math.floor((c.characteristics.CON + c.characteristics.SIZ) / 10),
      san: c.investigator.san,
      updatedAt: c.updatedAt,
      isArchived: c.isArchived,
    }));
  } catch (err) {
    console.warn('IndexedDB getAll failed', err);
    return [];
  }
}

/**
 * Load an investigator by ID
 */
export async function loadInvestigatorFromDB(id: string): Promise<InvestigatorData | null> {
  try {
    const db = await getDB();
    const data = await db.get(STORE_CHARACTERS, id);
    return data || null;
  } catch (err) {
    console.warn('IndexedDB load failed', err);
    return null;
  }
}

/**
 * Delete an investigator from IndexedDB
 */
export async function deleteInvestigatorFromDB(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_CHARACTERS, id);
  } catch (err) {
    console.warn('IndexedDB delete failed', err);
  }
}

/**
 * Get the currently active investigator ID
 */
export async function getActiveCharacterId(): Promise<string | null> {
  try {
    const db = await getDB();
    const id = await db.get(STORE_SETTINGS, 'activeCharacterId');
    return id || null;
  } catch (err) {
    return localStorage.getItem('coc_active_char_id') || null;
  }
}

/**
 * Set the currently active investigator ID
 */
export async function setActiveCharacterId(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_SETTINGS, id, 'activeCharacterId');
  } catch (err) {
    localStorage.setItem('coc_active_char_id', id);
  }
}
