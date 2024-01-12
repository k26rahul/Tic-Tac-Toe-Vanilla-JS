export function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export function createMessageObject(parsedMessage, messageChannel) {
  const from = {
    username: parsedMessage.FROM,
    sessionID: parsedMessage.sID,
  };

  const to = {
    username: parsedMessage.to || null,
    sessionID: parsedMessage.toS || null,
    hub: parsedMessage.toH || null,
  };

  return {
    from,
    to,
    payload: parsedMessage.payload,
    channel: messageChannel,
  };
}
