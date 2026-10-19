export const PRODUCTS = [
  {
    "id": "prod-101",
    "name": "CFM56-7B High-Pressure Turbine Blade Set",
    "partNumber": "HPT-7B-3391",
    "categoryId": "cat-turbine",
    "price": 62400,
    "currency": "USD",
    "stock": 12,
    "condition": "New",
    "compatibility": [
      "CFM56-7B"
    ],
    "supplierId": "sup-1",
    "rating": 4.7,
    "deliveryDays": 5,
    "compatibilityScore": 98,
    "image": "turbine-blade",
    "replacementGroup": "hpt-blade-set"
  },
  {
    "id": "prod-102",
    "name": "CFM56-7B Combustor Assembly",
    "partNumber": "CMB-7B-1120",
    "categoryId": "cat-turbine",
    "price": 42500,
    "currency": "USD",
    "stock": 4,
    "condition": "New",
    "compatibility": [
      "CFM56-7B"
    ],
    "supplierId": "sup-2",
    "rating": 4.5,
    "deliveryDays": 9,
    "compatibilityScore": 95,
    "image": "combustor",
    "replacementGroup": "combustor-assembly"
  },
  {
    "id": "prod-103",
    "name": "CFM56-7B Main Shaft Bearing",
    "partNumber": "BRG-7B-0087",
    "categoryId": "cat-bearing",
    "price": 6300,
    "currency": "USD",
    "stock": 21,
    "condition": "New",
    "compatibility": [
      "CFM56-7B",
      "CFM56-5B"
    ],
    "supplierId": "sup-1",
    "rating": 4.9,
    "deliveryDays": 3,
    "compatibilityScore": 91,
    "image": "bearing",
    "replacementGroup": "main-shaft-bearing"
  },
  {
    "id": "prod-104",
    "name": "V2500 Compressor Rotor",
    "partNumber": "CMP-V25-4471",
    "categoryId": "cat-compressor",
    "price": 51200,
    "currency": "USD",
    "stock": 2,
    "condition": "Refurbished",
    "compatibility": [
      "V2500"
    ],
    "supplierId": "sup-3",
    "rating": 4.1,
    "deliveryDays": 14,
    "compatibilityScore": 88,
    "image": "compressor",
    "replacementGroup": "compressor-rotor"
  },
  {
    "id": "prod-105",
    "name": "CFM56-7B Vibration Sensor Kit",
    "partNumber": "SNS-7B-0022",
    "categoryId": "cat-sensor",
    "price": 2100,
    "currency": "USD",
    "stock": 40,
    "condition": "New",
    "compatibility": [
      "CFM56-7B"
    ],
    "supplierId": "sup-2",
    "rating": 4.6,
    "deliveryDays": 2,
    "compatibilityScore": 100,
    "image": "sensor",
    "replacementGroup": "vibration-sensor"
  },
  {
    "id": "prod-106",
    "name": "CFM56-7B Exchange Engine (Short-Term Lease)",
    "partNumber": "ENG-7B-EXC",
    "categoryId": "cat-engine",
    "price": 1850000,
    "currency": "USD",
    "stock": 1,
    "condition": "Exchange",
    "compatibility": [
      "CFM56-7B"
    ],
    "supplierId": "sup-1",
    "rating": 4.8,
    "deliveryDays": 30,
    "compatibilityScore": 96,
    "image": "engine",
    "replacementGroup": "complete-engine"
  },
  {
    "id": "prod-107",
    "name": "CFM56-7B HPT Blade Set — Overhauled",
    "partNumber": "HPT-7B-3391-OH",
    "categoryId": "cat-turbine",
    "price": 48900,
    "currency": "USD",
    "stock": 6,
    "condition": "Refurbished",
    "compatibility": [
      "CFM56-7B"
    ],
    "supplierId": "sup-2",
    "rating": 4.7,
    "deliveryDays": 4,
    "compatibilityScore": 97,
    "image": "turbine-blade",
    "replacementGroup": "hpt-blade-set"
  },
  {
    "id": "prod-108",
    "name": "V2500 Compressor Rotor — Certified Exchange",
    "partNumber": "CMP-V25-4471-EX",
    "categoryId": "cat-compressor",
    "price": 47300,
    "currency": "USD",
    "stock": 5,
    "condition": "Exchange",
    "compatibility": [
      "V2500"
    ],
    "supplierId": "sup-1",
    "rating": 4.1,
    "deliveryDays": 6,
    "compatibilityScore": 93,
    "image": "compressor",
    "replacementGroup": "compressor-rotor"
  }
];
export const SUPPLIERS = [
  {
    "id": "sup-1",
    "name": "Safran Certified Aerospace",
    "verified": true,
    "rating": 4.8,
    "region": "US"
  },
  {
    "id": "sup-2",
    "name": "AeroEngine Solutions",
    "verified": true,
    "rating": 4.6,
    "region": "EU"
  },
  {
    "id": "sup-3",
    "name": "Nordic MRO Parts",
    "verified": false,
    "rating": 4.2,
    "region": "APAC"
  }
];
export const CATEGORIES = [
  {
    "id": "cat-engine",
    "name": "Engines"
  },
  {
    "id": "cat-turbine",
    "name": "Turbine Components"
  },
  {
    "id": "cat-compressor",
    "name": "Compressor Parts"
  },
  {
    "id": "cat-bearing",
    "name": "Bearings"
  },
  {
    "id": "cat-sensor",
    "name": "Sensors"
  }
];
