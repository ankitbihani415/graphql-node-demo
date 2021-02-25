var { buildSchema } = require('graphql');

module.exports = {
    // Construct a schema, using GraphQL schema language
    helloSchema : buildSchema(`
        type Query {
            hello: String
        }
    `),
 
    // The root provides a resolver function for each API endpoint
    helloRoot : {
        hello: () => {
            return 'Hello world from graphql!';
        },
    },
}