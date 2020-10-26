var PROTO_PATH =  __dirname + '/proto/menu.proto';
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

var menuDescriptor = grpc.loadPackageDefinition(packageDefinition).yummer.main.grpc.menu;
const menuClient = new menuDescriptor.Menu('192.168.99.100:8000', grpc.credentials.createInsecure());


module.exports = menuClient