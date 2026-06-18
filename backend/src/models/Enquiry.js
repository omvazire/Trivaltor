import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  enquiryType: {
    type: String,
    enum: ['farmer', 'buyer', 'investor', 'contact'],
    required: true
  },
  category: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  cityVillage: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  contacted: {
    type: Boolean,
    default: false
  },
  convertedFromPopupLead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
