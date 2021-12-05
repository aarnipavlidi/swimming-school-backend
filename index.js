require('dotenv').config();
const { ApolloServer, gql, UserInputError } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const mongoose = require('mongoose');
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

const typeDefs = gql`

  type Admin {
    _id: ID!
    name: String!
    username: String!
  }

  type Token {
    value: String!
  }

  type Response {
    response: String!
  }

  type Query {
    me: Admin
  }

  type Mutation {
    createAdmin(
      name: String!
      username: String!
      password: String!
    ): Admin!

    loginAdmin(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {

    me: async (root, args, context) => {
      try {
        const currentAdminData = await Admins.findById(context.currentAdminLogged.id)
        return currentAdminData
      } catch (error) {
        throw error
      }
    }
  },

  Mutation: {

    createAdmin: async (_, { name, username, password }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admins({ name, username, password: hashedPassword })
        await newAdmin.save()
        return newAdmin
      } catch (error) {
        throw error
      }
    },

    loginAdmin: async (root, args) => {
      const findCurrentAdmin = await Admins.findOne({ username: args.username })

      if (!findCurrentAdmin) {
        throw new UserInputError('You tried to login with wrong credentials. Please try again!')
      }

      const checkPasswordMatch = await bcrypt.compare(args.password, findCurrentAdmin.password)

      if (!checkPasswordMatch) {
        throw new UserInputError('You tried to login with wrong credentials. Please try again!')
      } else {
        const tokenForAdmin = {
          id: findCurrentAdmin._id,
          username: findCurrentAdmin.username
        }

        return {
          value: jwt.sign(tokenForAdmin, JWT_SECRET)
        }
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
