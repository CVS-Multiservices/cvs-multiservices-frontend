import { FetchResult } from '../types';

// export const API_BASE_URL: string = 'https://cvs-backend-production-695c.up.railway.app/api';
export const API_BASE_URL: string = 'https://cvs-multiservices-backend-production.up.railway.app/api';
// ==================== ID MAPPER ====================
// Maps MongoDB _id → id for every item





export const mapId = <T extends { _id?: string }>(
  data: T | T[]
): T | T[] => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      id: item._id,
    }));
  }

  return {
    ...data,
    id: data._id,
  };
};

// ==================== BASE FETCH ====================

export const apiFetch = async <T>(
  endpoint: string
): Promise<FetchResult<T>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    if (json.success) {
      return {
        success: true,
        data: mapId(json.data) as T,
      };
    }

    return {
      success: false,
      data: null,
      message: json.message || 'Something went wrong',
    };
  } catch (error) {
    const err = error as Error;
    console.error(`[API Error] /${endpoint}:`, err.message);
    return {
      success: false,
      data: null,
      message: err.message || 'Network error',
    };
  }
};