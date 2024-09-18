const { ApolloServer, gql } = require('apollo-server');
const { addUser, getUsers,filterUsers, deleteUser } = require('./database');
const { validateEmail } = require('./utils');


const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    filterUsers(filter: String!): [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    deleteUser(id: ID!): Boolean
  }

`;

const resolvers = {
  Query:{
    users: () =>{
      return new Promise((resolve, reject) => {
        getUsers((err, rows) => {
          if(err) {
            reject(err);
          }
          resolve(rows);
        });
      });
    },
    filterUsers: (_, { filter }) => {
      return new Promise((resolve, reject) => {
        filterUsers(filter, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });
    },
  },

  Mutation: {
    addUser: (_, {name, email}) => {
      return new Promise ((resolve, reject) => {
        if(!validateEmail(email)){
          reject(new Error ('Wrong email format!'));
        } else {
          addUser(name,email, (err, user) => {
            if(err) {
              reject(err);
            }
            resolve(user);
          });
        }
      });
    },

    deleteUser: (_, {id}) => {
      return new Promise ((resolve, reject) => {
        deleteUser(id, (err, success) => {
          if(err){
            reject(err);
          }
          resolve(success);
        });
      });
    },
  },
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});