const { makeExecutableSchema } = require('@graphql-tools/schema')
const merge = require('lodash.merge');

// const adminSchema = require('./admin');
const contentSchema = require('./content');

const schema = makeExecutableSchema({
  typeDefs: [
    // adminSchema.typeDefs,
    contentSchema.typeDefs,
  ],
  resolvers: merge(
    // adminSchema.resolvers,
    contentSchema.resolvers,
  )
});

module.exports = schema;
