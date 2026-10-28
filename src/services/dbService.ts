import { supabase } from './supabaseClient';
import { Fragrance, Suggestion, UserProfile } from '../types';

// ==================== USERS (PENGGUNA) ====================

// Menyimpan atau memperbarui data user ke database PostgreSQL
export async function upsertUserToDB(user: UserProfile & { email: string }): Promise<boolean> {
    const { error } = await supabase.from('users').upsert(
        [
            {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                max_votes: user.maxVotes,
                wa_subscribed: user.waSubscribed,
            },
        ],
        { onConflict: 'email' } // Jika email sudah ada, data akan di-update
    );

    if (error) {
        console.error('Gagal menyimpan user ke database:', error.message);
        return false;
    }
    return true;
}

// Mengambil seluruh daftar notes dari tabel master tunggal 'notes' di Supabase
export async function fetchNotesFromDB(): Promise<string[]> {
    const { data, error } = await supabase
        .from('notes')
        .select('name')
        .order('name', { ascending: true });

    if (error) {
        console.error('Gagal mengambil data notes:', error.message);
        return [];
    }

    return (data || []).map((item) => item.name);
}

// Mengambil seluruh daftar user dari database Supabase
export async function fetchUsersFromDB(): Promise<UserProfile[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Gagal mengambil data user:', error.message);
        return [];
    }

    return (data || []).map((item) => ({
        role: item.role || 'member',
        name: item.name,
        email: item.email,
        phone: item.phone || '',
        votedIds: item.voted_ids || [],
        maxVotes: item.max_votes || 1,
        waSubscribed: item.wa_subscribed ?? true,
    }));
}

// ==================== FRAGRANCES (PARFUM) ====================

// Mengambil seluruh data parfum dari database PostgreSQL
export async function fetchFragrancesFromDB(): Promise<Fragrance[]> {
    const { data, error } = await supabase
        .from('fragrances')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Gagal mengambil data parfum:', error.message);
        return [];
    }

    // Mapping dari format database (snake_case) ke format frontend (camelCase jika diperlukan)
    return (data || []).map((item) => ({
        id: item.id,
        brand: item.brand,
        name: item.name,
        subtitle: item.subtitle,
        category: item.category,
        gender: item.gender,
        concentration: item.concentration,
        image: item.image,
        notes: item.notes,
        perfumer: item.perfumer,
        releaseYear: item.release_year,
        batchCode: item.batch_code,
        originCountry: item.origin_country,
        rating: item.rating,
        ratingCount: item.rating_count,
        ratingsBreakdown: item.ratings_breakdown,
        votes: item.votes,
        longevity: item.longevity,
        sillage: item.sillage,
        season: item.season,
        decantPricing: item.decant_pricing,
        shopeeUrl: item.shopee_url,
        description: item.description,
    }));
}

// Menambah parfum baru ke database PostgreSQL (Digunakan oleh Super Admin)
export async function insertFragranceToDB(fragrance: Fragrance): Promise<boolean> {
    const { error } = await supabase.from('fragrances').insert([
        {
            id: fragrance.id,
            brand: fragrance.brand,
            name: fragrance.name,
            subtitle: fragrance.subtitle,
            category: fragrance.category,
            gender: fragrance.gender,
            concentration: fragrance.concentration,
            image: fragrance.image,
            notes: fragrance.notes,
            perfumer: fragrance.perfumer,
            release_year: fragrance.releaseYear,
            batch_code: fragrance.batchCode,
            origin_country: fragrance.originCountry,
            rating: fragrance.rating,
            rating_count: fragrance.ratingCount,
            ratings_breakdown: fragrance.ratingsBreakdown,
            votes: fragrance.votes,
            longevity: fragrance.longevity,
            sillage: fragrance.sillage,
            season: fragrance.season,
            decant_pricing: fragrance.decantPricing,
            shopee_url: fragrance.shopeeUrl,
            description: fragrance.description,
        },
    ]);

    if (error) {
        console.error('Gagal menyimpan parfum:', error.message);
        return false;
    }
    return true;
}

// Menghapus parfum dari database Supabase berdasarkan ID
export async function deleteFragranceFromDB(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('fragrances')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Gagal menghapus parfum:', error.message);
        return false;
    }

    return true;
}

// Mengupdate jumlah vote parfum di database
export async function updateFragranceVotesDB(id: string, newVotes: number): Promise<boolean> {
    const { error } = await supabase
        .from('fragrances')
        .update({ votes: newVotes })
        .eq('id', id);

    if (error) {
        console.error('Gagal memperbarui vote:', error.message);
        return false;
    }
    return true;
}

// ==================== SUGGESTIONS (SARAN & KRITIK) ====================

// Mengambil daftar saran/kritik dari database
export async function fetchSuggestionsFromDB(): Promise<Suggestion[]> {
    const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Gagal mengambil saran:', error.message);
        return [];
    }

    return (data || []).map((item) => ({
        id: item.id,
        author: item.author,
        title: item.title,
        description: item.description,
        upvotes: item.upvotes,
        userUpvoted: item.user_upvoted,
        status: item.status,
        category: item.category,
        date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '',
        adminReply: item.admin_reply,
    }));
}

// Menambah saran/kritik baru ke database
export async function insertSuggestionToDB(suggestion: Omit<Suggestion, 'id' | 'date'>): Promise<boolean> {
    const { error } = await supabase.from('suggestions').insert([
        {
            author: suggestion.author,
            title: suggestion.title,
            description: suggestion.description,
            upvotes: suggestion.upvotes,
            user_upvoted: suggestion.userUpvoted,
            status: suggestion.status,
            category: suggestion.category,
            admin_reply: suggestion.adminReply,
        },
    ]);

    if (error) {
        console.error('Gagal mengirim saran:', error.message);
        return false;
    }
    return true;
}