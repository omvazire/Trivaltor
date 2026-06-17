import PopupLead from '../models/PopupLead.js';
import Enquiry from '../models/Enquiry.js';

export const createEnquiryAndConvertLead = async (enquiryData) => {
  const { email, phone } = enquiryData;

  // Search PopupLead collection for a match by phone OR email
  const matchedLead = await PopupLead.findOne({
    $or: [
      { phone: phone },
      { email: email }
    ]
  });

  if (matchedLead) {
    // Delete the matched PopupLead record to mark it converted
    await PopupLead.deleteOne({ _id: matchedLead._id });
    console.log(`[Lead Flow] Deleted unconverted PopupLead for ${matchedLead.name} (Phone: ${phone}, Email: ${email}) as they submitted a formal Enquiry.`);
  }

  // Create and save Enquiry record
  const newEnquiry = new Enquiry(enquiryData);
  await newEnquiry.save();

  return newEnquiry;
};
