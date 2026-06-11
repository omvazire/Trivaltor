import imgCardamom from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM.jpeg';
import imgPepper from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM (1).jpeg';
import imgTurmeric from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM (2).jpeg';
import imgCumin from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.31 PM (3).jpeg';
import imgCloves from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.34 PM.jpeg';
import imgChilli from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.34 PM (1).jpeg';
import imgCoriander from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.35 PM.jpeg';
import imgFennel from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.36 PM.jpeg';
import imgCinnamon from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.37 PM.jpeg';
import imgStarAnise from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.37 PM (1).jpeg';
import imgGinger from '../assets/images/WhatsApp Image 2026-06-09 at 7.43.37 PM (2).jpeg';

export const products = [
  {
    id: 'p-1',
    name: 'Premium Green Cardamom',
    category: 'Spices',
    description: 'Selected handpicked green cardamom capsules (sizes 7mm to 8mm+), sourcing directly from local Kerala estates. Highly aromatic, rich in essential oils.',
    image: imgCardamom,
    specs: {
      purity: '99% min',
      moisture: '12% max',
      origin: 'Kerala, India',
      packaging: '5kg / 10kg Jute bags with inner poly-lining'
    }
  },
  {
    id: 'p-2',
    name: 'Malabar Black Pepper',
    category: 'Spices',
    description: 'Premium bold black pepper (550 G/L to 580 G/L) sourced from Malabar region. Sun-dried, cleaned, free from mould or infestation.',
    image: imgPepper,
    specs: {
      purity: '99.5% min',
      moisture: '11.5% max',
      origin: 'Malabar Coast, India',
      packaging: '25kg / 50kg PP Bags'
    }
  },
  {
    id: 'p-3',
    name: 'Polished Turmeric Fingers',
    category: 'Spices',
    description: 'High curcumin (3.5%+) finger rhizomes polished and sorted. Known for its intense color and therapeutic value.',
    image: imgTurmeric,
    specs: {
      purity: '99% min',
      moisture: '10% max',
      origin: 'Erode / Sangli, India',
      packaging: '25kg Double-layered Gunny bags'
    }
  },
  {
    id: 'p-4',
    name: 'Aromatic Cumin Seeds',
    category: 'Seeds',
    description: 'Machine cleaned Singapore quality 99% purity cumin seeds. Excellent earthy flavor and pungent aroma.',
    image: imgCumin,
    specs: {
      purity: '99% min',
      moisture: '9% max',
      origin: 'Gujarat / Rajasthan, India',
      packaging: '25kg Kraft Paper bags'
    }
  },
  {
    id: 'p-5',
    name: 'Zanzibar Style Cloves',
    category: 'Spices',
    description: 'Rich, dried flower buds of Syzygium aromaticum. Headpicked cloves, sorted to remove stems and headless cloves.',
    image: imgCloves,
    specs: {
      purity: '99% min',
      moisture: '12% max',
      origin: 'Southern India',
      packaging: '10kg / 20kg Carton boxes'
    }
  },
  {
    id: 'p-6',
    name: 'Guntur Red Chilli',
    category: 'Spices',
    description: 'Premium Guntur S17 Teja red chillies, sun-dried with stems or stemless. High heat index (SHU) and bright red color.',
    image: imgChilli,
    specs: {
      purity: '98.5% min',
      moisture: '11% max',
      origin: 'Andhra Pradesh, India',
      packaging: '25kg Jute bags'
    }
  },
  {
    id: 'p-7',
    name: 'Coriander Seeds (Badami)',
    category: 'Seeds',
    description: 'Light green Badami quality coriander seeds. Cleaned and sortex graded, possessing a mild citrus aroma.',
    image: imgCoriander,
    specs: {
      purity: '98% min',
      moisture: '9.5% max',
      origin: 'Madhya Pradesh, India',
      packaging: '20kg PP Bags'
    }
  },
  {
    id: 'p-8',
    name: 'Fennel Seeds (Saunf)',
    category: 'Seeds',
    description: 'Medium and bold size green fennel seeds, machine cleaned. Great cooling properties and aromatic sweetness.',
    image: imgFennel,
    specs: {
      purity: '99% min',
      moisture: '10% max',
      origin: 'Gujarat, India',
      packaging: '25kg Bags'
    }
  },
  {
    id: 'p-9',
    name: 'Cinnamon Bark (Cassia)',
    category: 'Spices',
    description: 'Premium cassia cinnamon bark rolls, scraped and dried. Intense warm flavor, perfect for sweet and savory blending.',
    image: imgCinnamon,
    specs: {
      purity: '99% min',
      moisture: '13% max',
      origin: 'Imported / Domestic sorted',
      packaging: '25kg Cartons'
    }
  },
  {
    id: 'p-10',
    name: 'Whole Star Anise',
    category: 'Spices',
    description: 'Beautiful star-shaped seed pods, select whole grade with minimal broken stars. Distinct sweet, licorice-like aroma.',
    image: imgStarAnise,
    specs: {
      purity: '99% min',
      moisture: '11% max',
      origin: 'Assam Hills, India',
      packaging: '10kg Carton Boxes'
    }
  },
  {
    id: 'p-11',
    name: 'Sun-Dried Ginger (Nagar Grade)',
    category: 'Spices',
    description: 'Unbleached ginger rhizomes, thoroughly washed and sun-dried. Sharp spicy taste, excellent for grinding.',
    image: imgGinger,
    specs: {
      purity: '98.5% min',
      moisture: '12% max',
      origin: 'Karnataka / Kerala, India',
      packaging: '25kg PP bags with inner lining'
    }
  }
];

export const getProductById = (id) => products.find((p) => p.id === id);
export const getProductsByCategory = (cat) => products.filter((p) => p.category === cat);
export const getAllCategories = () => ['All', ...new Set(products.map((p) => p.category))];
