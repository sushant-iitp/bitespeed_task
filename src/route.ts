import express, { Request, Response } from 'express';
import { pool } from './dbinit';

export const app = express();
app.use(express.json());


//Processing the POST request
app.post('/identify', async (req: Request, res: Response) => {
    try {
      const { email, phoneNumber } = req.body;
      let primaryContactId;
  
      // Check if contact already exists or not
      const [existingContacts] = await pool.query<any[]>(
        'SELECT * FROM contacts WHERE (email = ? OR phoneNumber = ?)',
        [email, phoneNumber]
      );
  
      // Insert new "primary" contact if new user
      if (existingContacts.length === 0) {
        
        const insertQuery = 'INSERT INTO contacts (phoneNumber, email, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, "primary", NOW(), NOW())';
        const selectQuery = 'SELECT LAST_INSERT_ID() AS id';
  
        await pool.query(insertQuery, [phoneNumber, email]);
  
        // Execute the select query to retrieve the last inserted ID
        const [rows] = await pool.query<any[]>(selectQuery);
  
        // Access the ID value from the result
        primaryContactId = rows[0].id;
      }else {
        const hasEmail = existingContacts.some((contact) => contact.email === email);
        const hasPhoneNumber = existingContacts.some((contact) => contact.phoneNumber === phoneNumber);
        
        //Update if both the email & phoneNumber values are in the database
        if (hasEmail && hasPhoneNumber) {
          const oldestContact = existingContacts.reduce((oldest, contact) => {
            if (!oldest || contact.createdAt < oldest.createdAt) {
              return contact;
            }
            return oldest;
          });
  
          if (oldestContact.linkPrecedence === 'primary') {
            primaryContactId = existingContacts[0].id;
          } else {
            primaryContactId = existingContacts[0].linkedId;
          }
  
          await pool.query('UPDATE contacts SET linkPrecedence = "secondary", linkedId = ?, updatedAt = NOW() WHERE (email = ? OR phoneNumber = ?) AND id != ?', [primaryContactId, email, phoneNumber, primaryContactId]);
        } else {
          // Insert new value when 1 of the parameter is unique
          const existingContact = existingContacts[0];
          if (existingContact.linkPrecedence === 'primary') {
            primaryContactId = existingContact.id;
          } else {
            primaryContactId = existingContact.linkedId;
          }
  
          if (((email !== null) && (phoneNumber !== null)) && ((email !='') && (phoneNumber !=''))) {
            await pool.query('INSERT INTO contacts (phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, ?, "secondary", NOW(), NOW())',[phoneNumber, email, primaryContactId]);
          }
        }
      }
  
      // Generate response using queryResponse function
      const response = await queryResponse(primaryContactId);
      res.json(response);
    } catch (error) {
      console.error('Error processing identify request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
   async function queryResponse(primaryContactId: number) {
    try {
      // Fetch primary contact
      const [primaryContact] = await pool.query<any[]>(
        'SELECT * FROM contacts WHERE id = ?',
        [primaryContactId]
      );
  
      // Fetch secondary contacts
      const [secondaryContacts] = await pool.query<any[]>(
        'SELECT DISTINCT * FROM contacts WHERE linkedId = ? AND linkPrecedence = "secondary"',
        [primaryContactId]
      );

      // Extract emails, phone numbers, and secondary contact IDs
      const emails = [primaryContact[0].email];
      const phoneNumbers = [primaryContact[0].phoneNumber];
      const secondaryContactIds = secondaryContacts.map((contact: any) => contact.id);
  

      // Iterate over secondary contacts to collect unique emails and phone numbers
      for (const contact of secondaryContacts) {
        if (!emails.includes(contact.email)) {
          emails.push(contact.email);
      }

      if (!phoneNumbers.includes(contact.phoneNumber)) {
        phoneNumbers.push(contact.phoneNumber);
      }
      }
  
      // Build response object
      const response = {
        contact: {
          primaryContactId,
          emails,
          phoneNumbers,
          secondaryContactIds,
          },
      };
  
      return response;
    } catch (error) {
      console.error('Error retrieving query response:', error);
      throw error;
    }
  }