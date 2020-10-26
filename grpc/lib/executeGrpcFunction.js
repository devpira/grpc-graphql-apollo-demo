const executeGrpcFunction = (client, method, args) => {
    return new Promise((resolve, reject) => {
        console.log(`Starting Grpc ${method} request.`)
        client[method](args, (exception, response) => {
            if (exception) {
                // Error occured from grpc server whilie making request:
                console.log(`Grpc request - ${method} failed.`)
                reject(exception)
                return;
            }
            resolve(response)
        });
    });
}

module.exports = executeGrpcFunction
