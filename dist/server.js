"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const dbinit_1 = require("./dbinit");
require('dotenv').config();
const port = 3000;
async function startServer() {
    try {
        await (0, dbinit_1.createDatabaseAndTable)();
        route_1.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
startServer();
