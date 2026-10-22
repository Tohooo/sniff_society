// const BASE_URL = 'https://api.fragella.com/api/v1';

// // Ganti dengan API Key Fragella Anda yang valid
// const API_KEY = 'bfcad3b26aef11d7aa8bf35942ebeed1cbbef9a8fb007ef3be5dbe90dbac941f';

// interface FetchOptions {
//     search?: string;
//     brand?: string;
//     gender?: string;
//     notes?: string;
//     limit?: number;
//     page?: number;
// }

// async function request(endpoint: string, options: RequestInit = {}) {
//     const headers = {
//         'x-api-key': API_KEY,
//         'Content-Type': 'application/json',
//         ...options.headers,
//     };

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//         ...options,
//         headers,
//     });

//     if (!response.ok) {
//         throw new Error(`Fragella API Error: ${response.status} ${response.statusText}`);
//     }

//     return response.json();
// }

// /**
//  * Mencari parfum berdasarkan keyword, brand, gender, atau notes
//  */
// export async function searchFragrances(params: FetchOptions) {
//     const queryParams = new URLSearchParams();
//     if (params.search) queryParams.append('search', params.search);
//     if (params.brand) queryParams.append('brand', params.brand);
//     if (params.gender) queryParams.append('gender', params.gender);
//     if (params.notes) queryParams.append('notes', params.notes);
//     if (params.limit) queryParams.append('limit', params.limit.toString());
//     if (params.page) queryParams.append('page', params.page.toString());

//     return request(`/fragrances?${queryParams.toString()}`);
// }

// /**
//  * Mengambil detail parfum berdasarkan ID/Slug
//  */
// export async function getFragranceDetail(id: string) {
//     return request(`/fragrances/${id}`);
// }

// /**
//  * Mengambil daftar parfum berdasarkan Brand tertentu
//  */
// export async function getFragrancesByBrand(brandName: string, limit = 10) {
//     return request(`/brands/${encodeURIComponent(brandName)}?limit=${limit}`);
// }

// /**
//  * Mencari parfum yang mirip (Similar Fragrances)
//  */
// export async function getSimilarFragrances(name: string, limit = 5) {
//     return request(`/fragrances/similar?name=${encodeURIComponent(name)}&limit=${limit}`);
// }