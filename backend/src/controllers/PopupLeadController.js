import PopupLead from '../models/PopupLead.js';

export const createPopupLead = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;

    const popupLead = new PopupLead({
      name,
      phone,
      email,
      timestamp: new Date()
    });

    await popupLead.save();

    res.status(201).json({
      success: true,
      data: popupLead
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPopupLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await PopupLead.countDocuments();
    const leads = await PopupLead.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: leads,
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

export const deletePopupLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLead = await PopupLead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: 'Popup lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Popup lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
