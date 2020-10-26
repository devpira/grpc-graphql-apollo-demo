var PROTO_PATH =  __dirname + '/proto/restaurant.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

var restaurantDescriptor = grpc.loadPackageDefinition(packageDefinition).yummer.main.grpc.restaurant;
const restaurantClient = new restaurantDescriptor.Restaurant('192.168.99.100:8000', grpc.credentials.createInsecure());


module.exports = restaurantClient