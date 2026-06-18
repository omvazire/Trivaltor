import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ReviewContext = createContext();

const parseReview = (item) => {
  if (!item) return null;
  return {
    id: item._id,
    customerName: item.name,
    reviewerType: item.company,
    reviewText: item.review,
    rating: item.rating,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [paginationReviews, setPaginationReviews] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const res = await api.review.getAll({ page, limit });
      if (res.success && Array.isArray(res.data)) {
        setReviews(res.data.map(parseReview));
        setPaginationReviews(res.pagination || { page, limit, total: res.data.length, pages: 1 });
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedReviews = async () => {
    try {
      const res = await api.review.getApproved();
      if (res.success && Array.isArray(res.data)) {
        const parsed = res.data.map(parseReview);
        setApprovedReviews(parsed);
        return parsed;
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch approved reviews:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchApprovedReviews();
    const token = localStorage.getItem('trivaltor-admin-token');
    if (token) {
      fetchReviews(1, 20);
    }
  }, []);

  const addReview = async (reviewData) => {
    try {
      const payload = {
        name: reviewData.customerName,
        company: reviewData.reviewerType || '',
        review: reviewData.reviewText,
        rating: Number(reviewData.rating)
      };
      const res = await api.review.create(payload);
      const parsed = parseReview(res.data);
      // It starts as pending, so we don't add to approved list
      return parsed;
    } catch (err) {
      console.error('Failed to add review:', err);
      throw err;
    }
  };

  const approveReview = async (id) => {
    try {
      const res = await api.review.approve(id);
      const updated = parseReview(res.data);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      // Re-fetch approved reviews list so homepage marquee stays synced
      fetchApprovedReviews();
      return updated;
    } catch (err) {
      console.error('Failed to approve review:', err);
      throw err;
    }
  };

  const rejectReview = async (id) => {
    try {
      const res = await api.review.reject(id);
      const updated = parseReview(res.data);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      // Re-fetch approved reviews list so homepage marquee stays synced
      fetchApprovedReviews();
      return updated;
    } catch (err) {
      console.error('Failed to reject review:', err);
      throw err;
    }
  };

  const deleteReview = async (id) => {
    try {
      await api.review.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      // Re-fetch approved reviews list so homepage marquee stays synced
      fetchApprovedReviews();
      // Re-fetch reviews to sync pagination metadata
      fetchReviews(paginationReviews.page, paginationReviews.limit);
    } catch (err) {
      console.error('Failed to delete review:', err);
      throw err;
    }
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      approvedReviews,
      paginationReviews,
      loading,
      fetchReviews,
      fetchApprovedReviews,
      addReview,
      approveReview,
      rejectReview,
      deleteReview
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
