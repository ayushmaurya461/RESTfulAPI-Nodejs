const http = require('http')
const app = require('./app');

//Providing PORT
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

// KxwdkuPbNQnXiMeL
// mongodb+srv://Admin:<password>@atlascluster.cbxabgr.mongodb.net/?retryWrites=true&w=majority