require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const mongoose = require('mongoose');
const schema = require('./schema');
const Admins = require('./models/admins');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

const database = process.env.MONGODB_URI;
console.log('Connecting to the following server:', database);

mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to the MongoDB! :)')
  })
  .catch((error) => {
    console.log('There was problem while trying connect to the MongoDB! Error was following:', error.message)
  });

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  context: async ({ req }) => {

    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentAdminLogged = await Admins.findById(decodedToken.id)

      return {
        currentAdminLogged
      }
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`)
});
