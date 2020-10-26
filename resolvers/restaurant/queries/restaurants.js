const { restaurantClient, grpcResolver } = require('../../../grpc')

const restaurants = async (_, args, { isAuth, uid }) => grpcResolver(
    {
        grpcClient: restaurantClient,
        grpcFunction: 'GetRestaurantsByNameSearch',
        authentication: { isAuth, uid },
        requestParams: args,
        onSuccess: (result) => {
            console.log(result)
            return result.restaurants
        }
    }
);

module.exports = restaurants