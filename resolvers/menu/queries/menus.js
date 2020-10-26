const { menuClient, grpcResolver } = require('../../../grpc')

const menus = async (_, args, { isAuth, uid }) => grpcResolver(
    {
        grpcClient: menuClient,
        grpcFunction: 'GetMenus',
        authentication: { isAuth, uid },
        requestParams: args,
        onSuccess: (result) => {
            console.log(args)
            console.log(result)
            return result.menus
        }
    }
);

module.exports = menus
