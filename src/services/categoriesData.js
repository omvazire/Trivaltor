// Import images from assets to use for categories and products
import imgCardamom from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM.jpeg';
import imgPepper from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM (1).jpeg';
import imgTurmeric from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM (2).jpeg';

// Import other available images for fruits and vegetables
import imgFruitsBanner from '../assets/images/catagory-fruit.jpg';
import imgVegBanner from '../assets/images/catagory-vegetable.jpeg';
import imgSpicesBanner from '../assets/images/catagory-spices.png';
import imgAgri from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.43 PM.jpeg';
import imgExport from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.45 PM.jpeg';
import imgImport from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.38 PM.jpeg';

export const categoriesData = [
  {
    id: "fruits",
    name: {
      en: "Fruits",
      mr: "फळे"
    },
    description: {
      en: "Premium organic fresh fruits harvested from select orchards, cooled immediately, and packaged for long-transit ocean cargo.",
      mr: "निवडक बागांमधून काढलेली प्रीमियम सेंद्रिय ताजी फळे, त्वरित थंड करून आंतरराष्ट्रीय वाहतुकीसाठी पॅक केली जातात."
    },
    image: imgFruitsBanner,
    bannerImage: imgFruitsBanner,
    products: [
      {
        id: "fr-1",
        name: {
          en: "Premium Alphonso Mango (Demo)",
          mr: "प्रीमियम हापूस आंबा (डेमो)"
        },
        description: {
          en: "Grade-A export quality mangoes sourced from Devgad & Ratnagiri. Rich aroma and fiber-less sweet pulp.",
          mr: "देवगड आणि रत्नागिरी येथून आणलेला अ-श्रेणीचा निर्यात गुणवत्ता आंबा. समृद्ध सुगंध आणि फायबर नसलेला गोड गर."
        },
        image: imgAgri,
        specs: {
          origin: { en: "Maharashtra, India", mr: "महाराष्ट्र, भारत" },
          purity: { en: "Premium Grade A", mr: "प्रीमियम श्रेणी अ" },
          moisture: { en: "N/A (Fresh Fruit)", mr: "लागू नाही (ताजी फळे)" },
          packaging: { en: "3kg / 5kg Corrugated Fiberboard Boxes", mr: "३ किलो / ५ किलोचे बॉक्स" }
        }
      },
      {
        id: "fr-2",
        name: {
          en: "Fresh Pomegranate Bhagwa (Demo)",
          mr: "ताजे डाळिंब भगवा (डेमो)"
        },
        description: {
          en: "Glossy red skin and soft ruby-red arils. Highly valued for high juice content and long shelf life.",
          mr: "चमकदार लाल साल आणि मऊ रुबी-लाल दाणे. जास्त रसाचे प्रमाण आणि चांगल्या टिकवण क्षमतेसाठी ओळखले जाते."
        },
        image: imgExport,
        specs: {
          origin: { en: "Maharashtra, India", mr: "महाराष्ट्र, भारत" },
          purity: { en: "Export Grade", mr: "निर्यात श्रेणी" },
          moisture: { en: "N/A (Fresh Fruit)", mr: "लागू नाही (ताजी फळे)" },
          packaging: { en: "4kg open-top boxes", mr: "४ किलो ओपन-टॉप बॉक्स" }
        }
      },
      {
        id: "fr-3",
        name: {
          en: "Organic Cavendish Banana (Demo)",
          mr: "सेंद्रिय ग्रँड नैन केळी (डेमो)"
        },
        description: {
          en: "Premium Cavendish bananas harvested at optimal green mature stage, washed and padded.",
          mr: "योग्य हिरव्या पक्व अवस्थेत काढलेली, धुतलेली आणि सुरक्षितरित्या पॅक केलेली केळी."
        },
        image: imgImport,
        specs: {
          origin: { en: "Gujarat / Andhra Pradesh, India", mr: "गुजरात / आंध्र प्रदेश, भारत" },
          purity: { en: "Grade A", mr: "श्रेणी अ" },
          moisture: { en: "N/A (Fresh Fruit)", mr: "लागू नाही (ताजी फळे)" },
          packaging: { en: "13.5kg / 18kg cartons", mr: "१३.५ किलो / १८ किलो कार्टन" }
        }
      }
    ]
  },
  {
    id: "vegetables",
    name: {
      en: "Vegetables",
      mr: "भाज्या"
    },
    description: {
      en: "Fresh, hygienically sorted vegetables sourced from contract farming grids, cured and packed to withstand logistics transit.",
      mr: "करार शेतीमधून आणलेल्या ताज्या, स्वच्छपणे निवडलेल्या भाज्या, वाहतुकीसाठी योग्य प्रकारे वाळवून पॅक केल्या जातात."
    },
    image: imgVegBanner,
    bannerImage: imgVegBanner,
    products: [
      {
        id: "vg-1",
        name: {
          en: "Fresh Red Onion (Demo)",
          mr: "ताजा लाल कांदा (डेमो)"
        },
        description: {
          en: "Nashik region red onions. Well-dried outer skin, cured, sorted, and graded to 55mm+ size.",
          mr: "नाशिक भागातील लाल कांदा. चांगल्या प्रकारे सुकवलेली बाहेरील साल, ५५ मिमी+ आकाराचे कांदे."
        },
        image: imgVegBanner,
        specs: {
          origin: { en: "Maharashtra, India", mr: "महाराष्ट्र, भारत" },
          purity: { en: "99% Sortex Cleaned", mr: "९९% सॉर्टेक्स क्लिन" },
          moisture: { en: "Cured Dry", mr: "सुका (क्युअर केलेला)" },
          packaging: { en: "20kg / 25kg Mesh bags", mr: "२० किलो / २५ किलो मेश बॅग" }
        }
      },
      {
        id: "vg-2",
        name: {
          en: "G4 Green Chilli (Demo)",
          mr: "जी४ हिरवी मिरची (डेमो)"
        },
        description: {
          en: "Highly pungent green chillies with bright green color. Slender shape, sorted for export.",
          mr: "भडक हिरव्या रंगाची आणि तिखट चवीची मिरची. निर्यातीसाठी खास निवडलेली."
        },
        image: imgAgri,
        specs: {
          origin: { en: "Guntur / Karnataka, India", mr: "गुंरूर / कर्नाटक, भारत" },
          purity: { en: "Sorted Grade A", mr: "निवडलेली श्रेणी अ" },
          moisture: { en: "Fresh", mr: "ताजी" },
          packaging: { en: "5kg / 10kg ventilated boxes", mr: "५ किलो / १० किलो व्हेंटिलेटेड बॉक्स" }
        }
      },
      {
        id: "vg-3",
        name: {
          en: "Fresh Ginger Rhizome (Demo)",
          mr: "ताजे आले (डेमो)"
        },
        description: {
          en: "Bold size washed fresh ginger. Free from soil or rot, possessing a sharp spicy taste.",
          mr: "मोठ्या आकाराचे धुतलेले ताजे आले. माती किंवा कुजण्यापासून मुक्त, तिखट चवदार आले."
        },
        image: imgImport,
        specs: {
          origin: { en: "Karnataka, India", mr: "कर्नाटक, भारत" },
          purity: { en: "98% Cleaned", mr: "९८% स्वच्छ" },
          moisture: { en: "Fresh", mr: "ताजे" },
          packaging: { en: "25kg mesh bags", mr: "२५ किलो मेश बॅग" }
        }
      }
    ]
  },
  {
    id: "spices",
    name: {
      en: "Spices",
      mr: "मसाले"
    },
    description: {
      en: "Authentic, high-curcumin and rich essential oil spices sourced directly from the Western Ghats and major growing belts.",
      mr: "पश्चिम घाट आणि इतर महत्त्वाच्या उत्पादक भागांमधून थेट आणलेले मूळ, उच्च कुरकुमीन असलेले आणि सुगंधी मसाले."
    },
    image: imgSpicesBanner,
    bannerImage: imgSpicesBanner,
    products: [
      {
        id: "sp-1",
        name: {
          en: "Premium Green Cardamom (Demo)",
          mr: "प्रीमियम हिरवी वेलची (डेमो)"
        },
        description: {
          en: "Handpicked green cardamom capsules (sizes 7mm to 8mm+), sourcing directly from local Kerala estates.",
          mr: "थेट केरळच्या इस्टेट्समधून आणलेली हाताने निवडलेली हिरवी वेलची (आकार ७ मिमी ते ८ मिमी+)."
        },
        image: imgCardamom,
        specs: {
          origin: { en: "Kerala, India", mr: "केरळ, भारत" },
          purity: { en: "99% min", mr: "९९% किमान" },
          moisture: { en: "12% max", mr: "१२% कमाल" },
          packaging: { en: "5kg / 10kg Jute bags with inner poly-lining", mr: "५ किलो / १० किलो पॉलि-लायनिंगसह जुट बॅग" }
        }
      },
      {
        id: "sp-2",
        name: {
          en: "Malabar Black Pepper (Demo)",
          mr: "मलबार काळी मिरी (डेमो)"
        },
        description: {
          en: "Premium bold black pepper (550 G/L to 580 G/L) sourced from Malabar region. Sun-dried and cleaned.",
          mr: "मलबार भागातून आणलेली प्रीमियम काळी मिरी (५५० G/L ते ५८० G/L). उन्हात सुकवलेली आणि स्वच्छ केलेली."
        },
        image: imgPepper,
        specs: {
          origin: { en: "Malabar Coast, India", mr: "मलबार किनारा, भारत" },
          purity: { en: "99.5% min", mr: "९९.५% किमान" },
          moisture: { en: "11.5% max", mr: "११.५% कमाल" },
          packaging: { en: "25kg / 50kg PP Bags", mr: "२५ किलो / ५० किलो पीपी बॅग" }
        }
      },
      {
        id: "sp-3",
        name: {
          en: "Polished Turmeric Fingers (Demo)",
          mr: "पॉलिश केलेली हळद (डेमो)"
        },
        description: {
          en: "High curcumin (3.5%+) finger rhizomes polished and sorted. Known for intense color and therapeutic value.",
          mr: "उच्च कुरकुमीन (३.५%+) हळकुंडे पॉलिश करून निवडलेली. गडद रंग आणि औषधी गुणांसाठी प्रसिद्ध."
        },
        image: imgTurmeric,
        specs: {
          origin: { en: "Erode / Sangli, India", mr: "इरोड / सांगली, भारत" },
          purity: { en: "99% min", mr: "९९% किमान" },
          moisture: { en: "10% max", mr: "१०% कमाल" },
          packaging: { en: "25kg Double-layered Gunny bags", mr: "२५ किलो दुहेरी पोते" }
        }
      }
    ]
  }
];

export const getCategoryById = (id) => categoriesData.find((c) => c.id === id);
