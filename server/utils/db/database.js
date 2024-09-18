const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

// Access the environment file
// Switch between .env.development and .env.production state
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = async (req, res, next) => {
  req.dbClient = client;
  req.db = client.db(process.env.DATABASE_NAME);
  return next();
};

module.exports = database;
