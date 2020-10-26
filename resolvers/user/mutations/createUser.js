const { userClient, grpcResolver } = require('../../../grpc')

const createUser = async (_, args, { isAuth, uid }) => grpcResolver(
    {
        grpcClient: userClient,
        grpcFunction: 'createUser',
        authentication: { isAuth, uid },
        requestParams: { uid, ...args },
        onSuccess: (result) => {
            return returnResult = {
                status: true,
                message: "Successfulled created user!",
                insertedId: result.insertedId,
            }
        }
    }
);

module.exports = createUser
