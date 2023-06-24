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
  
      // Build response object
      const response = {
        contact: {
          primaryContactId,
          emails,
          phoneNumbers,
        //  to be inserted secondaryContactIds,
        },
      };
  
      return response;
    } catch (error) {
      console.error('Error retrieving query response:', error);
      throw error;
    }
  }