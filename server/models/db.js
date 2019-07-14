
const users = [
  {
    id: 1,
    email: 'chun@email.com',
    first_name: 'fortune',
    last_name: 'king',
    password: 'password',
    phoneNumber: '+2349039933771',
    address: '2 Boulevard street',
    is_admin: true
  },
  {
    id: 2,
    email: 'chun@email.com',
    first_name: 'fortune',
    last_name: 'king',
    password: 'password',
    phoneNumber: '+2349039933771',
    address: '2 Boulevard street',
    is_admin: true
  }
];

const property = [
  {
    id: 1,
    owner: 'chun@email.com',
    status: 'available',
    price: '1000',
    state: 'Lagos',
    city: 'Lagos',
    address: '2 Boulevard street',
    type: '2 bedroom',
    created_on: new Date().toDateString(),
    image_url: 'https://res.cloudinary.com/chunkingz/image/upload/v1562322246/mh7swnfgxxmdew5c7chf.png',
  },
  {
    id: 2,
    owner: 'chun@email.com',
    status: 'available',
    price: '1000',
    state: 'Lagos',
    city: 'Lagos',
    address: '2 Boulevard street',
    type: '2 bedroom',
    created_on: new Date().toDateString(),
    image_url: 'https://res.cloudinary.com/chunkingz/image/upload/v1562322246/mh7swnfgxxmdew5c7chf.png',
  },
];

const flags = [
  {
    id: 1,
    property_id: '1',
    created_on: '',
    reason: 'Pricing/Weird demands',
    description: 'read more...'
  },
  {
    id: 2,
    property_id: '1',
    created_on: '',
    reason: 'Pricing/Weird demands',
    description: 'read more...'
  }
];

export default { users, property, flags };
