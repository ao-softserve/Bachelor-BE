const graphql = require("graphql");

export default new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      message: {
        type: graphql.GraphQLString,
        resolve() {
          return "Hello World!";
        }
      }
    }
  })
});
