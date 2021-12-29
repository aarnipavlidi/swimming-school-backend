const { gql } = require('apollo-server');

const typeDefs = gql`

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
    showCurrentContent: [Content]
  }

  type Mutation {
    updatePricing(
      OneTimeSolo: Int
      OneTimeDuo: Int
      ThreeTimeSolo: Int
      ThreeTimeDuo: Int
      FiveTimeSolo: Int
      FiveTimeDuo: Int
    ): Response
  }
`

module.exports = typeDefs;
