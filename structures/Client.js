/* SeonerVorteX ~ 09/10/2022 */ 

'use strict';

const { Socket } = require('socket.io-client');
const Server = require('./Server');

/**
 * The chat user Client
 */

class ChatClient {
    /**
     * @param {Socket} socket Client socket
     * @param {Server} server Main server
     * @param {Object} options Client options
     * @param {String} [options.id] Socket id
     * @param {String} [options.token] Client token
     * @param {String} [options.username] Client username
     */
    constructor(socket, server, options) {
        /**
         * The unique socket id
         * @type {String}
         */
        this.id = options.id;
        /**
         * The username of socket user
         * @type {String}
         */
        this.username = options.username?.toString() || this.generateName();
        /**
         * The timestamp of socket connection time
         * @type {Number}
         */
        this.connectedTimestamp = Date.now();
        /**
         * The Socket
         * @type {Socket}
         */
        this.socket = socket;
        /**
         * Main Server
         * @type {Server}
         */
        this.server = server;
    
    }

    /**
     * Send a message to Socket
     * @param {String} data Message data
     * @param {Object} options Message options
     * @param {String} [options.event] Message Event
     * @param {ChatClient} [options.sender] Message sender
     */
    send(data, options) {
        this.socket.emit(options.event, data, options.sender);
    }

    /**
     * Generate random clint username
     * @returns {String} Generated username
     */
    generateName() {
        return 'Guest'+Date.now().toString().slice(-4);
    }
}

module.exports = ChatClient