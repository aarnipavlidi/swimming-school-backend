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

  type ContentOptions {
    primaryElement: [String]
    secondaryElement: [String]
  }

  type Content {
    value: String!
    pricing: PricingOptions
    content: ContentOptions
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

    updateContent(
      getElement: String!
      getElementValue: [String!]
    ): Response
  }
`

module.exports = typeDefs;
