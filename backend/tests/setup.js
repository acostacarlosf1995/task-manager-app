const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);
    } catch (e) {
        console.error('[Test Setup] Error in beforeAll setup:', e);
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    } catch (e) {
        console.error('[Test Setup] Error in afterAll teardown:', e);
    }
});

beforeEach(async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    } catch (e) {
        console.error('[Test Setup] Error in beforeEach clearing DB:', e);
    }
});