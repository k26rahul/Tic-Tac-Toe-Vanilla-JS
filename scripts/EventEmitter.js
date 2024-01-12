export default class EventEmitter {
  constructor() {
    this.eventListeners = {};
  }

  on(eventType, listener) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }

    this.eventListeners[eventType].push(listener);
  }

  off(eventType, listener) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType] = this.eventListeners[eventType].filter(
        existingListener => existingListener !== listener
      );
    }
  }

  emit(eventType, eventData) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach(listener => {
        listener(eventData);
      });
    }
  }
}
