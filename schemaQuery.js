var InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
var ApolloClient = require("apollo-client").ApolloClient;
var gql = require("graphql-tag");
var PrismicLink = require("apollo-link-prismic").PrismicLink;
	
const client = new ApolloClient({
  link: PrismicLink({
    uri: "https://seahshaochengcom.prismic.io/graphql",
    accessToken: "MC5YVnF5RlJNQUFDQUF4eVl3.WjZM77-9Ke-_vX8J77-9Mu-_ve-_ve-_ve-_vTAa77-9eu-_vRfvv71oUA5vAu-_vSTvv73vv71LVA"
  }),
  cache: new InMemoryCache()
});
const fs = require('fs');

client.query({
  query: gql`
  query{
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }
  `
}).then(result => {
  // here we're filtering out any type information unrelated to unions or interfaces
  const filteredData = result.data.__schema.types.filter(
    type => type.possibleTypes !== null,
  );
  result.data.__schema.types = filteredData;
  fs.writeFile('./src/apis/fragmentTypes.json', JSON.stringify(result.data), err => {
    if (err) console.error('Error writing fragmentTypes file', err);
    console.log('Fragment types successfully extracted!');
  });
}).catch(error => {
  console.error(error);
});
