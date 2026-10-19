// Illustrative business details for the two seeded orders only; not real invoices.
export const ORDERS = [
  {
    "id": "ORD-1004",
    "buyerId": "buyer-1",
    "items": [
      {
        "productId": "prod-101",
        "quantity": 1,
        "price": 62400
      }
    ],
    "status": "Shipped",
    "placedAt": "2026-09-05",
    "total": 62400,
    "sampleRecord": true,
    "tax": null,
    "taxStatus": "Not calculated — sample invoice",
    "payment": {
      "method": "invoice",
      "label": "Invoice · Net 30",
      "billingName": "John Doe (demo)",
      "billingEmail": "procurement@skywest-demo.com",
      "billingAddress": "3200 Demo Airport Road, Salt Lake City, US",
      "status": "Demo invoice issued",
      "terms": "Net 30",
      "simulated": true
    },
    "shippingInfo": {
      "companyName": "SkyWest Airlines",
      "taxId": "DEMO-TAX-SKYWEST",
      "purchaseRef": "DEMO-PO-ORD-1004",
      "address": "3200 Demo Airport Road, Salt Lake City, US",
      "deliveryMethod": "Standard freight",
      "paymentMethod": "Invoice · Net 30",
      "payment": {
        "method": "invoice",
        "label": "Invoice · Net 30",
        "billingName": "John Doe (demo)",
        "billingEmail": "procurement@skywest-demo.com",
        "billingAddress": "3200 Demo Airport Road, Salt Lake City, US",
        "status": "Demo invoice issued",
        "terms": "Net 30",
        "simulated": true
      }
    }
  },
  {
    "id": "ORD-1002",
    "buyerId": "buyer-1",
    "items": [
      {
        "productId": "prod-103",
        "quantity": 2,
        "price": 6300
      }
    ],
    "status": "Delivered",
    "placedAt": "2026-08-22",
    "total": 12600,
    "sampleRecord": true,
    "tax": null,
    "taxStatus": "Not calculated — sample invoice",
    "payment": {
      "method": "invoice",
      "label": "Invoice · Net 30",
      "billingName": "John Doe (demo)",
      "billingEmail": "procurement@skywest-demo.com",
      "billingAddress": "3200 Demo Airport Road, Salt Lake City, US",
      "status": "Demo invoice issued",
      "terms": "Net 30",
      "simulated": true
    },
    "shippingInfo": {
      "companyName": "SkyWest Airlines",
      "taxId": "DEMO-TAX-SKYWEST",
      "purchaseRef": "DEMO-PO-ORD-1002",
      "address": "3200 Demo Airport Road, Salt Lake City, US",
      "deliveryMethod": "Standard freight",
      "paymentMethod": "Invoice · Net 30",
      "payment": {
        "method": "invoice",
        "label": "Invoice · Net 30",
        "billingName": "John Doe (demo)",
        "billingEmail": "procurement@skywest-demo.com",
        "billingAddress": "3200 Demo Airport Road, Salt Lake City, US",
        "status": "Demo invoice issued",
        "terms": "Net 30",
        "simulated": true
      }
    }
  }
];
