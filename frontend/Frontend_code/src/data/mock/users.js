// Seeded demonstration accounts; passwords are documented in README, hashes only here.
export const DEMO_USERS = [
  {
    "id": "buyer-1",
    "name": "John Doe",
    "email": "procurement@skywest-demo.com",
    "companyName": "SkyWest Airlines",
    "role": "buyer",
    "active": true,
    "passwordSalt": "f9b9b20c0d54fc1ebd93ed5cc4dbb9e1",
    "passwordHash": "494e5dec22ae3375093ea785f83da016beab51e77efb6ad6978073a6af6de584"
  },
  {
    "id": "sup-1",
    "name": "Safran Store Manager",
    "email": "seller@safran-demo.com",
    "companyName": "Safran Certified Aerospace",
    "role": "supplier",
    "active": true,
    "passwordSalt": "a07e7012e47a60fce164d24b8165ca84",
    "passwordHash": "598a80ca1f571eb4a2ebcbf31833ce49890a9b417e4988c5b574d30610b1ea12"
  },
  {
    "id": "admin-1",
    "name": "Platform Admin",
    "email": "admin@aerorul-demo.com",
    "companyName": "AeroRUL Operations",
    "role": "admin",
    "active": true,
    "passwordSalt": "5fa1a31fbdd54bc5866045cab790aed7",
    "passwordHash": "421cbdd6a6d329f9d86203d02544fb24e1829b5295fd5897407f004fc5204069"
  }
];
