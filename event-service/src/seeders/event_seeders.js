const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../config/winston");
const { deleteMany, insertMany } = require("../models/event");
dotenv.config();

const { connect, connection } = mongoose;

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to Mongoose");
  } catch (error) {
    logger.error("Connect to Mongoose failed:", error);
    process.exit(1);
  }
};

const events = [
  {
    name: "Concert Music Night",
    imageThumbnail: "https://example.com/image1.jpg",
    time: "2025-05-20T19:00:00Z",
    location: "Central Park, New York",
    description: "Join us for an unforgettable night of music featuring top artists.",
    capacity: 5000,
    ticketsAvailable: 2500,
    priceTicket: 50,
  },
  {
    name: "Art Exhibition",
    imageThumbnail: "https://example.com/image2.jpg",
    time: "2025-06-15T10:00:00Z",
    location: "Art Gallery, Los Angeles",
    description: "Explore the latest trends in contemporary art.",
    capacity: 1000,
    ticketsAvailable: 800,
    priceTicket: 20,
  },
  {
    name: "Tech Conference 2025",
    imageThumbnail: "https://example.com/image3.jpg",
    time: "2025-07-10T09:00:00Z",
    location: "Convention Center, San Francisco",
    description: "Join industry leaders for discussions on the future of technology.",
    capacity: 3000,
    ticketsAvailable: 1500,
    priceTicket: 150,
  },
  {
    name: "Food Festival",
    imageThumbnail: "https://example.com/image4.jpg",
    time: "2025-08-25T12:00:00Z",
    location: "City Park, Chicago",
    description: "Taste delicious food from around the world.",
    capacity: 2000,
    ticketsAvailable: 1800,
    priceTicket: 30,
  },
  {
    name: "Marathon 2025",
    imageThumbnail: "https://example.com/image5.jpg",
    time: "2025-09-30T07:00:00Z",
    location: "Downtown, Miami",
    description: "Join us for a day of fitness and fun!",
    capacity: 10000,
    ticketsAvailable: 9000,
    priceTicket: 25,
  },
];

const seedEvents = async () => {
  await connectDB();

  await deleteMany();

  await insertMany(events);
  logger.info("Insert events successfully");

  connection.close();
};

module.exports = seedEvents;
