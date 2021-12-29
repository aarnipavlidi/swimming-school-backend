const { gql } = require('apollo-server');

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

  type Query {
    me: AdminResponse!
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

module.exports = typeDefs;
