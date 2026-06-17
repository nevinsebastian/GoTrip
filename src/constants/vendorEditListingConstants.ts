export const VENDOR_EDIT_LISTING_COPY = {
  propertyNumber: (ref: string) => `Property Number # : ${ref}`,
  addNewPhotos: 'Add new photos',
  uploadFromDevice: 'Upload from device',
  titleLabel: 'Title',
  descriptionLabel: 'Description',
  highlightsLabel: 'Choose upto 2 highlights',
  amenitiesLabel: 'Amenities',
  addNew: 'Add New',
  priceLabel: 'Enter the price details',
  priceHint: 'Places like your usually range from ₹1000 - ₹3000',
  goBack: 'Go back',
  saveChanges: 'Save changes',
};

export const VENDOR_EDIT_LISTING_HIGHLIGHTS = [
  { id: 'peaceful', label: 'Peaceful' },
  { id: 'unique', label: 'Unique' },
  { id: 'central', label: 'Central' },
  { id: 'family', label: 'Family-friendly' },
];

export const VENDOR_EDIT_LISTING_AMENITIES = [
  { id: 'bathroom', label: 'Private Bathroom', icon: 'water-outline' as const },
  { id: 'kitchen', label: 'Kitchen', icon: 'restaurant-outline' as const },
  { id: 'parking', label: 'Parking', icon: 'car-outline' as const },
  { id: 'pool', label: 'Private Pool', icon: 'water-outline' as const },
  { id: 'wifi', label: 'Wifi', icon: 'wifi-outline' as const },
  { id: 'ac', label: 'Air conditioning', icon: 'snow-outline' as const },
  { id: 'breakfast', label: 'Breakfast', icon: 'cafe-outline' as const },
  { id: 'tv', label: 'TV', icon: 'tv-outline' as const },
];

export const VENDOR_EDIT_LISTING_DEFAULT = {
  listingRef: 'P27641',
  propertyName: 'Opus Homes, Varkala',
  title: 'Place to stay in Varkala, with beach view.',
  description: 'Enjoy a stylish experience at this centrally located place',
  descriptionMax: 150,
  price: 2420,
  priceMin: 1000,
  priceMax: 3000,
  defaultHighlights: ['peaceful'],
  photos: [
    require('../../assets/images/glamping.jpg'),
    require('../../assets/images/glampingbg.jpg'),
    require('../../assets/images/backgroundimagehomehotels.jpg'),
    require('../../assets/images/packageexpanded.jpg'),
    require('../../assets/images/activityoffer.jpg'),
  ],
};
