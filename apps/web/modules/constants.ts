export const SYSTEM_IDS = {
  IMAGE_ATTRIBUTE: '457a27af-7b0b-485c-ac07-aa37756adafa',
  DESCRIPTION: 'be5564ac-3953-4127-800a-9f9f22f2c610',
  DESCRIPTION_SCALAR: 'Description',
  NAME: 'name',
  SPACE: 'space',
  ATTRIBUTE: 'attribute',

  /* 
  Example Usage: Rhonda Patrick -> TYPES -> Person 
  Note that we should probably convert "type" to "types" or a UUID in the future.
  */
  TYPES: 'type',

  /* Example Usage: Person -> ATTRIBUTES -> Age */
  ATTRIBUTES: '01412f83-8189-4ab1-8365-65c7fd358cc1',

  /* Example Usage: Person -> TYPES -> SCHEMA_TYPE */
  SCHEMA_TYPE: 'd7ab4092-0ab5-441e-88c3-5c27952de773',

  VALUE_TYPE: 'e6eb4528-cb4d-4583-8efb-1791f698b8f8',

  /* Example Usage: City -> VALUE_TYPE -> RELATION */
  RELATION: '1fe3b500-3f78-4405-8a57-28c36b06bd99',

  /* Example Usage: Address -> VALUE_TYPE -> TEXT */
  TEXT: '0390a8a6-b48d-4d66-a3f1-e515ea8fe71e',
};

export const ZERO_WIDTH_SPACE = '\u200b';

export const PLACEHOLDER_IMAGES = {
  'San Francisco': 'https://cdn.discordapp.com/attachments/1010259815395754147/1047945562336534588/SF-image.png',
  Health: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15',
  Values: 'https://images.unsplash.com/photo-1637008336770-b95d637fd5fa',
};

export const HACKY_COPY_FILL_CLASS_NAME = 'hacky-copy-fill';
