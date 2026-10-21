import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canUserVote,
  toggleFragranceVote,
  calculateVoteShare,
  getTopWinners,
  filterFragrances,
  formatIDR,
  calculateRemainingTime,
} from './votingEngine';
import { Fragrance } from '../types';

const mockFragrance: Fragrance = {
  id: 'tf-oud-wood',
  brand: 'Tom Ford',
  name: 'Oud Wood',
  category: 'Woody',
  gender: 'Unisex',
  concentration: 'Eau de Parfum',
  image: '/test.jpg',
  notes: {
    top: ['Rosewood', 'Cardamom', 'Chinese Pepper'],
    mid: ['Oud Wood', 'Sandalwood', 'Vetiver'],
    base: ['Tonka Bean', 'Vanilla', 'Amber'],
  },
  perfumer: 'Richard Herpin',
  releaseYear: 2007,
  batchCode: 'A42-2024',
  originCountry: 'USA',
  rating: 4.8,
  ratingCount: 342,
  ratingsBreakdown: { 5: 280, 4: 45, 3: 12, 2: 3, 1: 2 },
  votes: 388,
  longevity: '8-10 Jam',
  sillage: 'Moderate',
  season: 'Fall/Winter',
  decantPricing: { '2ml': 55000, '3ml': 78000, '5ml': 125000, '10ml': 235000 },
  shopeeUrl: 'https://shopee.co.id',
  description: 'Smoky, exotic oud wood combined with cardamom and rare woods.',
};

const mockFragrance2: Fragrance = {
  ...mockFragrance,
  id: 'mfk-br540',
  brand: 'Maison Francis Kurkdjian',
  name: 'Baccarat Rouge 540 Extrait',
  category: 'Oriental',
  notes: {
    top: ['Bitter Almond', 'Saffron'],
    mid: ['Egyptian Jasmine', 'Cedarwood'],
    base: ['Ambergris', 'Woody Musk'],
  },
  votes: 412,
};

const mockFragrance3: Fragrance = {
  ...mockFragrance,
  id: 'creed-aventus',
  brand: 'Creed',
  name: 'Aventus',
  category: 'Fresh',
  gender: 'Pour Homme',
  notes: {
    top: ['Pineapple', 'Bergamot', 'Blackcurrant'],
    mid: ['Birch Smoke', 'Patchouli', 'Jasmine'],
    base: ['Oakmoss', 'Ambergris', 'Vanilla'],
  },
  votes: 345,
};

const mockFragrance4: Fragrance = {
  ...mockFragrance,
  id: 'le-labo-33',
  brand: 'Le Labo',
  name: 'Santal 33',
  category: 'Woody',
  notes: {
    top: ['Violet Accord', 'Iris'],
    mid: ['Papyrus', 'Ambrox'],
    base: ['Sandalwood', 'Cedar'],
  },
  votes: 210,
};

test('voting limit check enforces max 3 votes', () => {
  const currentVotes = ['tf-oud-wood', 'mfk-br540'];
  // Under limit
  assert.equal(canUserVote(currentVotes, 'creed-aventus', 3).canVote, true);

  // At limit
  const fullVotes = ['tf-oud-wood', 'mfk-br540', 'creed-aventus'];
  assert.equal(canUserVote(fullVotes, 'le-labo-33', 3).canVote, false);

  // Can unvote already voted item even when at limit
  assert.equal(canUserVote(fullVotes, 'tf-oud-wood', 3).canVote, true);
});

test('toggleFragranceVote correctly adds and removes votes', () => {
  // Adding vote
  const res1 = toggleFragranceVote(['tf-oud-wood'], 'mfk-br540', 3);
  assert.equal(res1.action, 'added');
  assert.deepEqual(res1.newVotedIds, ['tf-oud-wood', 'mfk-br540']);

  // Removing vote
  const res2 = toggleFragranceVote(['tf-oud-wood', 'mfk-br540'], 'tf-oud-wood', 3);
  assert.equal(res2.action, 'removed');
  assert.deepEqual(res2.newVotedIds, ['mfk-br540']);

  // Throw error when exceeding max 3
  assert.throws(() => {
    toggleFragranceVote(['a', 'b', 'c'], 'd', 3);
  }, /Maksimal 3 vote/);
});

test('calculateVoteShare produces correct bounded percentage', () => {
  assert.equal(calculateVoteShare(40, 100), 40);
  assert.equal(calculateVoteShare(0, 100), 0);
  assert.equal(calculateVoteShare(50, 0), 0);
});

test('getTopWinners sorts fragrances by vote and attaches ranks', () => {
  const list = [mockFragrance, mockFragrance2, mockFragrance3, mockFragrance4];
  const winners = getTopWinners(list, 3);
  assert.equal(winners.length, 3);
  assert.equal(winners[0].id, 'mfk-br540'); // 412 votes
  assert.equal(winners[0].winnerRank, 1);
  assert.equal(winners[1].id, 'tf-oud-wood'); // 388 votes
  assert.equal(winners[1].winnerRank, 2);
  assert.equal(winners[2].id, 'creed-aventus'); // 345 votes
  assert.equal(winners[2].winnerRank, 3);
});

test('filterFragrances filters by brand, category, gender and notes query', () => {
  const list = [mockFragrance, mockFragrance2, mockFragrance3, mockFragrance4];

  // Filter by brand
  const brandFiltered = filterFragrances(list, '', 'Tom Ford', 'All', 'All');
  assert.equal(brandFiltered.length, 1);
  assert.equal(brandFiltered[0].brand, 'Tom Ford');

  // Filter by note keyword search
  const noteFiltered = filterFragrances(list, 'cardamom', 'All', 'All', 'All');
  assert.equal(noteFiltered.length, 1);
  assert.equal(noteFiltered[0].name, 'Oud Wood');

  // Filter by category
  const woodyFiltered = filterFragrances(list, '', 'All', 'Woody', 'All');
  assert.equal(woodyFiltered.length, 2);
});

test('formatIDR formats currency numbers to Rupiah string', () => {
  const str = formatIDR(45000);
  assert.ok(str.includes('45.000') || str.includes('45,000'));
});

test('calculateRemainingTime computes accurate days, hours, minutes and seconds', () => {
  const base = 1000000;
  const deadline = base + (2 * 24 * 3600 * 1000) + (5 * 3600 * 1000) + (10 * 60 * 1000) + (30 * 1000);
  const time = calculateRemainingTime(deadline, base);
  assert.equal(time.days, 2);
  assert.equal(time.hours, 5);
  assert.equal(time.minutes, 10);
  assert.equal(time.seconds, 30);
  assert.equal(time.isExpired, false);
});
