import EventEmitter from '../EventEmitter.js';
import { generateRandomString, createMessageObject } from './utils.js';

export default class AchexWebSocket {
  static LEGACY_SERVER = 'ws://achex.ca:4010';

  static CLOUD_INSTANCES = {
    root: 'wss://cloud.achex.ca/',
    stoloto: 'wss://cloud.achex.ca/stoloto.ru.net',
    agar: 'wss://cloud.achex.ca/agar.io',
    testinst: 'wss://cloud.achex.ca/testinst',
  };

  static events = {
    CONNECTED: 'CONNECTED',
    CLOSED: 'CLOSED',
    ERROR: 'ERROR',
    MESSAGE: 'MESSAGE',
    USER_MESSAGE: 'USER_MESSAGE',
    SESSION_MESSAGE: 'SESSION_MESSAGE',
    HUB_MESSAGE: 'HUB_MESSAGE',
    USER_LEFT_HUB: 'USER_LEFT_HUB',
  };

  constructor({
    username,
    password,
    url = AchexWebSocket.CLOUD_INSTANCES.root,
  } = {}) {
    this.username = username || `user_${generateRandomString(8)}`;
    this.password = password || `pass_${generateRandomString(10)}`;

    this.url = url;
    this.sessionID = null;
    this.currentHub = null;
    this.connectionState = 'connecting'; // Possible values: 'connecting', 'connected', 'closed'
    this.isAuthenticated = false;

    this.eventEmitter = new EventEmitter();

    this.websocket = new WebSocket(url);
    this.websocket.onmessage = this.handleWebSocketMessage.bind(this);
    this.websocket.onclose = this.handleWebSocketClose.bind(this);
    this.websocket.onerror = this.handleWebSocketError.bind(this);
    this.websocket.onopen = this.handleWebSocketOpen.bind(this);
  }

  handleWebSocketMessage(event) {
    const receivedMessage = event.data;
    console.log(`websocket [received] ${receivedMessage}`);

    this.eventEmitter.emit(AchexWebSocket.events.MESSAGE, receivedMessage);

    const parsedMessage = JSON.parse(receivedMessage);

    // Check if it's an authentication success message
    if (parsedMessage.auth === 'OK') {
      this.sessionID = parsedMessage.SID;
      this.isAuthenticated = true;
      console.log(
        `websocket [authentication successful] sessionID: ${parsedMessage.SID}`
      );
      this.eventEmitter.emit(AchexWebSocket.events.CONNECTED);
    }

    // Check if it's a hub join/leave confirmation message
    if (parsedMessage.joinHub === 'OK') {
      console.log(`websocket [hub] Joined hub: ${this.currentHub}`);
    } else if (parsedMessage.leaveHub === 'OK') {
      console.log(`websocket [hub] Left hub: ${parsedMessage.leaveHub}`);
    }

    // Check if it's a hub notification about someone leaving
    if (parsedMessage.leftHub) {
      const userLeftHubData = {
        username: parsedMessage.user,
        sessionID: parsedMessage.sID,
        hub: parsedMessage.leftHub,
      };
      console.log(
        `websocket [hub] User: ${userLeftHubData.username} left hub: ${userLeftHubData.hub}`
      );
      this.eventEmitter.emit(
        AchexWebSocket.events.USER_LEFT_HUB,
        userLeftHubData
      );
    }

    // Check if it's an echo response message
    if (parsedMessage.echo) {
      console.log(`websocket [echo] ${parsedMessage.echo}`);
    }

    // Check if it's a message sent to the user
    if (parsedMessage.FROM && parsedMessage.to) {
      const userMessage = createMessageObject(parsedMessage, 'user');
      console.log('websocket [message:user]', userMessage);
      this.eventEmitter.emit(AchexWebSocket.events.USER_MESSAGE, userMessage);
    }

    // Check if it's a message sent to a session
    if (parsedMessage.FROM && parsedMessage.toS) {
      const sessionMessage = createMessageObject(parsedMessage, 'session');
      console.log('websocket [message:session]', sessionMessage);
      this.eventEmitter.emit(
        AchexWebSocket.events.SESSION_MESSAGE,
        sessionMessage
      );
    }

    // Check if it's a message sent to a hub
    if (parsedMessage.FROM && parsedMessage.toH) {
      const hubMessage = createMessageObject(parsedMessage, 'hub');
      console.log('websocket [message:hub]', hubMessage);
      this.eventEmitter.emit(AchexWebSocket.events.HUB_MESSAGE, hubMessage);
    }
  }

  handleWebSocketOpen() {
    console.log('websocket [open] Connection established.');
    this.connectionState = 'connected';
    this.authenticate();
  }

  handleWebSocketClose(event) {
    if (event.wasClean) {
      console.log(
        `websocket [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log(`websocket [close] Connection died, code=${event.code}`);
    }
    this.connectionState = 'closed';
    this.eventEmitter.emit(AchexWebSocket.events.CLOSED, event);
  }

  handleWebSocketError() {
    console.log(`websocket [error]`);
    this.eventEmitter.emit(
      AchexWebSocket.events.ERROR,
      new Error('WebSocket error')
    );
  }

  authenticate() {
    console.log(
      `websocket [authenticating] Username: ${this.username}, Password: ${this.password}`
    );

    this.send({
      setID: this.username,
      passwd: this.password,
    });
  }

  send(messageObject) {
    this.websocket.send(JSON.stringify(messageObject));
  }

  sendToUser(username, payload = '') {
    this.send({
      to: username,
      payload: payload,
    });
  }

  sendToSession(sessionID, payload = '') {
    this.send({
      toS: sessionID,
      payload: payload,
    });
  }

  sendToHub(hubName, payload = '') {
    this.send({
      toH: hubName,
      payload: payload,
    });
  }

  joinHub(hubName) {
    this.send({
      joinHub: hubName,
    });
    this.currentHub = hubName;
    console.log(`websocket [hub] Joining hub: ${hubName}`);
  }

  leaveHub(hubName) {
    this.send({
      leaveHub: hubName,
    });
    this.currentHub = null;
    console.log(`websocket [hub] Leaving hub: ${hubName}`);
  }

  echo(data) {
    this.send({
      echo: data,
    });
  }

  on(event, listener) {
    this.eventEmitter.on(event, listener);
  }

  off(event, listener) {
    this.eventEmitter.off(event, listener);
  }

  onConnected(listener) {
    this.eventEmitter.on(AchexWebSocket.events.CONNECTED, listener);
  }

  onClosed(listener) {
    this.eventEmitter.on(AchexWebSocket.events.CLOSED, listener);
  }

  onError(listener) {
    this.eventEmitter.on(AchexWebSocket.events.ERROR, listener);
  }

  onMessage(listener) {
    this.eventEmitter.on(AchexWebSocket.events.MESSAGE, listener);
  }

  onUserMessage(listener) {
    this.eventEmitter.on(AchexWebSocket.events.USER_MESSAGE, listener);
  }

  onSessionMessage(listener) {
    this.eventEmitter.on(AchexWebSocket.events.SESSION_MESSAGE, listener);
  }

  onHubMessage(listener) {
    this.eventEmitter.on(AchexWebSocket.events.HUB_MESSAGE, listener);
  }

  onUserLeftHub(listener) {
    this.eventEmitter.on(AchexWebSocket.events.USER_LEFT_HUB, listener);
  }
}
