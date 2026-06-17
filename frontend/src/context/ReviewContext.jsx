import { createContext, useContext, useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (reviewData) => {
    try {
      const newReview = await reviewService.addReview(reviewData);
      setReviews(prev => [...prev, newReview]);
      return newReview;
    } catch (err) {
      console.error('Failed to add review:', err);
      throw err;
    }
  };

  const approveReview = async (id) => {
    try {
      const updated = await reviewService.approveReview(id);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      console.error('Failed to approve review:', err);
      throw err;
    }
  };

  const rejectReview = async (id) => {
    try {
      const updated = await reviewService.rejectReview(id);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      console.error('Failed to reject review:', err);
      throw err;
    }
  };

  const deleteReview = async (id) => {
    try {
      await reviewService.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete review:', err);
      throw err;
    }
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      loading,
      fetchReviews,
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
