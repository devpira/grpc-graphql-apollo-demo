const { createUser, user } = require('./user')
const {restaurant, restaurants} = require('./restaurant')
const {menus} = require('./menu')


const resolvers = {
    Query: {
        user,
        restaurant,
        restaurants,
        menus,
    },

    Mutation: {
        createUser
    }
};

module.exports = {
    resolvers
}
