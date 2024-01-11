export default class AchexWebSocket {
  static LEGACY_SERVER = 'ws://achex.ca:4010';
  static CLOUD_INSTANCES = {
    root: 'wss://cloud.achex.ca/',
    stoloto: 'wss://cloud.achex.ca/stoloto.ru.net',
    agar: 'wss://cloud.achex.ca/agar.io',
    testinst: 'wss://cloud.achex.ca/testinst',
  };

  static generateRandomString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  static generateRandomUsername() {
    return `user_${AchexWebSocket.generateRandomString(8)}`;
  }

  static generateRandomPassword() {
    return `pass_${AchexWebSocket.generateRandomString(10)}`;
  }

  constructor({
    username,
    password,
    url = AchexWebSocket.CLOUD_INSTANCES.root,
  } = {}) {
    this.username = username || AchexWebSocket.generateRandomUsername();
    this.password = password || AchexWebSocket.generateRandomPassword();

    this.connectionState = 'connecting'; // Possible values: 'connecting', 'connected', 'closed'
    this.isAuthenticated = false;

    this.websocket = new WebSocket(url);
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onclose = this.onClose.bind(this);
    this.websocket.onerror = this.onError.bind(this);
    this.websocket.onopen = this.onOpen.bind(this);

    this.sessionID = null;
  }

  onMessage(event) {
    const receivedMessage = event.data;
    console.log(`websocket [received] ${receivedMessage}`);

    const parsedMessage = JSON.parse(receivedMessage);

    // Check if it's an authentication success message
    if (parsedMessage.auth === 'OK') {
      this.sessionID = parsedMessage.SID;
      this.isAuthenticated = true;
      console.log(
        `websocket [authentication successful] sessionID: ${parsedMessage.SID}`
      );
    }

    // Check if it's a hub join/leave confirmation message
    if (parsedMessage.joinHub === 'Ok') {
      console.log(`websocket [hub] Joined hub: ${parsedMessage.joinHub}`);
    } else if (parsedMessage.leaveHub === 'Ok') {
      console.log(`websocket [hub] Left hub: ${parsedMessage.leaveHub}`);
    }

    // Check if it's a hub notification about someone leaving
    if (parsedMessage.leftHub) {
      console.log(
        `websocket [hub] ${parsedMessage.user} left hub: ${parsedMessage.leftHub}`
      );
    }

    // Check if it's a latency response message
    if (parsedMessage.ltcy) {
      const latency = parsedMessage.ltcy;
      console.log(`websocket [latency] ${latency} milliseconds`);
    }

    // Check if it's an echo response message
    if (parsedMessage.echo) {
      console.log(`websocket [echo] ${parsedMessage.echo}`);
    }

    // Check if it's a message sent to the user
    if (parsedMessage.FROM && parsedMessage.to) {
      const userMessage = this.createMessageObject(parsedMessage, 'user');
      console.log('websocket [message:user]', userMessage);
    }

    // Check if it's a message sent to a session
    if (parsedMessage.FROM && parsedMessage.toS) {
      const sessionMessage = this.createMessageObject(parsedMessage, 'session');
      console.log('websocket [message:session]', sessionMessage);
    }

    // Check if it's a message sent to a hub
    if (parsedMessage.FROM && parsedMessage.toH) {
      const hubMessage = this.createMessageObject(parsedMessage, 'hub');
      console.log('websocket [message:hub]', hubMessage);
    }
  }

  createMessageObject(parsedMessage, messageType) {
    const from = {
      username: parsedMessage.FROM,
      SID: parsedMessage.sID,
    };

    const to = {};
    if (messageType === 'user') to.username = parsedMessage.to;
    if (messageType === 'session') to.sessionID = parsedMessage.toS;
    if (messageType === 'hub') to.hub = parsedMessage.toH;

    return { from, to, payload: parsedMessage.payload };
  }

  onClose(event) {
    if (event.wasClean) {
      console.log(
        `websocket [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log(`websocket [close] Connection died, code=${event.code}`);
    }
    this.connectionState = 'closed';
  }

  onError() {
    console.log(`websocket [error]`);
  }

  onOpen() {
    console.log('websocket [open] Connection established.');
    this.connectionState = 'connected';
    this.authenticate();
  }

  authenticate() {
    console.log(
      `websocket [authenticating] Username: ${this.username}, Password: ${this.password}`
    );

    const authMessage = {
      setID: this.username,
      passwd: this.password,
    };

    this.send(authMessage);
  }

  send(messageObject) {
    const messageString = JSON.stringify(messageObject);
    this.websocket.send(messageString);
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
    console.log(`websocket [hub] Joining hub: ${hubName}`);
  }

  leaveHub(hubName) {
    this.send({
      leaveHub: hubName,
    });
    console.log(`websocket [hub] Leaving hub: ${hubName}`);
  }

  echo(data) {
    this.send({
      echo: data,
    });
  }

  requestLatency() {
    this.send({
      ping: true,
    });
  }
}
