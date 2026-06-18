import Enquiry from '../models/Enquiry.js';
import { createEnquiryAndConvertLead } from '../services/enquiryService.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      enquiryType,
      category,
      state,
      district,
      cityVillage,
      pincode,
      message
    } = req.body;

    const enquiry = await createEnquiryAndConvertLead({
      name,
      phone,
      email,
      enquiryType,
      category,
      state,
      district,
      cityVillage,
      pincode,
      message,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEnquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.enquiryType) {
      query.enquiryType = req.query.enquiryType;
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: enquiries,
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

export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const markEnquiryContacted = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.contacted = !enquiry.contacted;
    await enquiry.save();

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
