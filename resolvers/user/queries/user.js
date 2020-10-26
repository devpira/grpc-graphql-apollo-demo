const { userClient, grpcResolver } = require('../../../grpc')

const user = async (_, args, { isAuth, uid }) => grpcResolver(
    {
        grpcClient: userClient,
        grpcFunction: 'getUser',
        authentication: { isAuth, uid },
        requestParams: { uid },
        onSuccess: (result) => {
            console.log(result)
            return result
        }
    }
);

module.exports = user