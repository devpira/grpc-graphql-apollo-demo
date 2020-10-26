//grpc code resoue - https://developers.google.com/maps-booking/reference/grpc-api/status_codes
const { ApolloError } = require('apollo-server');

const OK = 0
const CANCELLED = 1
const UNKNOWN = 2
const invalid_argument = 3 // not done
const DEADLINE_EXCEEDED = 4
const NOT_FOUND = 5 // not done
const ALREADY_EXISTS = 6
const permission_denied = 7 // not done
const RESOURCE_EXHAUSTED = 8
const FAILED_PRECONDITION = 9
const ABORTED = 10
const OUT_OF_RANGE = 11
const UNIMPLEMENTED = 12
const INTERNAL = 13
const UNAVAILABLE = 14
const DATA_LOSS = 15
const unauthenticated = 16 // not done

const grpcErrorInterceptor = (err, grpcFunction) => {
    let code = null;
    if (err && err.extensions && err.extensions.exception && err.extensions.exception.code) {
        code = err.extensions.exception.code;
    } else if (err && err.code) {
        code = err.code
    }

    if (!code) {
        return null
    }

    const additionalProperties = { type: "GRPC_ERROR", grpcFunction: grpcFunction, grpcDetails: err }

    if (
        code === CANCELLED || //  CANCELLED
        code === UNKNOWN || //  UNKNOWN
        code === RESOURCE_EXHAUSTED || //  RESOURCE_EXHAUSTED
        code === FAILED_PRECONDITION || //  FAILED_PRECONDITION
        code === ABORTED || //  ABORTED
        code === UNIMPLEMENTED || //  UNIMPLEMENTED
        code === INTERNAL || // INTERNAL
        code === UNAVAILABLE || // UNAVAILABLE
        code === DATA_LOSS  // DATA_LOSS
    ) {
        console.log("Error related to grpc server")
        console.log(err)

        return new ApolloError("Oops! Our servers are currently experiencing some issues. Please try again later.", "INTERNAL", additionalProperties)
    }

    if (code === DEADLINE_EXCEEDED) {  // DEADLINE_EXCEEDED
        console.log(err)
        return new ApolloError("Oops! An unexpected error occured. Please try again or contact our support team for help.", "DEADLINE_EXCEEDED", additionalProperties)
    }

    if (code === OUT_OF_RANGE) {  // OUT_OF_RANGE
        console.log(err)
        return new ApolloError("Oops! An unexpected error occured. Please try again or contact our support team for help.", "OUT_OF_RANGE", additionalProperties)
    }

    if (code === ALREADY_EXISTS) { // ALREADY_EXISTS
        console.log(err)
        return new ApolloError("Sorry the record that you are trying to process already exists. Please try again.", "ALREADY_EXISTS", additionalProperties)
    }

    return null;
}

module.exports = grpcErrorInterceptor
