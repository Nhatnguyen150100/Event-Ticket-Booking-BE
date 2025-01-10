const amqp = require("amqplib");

class RabbitMQ {
  constructor(url = "amqp://localhost") {
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
    }
  }

  async send(queue, message) {
    await this.connect();
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Sent to ${queue}:`, message);
  }

  async receive(queue, callback) {
    await this.connect();
    await this.channel.assertQueue(queue);

    this.channel.consume(queue, (msg) => {
      const message = JSON.parse(msg.content.toString());
      console.log(`Received from ${queue}:`, message);
      callback(message);
      this.channel.ack(msg);
    });
  }
}

module.exports = RabbitMQ;
