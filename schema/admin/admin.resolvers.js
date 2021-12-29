const { UserInputError } = require('apollo-server');
const Admins = require('../../models/admins');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

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

module.exports = resolvers
