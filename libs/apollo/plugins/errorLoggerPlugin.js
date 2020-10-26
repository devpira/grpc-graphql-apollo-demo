const Sentry = require('@sentry/node');
const { AuthenticationError, UserInputError } = require('apollo-server');
const { MyLogger } = require('../../logger')

// For plugin definition see the docs: https://www.apollographql.com/docs/apollo-server/integrations/plugins/

const errorLoggerPlugin = {
    requestDidStart() {
        const recordSentryError = (context, error) => {
            console.log("Exception thrown caught: ", error)
            const err = error.originalError || error;

            let sentryId = 'ID only generated in production';

            Sentry.withScope((scope) => {
                if (context.uid) {
                    scope.setUser({
                        uid: context.uid,

                        ip_address: context.req.ip,
                    });
                }
                scope.setExtra('request body', context.req.body);
                scope.setExtra('origin', context.req.headers.origin);
                scope.setExtra('user-agent', context.req.headers['user-agent']);
                scope.setExtra('Host', context.req.headers['Host']);
                scope.setExtra('Content-Type', context.req.headers['Content-Type']);
           
                if (error.originalError) {
                    scope.setExtra("Extra details", error.originalError)
                    scope.setExtra("Original Error Type", typeof(error.originalError))
                } else {
                    scope.setExtra("Extra details", JSON.stringify(error))
                }
                if (error.name) {
                    scope.setExtra("Error Type", error.name)
                }
           
                if (error.path) {
                    scope.setExtra("Error Path", error.path)
                }
               
                sentryId = Sentry.captureException(err);

            });

            return sentryId
        }

        return {
            didEncounterErrors(requestContext) {
                const context = requestContext.context;

                requestContext.errors.forEach((error) => {
                    let additionDetails = { originalError: error.originalError }

                    if (context && context.res) {
                        additionDetails = {
                            ...additionDetails,
                            requestBody: context.req.body,
                            origin: context.req.headers.origin,
                            Host: context.req.headers['Host'],
                            userAgent: context.req.headers['user-agent'],
                            ip_address: context.req.ip
                        }
                    }

                    if (context.uid) {
                        additionDetails = {
                            ...additionDetails,
                            uid: context.uid,
                        }
                    }
            
                    if (error.originalError && error.originalError instanceof AuthenticationError || error.message.startsWith("Cannot query field")) {
                        MyLogger().warning(error.name + ": " + JSON.stringify(error), additionDetails)
                        return;
                    }
           
                    const sentryId = recordSentryError(context, error)
                    MyLogger().error(error.name + ": " + JSON.stringify(error), { sentryId: sentryId, ...additionDetails })
                });
            },
        };
    },
};

module.exports = errorLoggerPlugin
