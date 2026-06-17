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
    const leads = await PopupLead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};
