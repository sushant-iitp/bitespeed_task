"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseAndTable = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
async function createDatabaseAndTable() {
    try {
        // Create the database
        await exports.pool.query('CREATE DATABASE IF NOT EXISTS bokqy9ixaaruya8lg1yi');
        // Select the database to use
        await exports.pool.query('USE bokqy9ixaaruya8lg1yi');
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
        await exports.pool.query(sql);
    }
    catch (error) {
        console.error('Error creating database and table:', error);
        process.exit(1);
    }
}
exports.createDatabaseAndTable = createDatabaseAndTable;
