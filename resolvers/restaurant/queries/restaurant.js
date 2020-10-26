const { restaurantClient, grpcResolver } = require('../../../grpc')

const restaurant = async (_, args, { isAuth, uid }) => grpcResolver(
    {
        grpcClient: restaurantClient,
        grpcFunction: 'GetRestaurant',
        authentication: { isAuth, uid },
        requestParams: args,
        onSuccess: (result) => {
            console.log(result)
            return result
        }
    }
);

module.exports = restaurant
