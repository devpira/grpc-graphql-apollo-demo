const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { MyLogger } = require('./libs/logger')
const { ErrorLoggerPlugin } = require('./libs/apollo/plugins')

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://1c609a9c8ee74d10a5b56bfe48f8e7ab@o425470.ingest.sentry.io/5361734' });

var admin = require("firebase-admin");
var serviceAccount = require("./firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://yummer-admin.firebaseio.com"
});

const server = new ApolloServer({
    typeDefs, resolvers, context: async (args) => {
        const { req } = args;
        var isAuth = false
        var uid = null

        const idToken = req.headers.authorization || false;

        if (idToken) {
            idTokenParts = idToken.split(" ")
            if (idTokenParts && idTokenParts.length > 1) {
                if (idTokenParts[1]) {
                    await admin.auth().verifyIdToken(idTokenParts[1])
                        .then((decodedToken) => {
                            isAuth = true;
                            uid = decodedToken.uid;
                            console.log(uid)
                        }).catch((error) => {
                            console.log("auth Failed")
                            console.log(error)
                            MyLogger().warning(`Firebase token verification failed: ${error}`)
                        });
                }
            }
        }
        return { ...args, isAuth, uid }
    },
    plugins: [ErrorLoggerPlugin],
    debug: false,
    formatError: (err) => {
        
        // The grpc error interceptor for the grpc resolver addes the original exception message as grpcDetails. Need to remove:
        if (err.extensions && err.extensions.type === "GRPC_ERROR") {
            //Remove the grpc details
            if (err.extensions.grpcDetails) {
                delete err.extensions.grpcDetails
            }
            //Remove the duplicate exceptiom message:
            if (err.extensions.type === "GRPC_ERROR" && err.extensions.exception) {
                delete err.extensions.exception
            }
            return err
        }
        return err;
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
    MyLogger().info(`Graphql Apollo Server ready at ${url}`)
});
