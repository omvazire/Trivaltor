import { initialReviews } from '../data/mockReviews';

const LOCAL_STORAGE_KEY = 'trivaltor_reviews';

const getStoredReviews = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialReviews));
    return initialReviews;
  }
  return JSON.parse(data);
};

const saveReviews = (reviews) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
};

export const reviewService = {
  getReviews: async () => {
    return getStoredReviews();
  },
  
  addReview: async (review) => {
    const reviews = getStoredReviews();
    const newReview = {
      ...review,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'r-' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: review.createdAt || new Date().toISOString()
    };
    reviews.push(newReview);
    saveReviews(reviews);
    return newReview;
  },
  
  approveReview: async (id) => {
    const reviews = getStoredReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].status = 'approved';
    saveReviews(reviews);
    return reviews[idx];
  },
  
  rejectReview: async (id) => {
    const reviews = getStoredReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].status = 'rejected';
    saveReviews(reviews);
    return reviews[idx];
  },
  
  deleteReview: async (id) => {
    const reviews = getStoredReviews();
    const filtered = reviews.filter(r => r.id !== id);
    saveReviews(filtered);
    return { success: true };
  }
};
