import { app } from './route';
import { createDatabaseAndTable } from './dbinit';
require('dotenv').config();

const port = 3000;

async function startServer() {
  try {
    await createDatabaseAndTable();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();