require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const mongoose = require('mongoose');
const schema = require('./schema');

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

function getKey(header, cb){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
};

const options = {
  audience: [
    process.env.AUTH0_AUDIENCE_API,
    process.env.AUTH0_AUDIENCE_USER
  ],
  issuer: process.env.AUTH0_DOMAIN_NAME,
  algorithms: ['RS256'],
};

const database = process.env.MONGODB_URI;

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
  context: ({ req }) => {
    
    const getTokenValue = req.headers?.authorization ? req.headers.authorization : null;

    if (getTokenValue.length !== 4 && getTokenValue !== null) {

      const currentAdminData = new Promise(( resolve ) => {

        jwt.verify(getTokenValue, getKey, options, (error, decoded) => {

          if (error) {
            console.log(error.message);
            // For this context part I got code block from here: https://github.com/auth0-blog/book-app/blob/master/api/src/server.js
            // but there was an issue and I was not able to figure it out. If this condition,
            // error is true, then "return reject(error)" function would crash the server.
            // Tried to fix it, while using the "reject(...)" function, but was not able to.
            // I made a "dirty fix" and I am returning "resolve(...)" function, which has
            // inside the "errorResponse" object with current "error.message" data. This
            // way I will let the resolver itself catch the error and act accordingly.
            return resolve({
              errorResponse: error.message
            })
          };

          resolve(decoded);
        });
      });

      return {
        currentAdminData
      };
    }

    return {
      currentAdminData: {
        errorResponse: "Token value is missing. Please add one and try again!"
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`)
});
