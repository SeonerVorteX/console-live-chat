/* SeonerVorteX ~ 09/10/2022 */ 

console.clear();

const client = require('socket.io-client')('ws://localhost:8080', { auth: { token: 'vor1234tex' }});
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let username = null;
client.on('connect', () => {
    getName();
});


client.on('disconnect', () => {
    process.stdout.write("\r\x1b[K");
    console.log('[ROOM] Disconnected');
});


client.on('ready', (name) => {
    username = name;
    console.clear();
    process.stdout.write(`[ROOM] "${name}" joined the room\n`);
    process.stdout.write("/> ");
});

client.on('unready', () => {
    process.stdout.write('[ROOM] This name is taken, try another one\n');
    getName();
});

client.on('roomUserAdd', (data) => {
    if(username) { 
        process.stdout.write("\r\x1b[K");
        process.stdout.write(`${data}\n`);
        process.stdout.write("/> ");
    }
});

client.on('roomUserLeave', (data) => {
    if(username) { 
        process.stdout.write("\r\x1b[K");
        process.stdout.write(`${data}\n`);
        process.stdout.write("/> ");
    }
});

client.on('messageCreate', (data) => {
    if(username) { 
        process.stdout.write("\r\x1b[K");
        // process.stdout.moveCursor(0);
        // process.stdout.write(`\r`)
        process.stdout.write(`${data}\n`);
        process.stdout.write("/> ");
    };
});

rl.prompt();
rl.on('line', (message) => {
    if(!message.trim().length) {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearScreenDown();
        process.stdout.write("/> ");
        return rl.prompt();
    }
    process.stdout.moveCursor(0, -1);
    process.stdout.clearScreenDown();
    process.stdout.write(`${username}: ${message.trim()}\n`)
    client.emit('clientMessage', message.trim());
    process.stdout.write("/> ");
    rl.prompt();
});

client.io.on("reconnect_attempt", () => {
    console.log('[ROOM] Trying to reconnect...');
});
  
client.io.on("reconnect", () => {
    username = null;
    console.log('[ROOM] Reconnected');
});

function getName() {
    process.stdout.write('[ROOM] Enter an username: ');
    rl.question('', (name) => {
        client.emit('setName', name && name.length ? name.trim() : null);
    });
}