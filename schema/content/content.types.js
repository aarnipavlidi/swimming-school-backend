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
    postalCode: String
    city: String
  }

  type FooterContactOptions {
    phoneNumber: String
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
      getNewPostalCode: String!
      getNewCity: String!
    ): Response

    updatePhoneNumber(
      getNewNumber: String!
    ): Response

    updateEmail(
      getNewEmail: String!
    ): Response

  }
`

module.exports = typeDefs;
