# Bitespeed Backend Task: Identity Reconciliation

Welcome to our project! This is an Identity Reconciliation Service built using TypeScript, Node.js, and the Express.js framework.

## Overview

Our service collects contact details such as email and phone number, and it links different contact information to the same person if any of the provided information is found to be repeated. If any of the provided values are unique, the service creates new contacts.

## Accessing the Service

The service can be accessed by sending a POST request with a JSON body to the following URL:

URL: `https://bitespeed-task.onrender.com/identify`

## Request Format

The POST request should include a JSON body with the following fields:

- `email`: The email address of the contact (string).
- `phoneNumber`: The phone number of the contact (string).

Example Request:
```json
{
  "email": "sample@example.com",
  "phoneNumber": "1234567890"
}
```

## Response Format

The service will respond with a JSON object containing the reconciliation result. The response will include the following fields:

- `contact`: An object representing the reconciled contact.
  - `primaryContactId`: The ID of the primary contact (number).
  - `emails`: An array of email addresses associated with the contact (array of strings).
  - `phoneNumbers`: An array of phone numbers associated with the contact (array of strings).
  - `secondaryContactIds`: An array of IDs of secondary contacts linked to the primary contact (array of numbers).

Example Response:
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["sample@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}
```

## Usage Example

Here's an example of how to use the service using JavaScript and the `axios` library:

```javascript
const axios = require('axios');

const url = 'https://bitespeed-task.onrender.com/identify';
const payload = {
  "email": "example@example.com",
  "phoneNumber": "1234567890"
};

axios.post(url, payload)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('An error occurred:', error.message);
  });
```

Feel free to explore and experiment with the service using different contact details.

Thank you for using our Identity Reconciliation Service! If you have any questions or need further assistance, please don't hesitate to reach out.