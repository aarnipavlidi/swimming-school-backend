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

  type FooterLocationOptions {
    address: String
    postalCode: Int
    city: String
  }

  type FooterContactOptions {
    phoneNumber: Int
    email: String
  }

  type FooterOptions {
    location: FooterLocationOptions
    contact: FooterContactOptions
  }

  type Content {
    value: String!
    pricing: PricingOptions
    content: ContentOptions
    footer: FooterOptions
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
      getSource: String!
      getElement: String!
      getElementValue: [String!]
    ): Response

    updateLocation(
      getNewAddress: String!
      getNewPostalCode: Int!
      getNewCity: String!
    ): Response

    updatePhoneNumber(
      getNewNumber: Int!
    ): Response

    updateEmail(
      getNewEmail: String!
    ): Response

  }
`

module.exports = typeDefs;
