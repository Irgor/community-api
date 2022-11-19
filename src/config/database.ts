const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
// const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.qpbxg.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

const MONGO_URL = 'mongodb://localhost:27017/' + MONGO_DATABASE;

export const databaseConfig = {
    url: MONGO_URL
}