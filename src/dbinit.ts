import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function createDatabaseAndTable(): Promise<void> {
  try {
    // Create the database
    await pool.query('CREATE DATABASE IF NOT EXISTS bokqy9ixaaruya8lg1yi');

    // Select the database to use
    await pool.query('USE bokqy9ixaaruya8lg1yi');

    // Create the contacts table
    const sql = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phoneNumber VARCHAR(20),
        email VARCHAR(100),
        linkedId INT,
        linkPrecedence ENUM('secondary', 'primary'),
        createdAt DATETIME,
        updatedAt DATETIME,
        deletedAt DATETIME
      )
    `;
    await pool.query(sql);
  } catch (error) {
    console.error('Error creating database and table:', error);
    process.exit(1);
  }
}
