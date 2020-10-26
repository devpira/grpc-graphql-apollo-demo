const { gql } = require('apollo-server');

const typeDefs = gql`

  type Result {
    status: Boolean,
    message: String,
    insertedId: String,
  }

  type User {
    _id: String
    uid: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
  }

  type Restaurant {
    _id: String!
    name: String!
    description: String
    imageUrl: String
    address: String
    phoneNumber: String
    emailAddress: String
    website: String
    menuIds: [String]
  }

  type Menu {
    _id: String
    name: String
    menuItems: [MenuItem]
  }

  type MenuItem {
    _id: String
    name: String
    description: String
    imageUrl: String
    ingredients: String
    price: Float
  }

  type Query {
      user: User 
      restaurant(_id: String!): Restaurant
      restaurants(name: String): [Restaurant]
      menus(menuIds: [String]): [Menu]
  }

  type Mutation {
    createUser(firstName: String!, lastName: String, email: String!, phoneNumber: String!): Result
  }  
`;

module.exports = {
  typeDefs
}