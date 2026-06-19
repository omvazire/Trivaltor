import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const { name, company, review, rating } = req.body;

    const newReview = new Review({
      name,
      company: company || '',
      review,
      rating,
      approved: false,
      status: 'pending'
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

export const getApprovedReviews = async (req, res, next) => {
  try {
    // Show only approved reviews, newest first
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments();
    const reviews = await Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    review.approved = true;
    review.status = 'approved';
    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const rejectReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    review.approved = false;
    review.status = 'rejected';
    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
