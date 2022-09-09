/* SeonerVorteX ~ 09/10/2022 */ 

'use strict';

const { Server } = require('socket.io');
const { Collection } = require('@discordjs/collection');
const Client = require('./Client');

/**
 * The main server of chat application
 * @example
 * const Server = require('./structures/Server');
 * const server = new Server();
 * server.start();
 */
class ChatServer {
  /**
   * @param {Object} options Server options
   * @param {Number} [options.port=3000] Server port
   * @param {Number} [options.authToken=null] Server auth token
   */
  constructor(options) {
    options = {
      port: 3000,
      ...options,
    };

    if (!options.port) {
      throw new TypeError('Server "port" must be specified');
    }

    /**
     * The main Server
     * @type {Server}
     */
    this.wss = new Server({ clientServe: false });
    /**
     * The main options of server
     * @type {Object}
     */
    this.options = options;
    /**
     * The collection of connected clients
     * @type {Collection}
     */
    this.clients = new Collection();

    this.wss.on("connection", (socket) => {
      let { token } = socket.handshake?.auth || null;
      if(this.options.authToken && (!token || token !== this.options.authToken)) socket.disconnect(true);

      let client;
      socket.on('setName', (name) => {
          if(this.clients.find(cli => cli.username == name)) return socket.emit('unready', name);
          this.addUser(socket, name);
          client = this.clients.get(socket.id);
          socket.emit('ready', client.username);
          socket.conn.on('close', (reason) => {
            console.log(`[USER-LEAVE] "${client.username}" left the room with reason ${reason}`);
            this.clients.delete(client.id);
            socket.broadcast.emit('roomUserLeave', `[ROOM] "${client.username}" left the room`);
          });
      });
      socket.on('clientMessage', (message) => {
        console.log(`${client.username}: ${message.trim()}`);
        socket.broadcast.emit('messageCreate', `${client.username}: ${message.trim()}`);
      });
    });
  }

  /**
   * Start the server
   */
  start() {
    this.wss.listen(this.options.port);
    console.log("[SERVER] Running on port", this.options.port);
  }

  /**
   * Working when a client trying to connect to server
   * @param {IncomingMessage} req Client Request
   */
  addUser(client, username) {
    let id = client.id;
    let { token } = client.handshake?.auth || null;
    let cli = new Client(client, this, { id, token, username });
    this.clients.set(id, cli);
    client.broadcast.emit('roomUserAdd', `[ROOM] "${cli.username}" joined the room`);
    console.log(`[USER-ADD] "${cli.username}" joined the room`);
  }

  /**
   * Generate random Client id
   * @returns {String} Generated id
   */
  generateId() {
    return Math.floor((Date.now() + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

module.exports = ChatServer;
