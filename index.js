require('dotenv').config();
const { ApolloServer, gql, UserInputError } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const mongoose = require('mongoose');
const Admins = require('./models/admins');
const Contents = require('./models/contents');

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

  type AdminNotFoundError {
    response: String
  }

  union AdminResponse = Admin | AdminNotFoundError

  type Token {
    value: String!
  }

  type Response {
    response: String!
  }

  type PricingOptions {
    OneTimeSolo: Int
    OneTimeDuo: Int
    ThreeTimeSolo: Int
    ThreeTimeDuo: Int
    FiveTimeSolo: Int
    FiveTimeDuo: Int
  }

  type Content {
    value: String!
    pricing: PricingOptions
  }

  type Query {
    me: AdminResponse!
    showCurrentContent: [Content]
  }

  type Mutation {
    createAdmin(
      name: String!
      username: String!
      password: String!
    ): Admin!

    updatePricing(
      OneTimeSolo: Int
      OneTimeDuo: Int
      ThreeTimeSolo: Int
      ThreeTimeDuo: Int
      FiveTimeSolo: Int
      FiveTimeDuo: Int
    ): Response

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
        return {
          __typename: "Admin",
          _id: currentAdminData._id,
          name: currentAdminData.name,
          username: currentAdminData.username,
        }
      } catch (error) {
        return {
          __typename: "AdminNotFoundError",
          response: error.message
        }
      }
    },

    showCurrentContent: async () => {
      try {
        const getContent = await Contents.find({});
        return getContent;
      } catch (error) {
        throw error
      }
    },
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

    updatePricing: async (_, { OneTimeSolo, OneTimeDuo, ThreeTimeSolo, ThreeTimeDuo, FiveTimeSolo, FiveTimeDuo }, context) => {

      const loggedAdminID = await context.currentAdminLogged?._id === undefined
        ? null
        : context.currentAdminLogged._id;
        
      try {

        const findCurrentPricing = await Contents.findOne({ value: "Pricing" });

        const updateCurrentPricing = {
          $set: {
            "pricing": {
              "OneTimeSolo": OneTimeSolo,
              "OneTimeDuo": OneTimeDuo,
              "ThreeTimeSolo": ThreeTimeSolo,
              "ThreeTimeDuo": ThreeTimeDuo,
              "FiveTimeSolo": FiveTimeSolo,
              "FiveTimeDuo": FiveTimeDuo,
            }
          }
        }; 

        if (!findCurrentPricing) {
          const newPricingTemplate = new Contents({
            value: "Pricing",
            pricing: {
              OneTimeSolo: OneTimeSolo,
              OneTimeDuo: OneTimeDuo,
              ThreeTimeSolo: ThreeTimeSolo,
              ThreeTimeDuo: ThreeTimeDuo,
              FiveTimeSolo: FiveTimeSolo,
              FiveTimeDuo: FiveTimeDuo
            },
          });

          await newPricingTemplate.save();
          return {
            response: "There was no records of previous pricing template. Template with default values has been added successfully!"
          };
        };

        if (!loggedAdminID) {
          throw new Error('Could not update the current prices. You are either not authorized or you are not logged in, please login!')
        } else {

          await Contents.collection.findOneAndUpdate(findCurrentPricing, updateCurrentPricing);
          return {
            response: "You have successfully updated current prices into database!"
          }
        }
      } catch (error) {
        return {
          response: error.message
        };
      };
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
