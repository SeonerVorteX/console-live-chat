/* SeonerVorteX ~ 09/10/2022 */ 

console.clear();

const Server = require('./structures/Server');
const server = new Server({ port: 8080, authToken: 'vor1234tex' });

server.start();