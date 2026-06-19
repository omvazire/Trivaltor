import mongoose from 'mongoose';

const visitedPageSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const visitedCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const visitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstVisitTime: {
    type: Date,
    default: Date.now
  },
  lastVisitTime: {
    type: Date,
    default: Date.now
  },
  pagesVisited: [visitedPageSchema],
  categoryVisited: [visitedCategorySchema],
  languageSelected: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true
});

visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ lastVisitTime: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
