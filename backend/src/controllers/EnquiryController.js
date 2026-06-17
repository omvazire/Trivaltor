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
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enquiries
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
