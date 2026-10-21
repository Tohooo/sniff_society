import { Fragrance } from '../types';

export const MAX_VOTES_PER_CYCLE = 3;

/**
 * Validates if a user can cast a vote for a fragrance
 */
export function canUserVote(
  votedIds: string[],
  targetId: string,
  maxVotes: number = MAX_VOTES_PER_CYCLE
): { canVote: boolean; reason?: string } {
  const isAlreadyVoted = votedIds.includes(targetId);
  if (isAlreadyVoted) {
    return { canVote: true }; // User can toggle (unvote)
  }

  if (votedIds.length >= maxVotes) {
    return {
      canVote: false,
      reason: `Batas kuota vote minggu ini (${maxVotes} suara) telah tercapai. Hapus salah satu pilihan Anda untuk mengganti.`,
    };
  }

  return { canVote: true };
}

/**
 * Toggles a user's vote for a fragrance
 */
export function toggleFragranceVote(
  votedIds: string[],
  targetId: string,
  maxVotes: number = MAX_VOTES_PER_CYCLE
): { newVotedIds: string[]; action: 'added' | 'removed' } {
  if (votedIds.includes(targetId)) {
    return {
      newVotedIds: votedIds.filter((id) => id !== targetId),
      action: 'removed',
    };
  }

  if (votedIds.length >= maxVotes) {
    throw new Error(`Maksimal ${maxVotes} vote per minggu`);
  }

  return {
    newVotedIds: [...votedIds, targetId],
    action: 'added',
  };
}

/**
 * Calculates vote share percentage
 */
export function calculateVoteShare(votes: number, totalVotes: number): number {
  if (totalVotes <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((votes / totalVotes) * 100)));
}

/**
 * Returns Top N winning fragrances sorted by vote count
 */
export function getTopWinners(fragrances: Fragrance[], limit: number = 3): Fragrance[] {
  return [...fragrances]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit)
    .map((item, index) => ({
      ...item,
      isWinner: true,
      winnerRank: (index + 1) as 1 | 2 | 3,
    }));
}

/**
 * Filters fragrance list based on search term, brand, olfactory category, and gender
 */
export function filterFragrances(
  fragrances: Fragrance[],
  query: string = '',
  selectedBrand: string = 'All',
  selectedCategory: string = 'All',
  selectedGender: string = 'All'
): Fragrance[] {
  const cleanQuery = query.trim().toLowerCase();

  return fragrances.filter((item) => {
    // Brand filter
    if (selectedBrand !== 'All' && item.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Gender filter
    if (selectedGender !== 'All' && item.gender.toLowerCase() !== selectedGender.toLowerCase()) {
      return false;
    }

    // Search query matching Name, Brand, or Olfactory Notes
    if (cleanQuery) {
      const matchName = item.name.toLowerCase().includes(cleanQuery);
      const matchBrand = item.brand.toLowerCase().includes(cleanQuery);
      const matchNotes = [
        ...item.notes.top,
        ...item.notes.mid,
        ...item.notes.base,
      ].some((note) => note.toLowerCase().includes(cleanQuery));

      if (!matchName && !matchBrand && !matchNotes) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Formats Indonesian Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates time remaining to a deadline
 */
export function calculateRemainingTime(
  deadlineMs: number,
  currentMs: number = Date.now()
): { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean } {
  const diff = deadlineMs - currentMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isExpired: false };
}
