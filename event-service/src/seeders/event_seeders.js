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
    imageThumbnail: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "MUSIC_CONCERT",
    eventOrganization: "Music Events Co.",
    time: "2025-05-20T19:00:00Z",
    location: "Central Park, New York",
    description: "Join us for an unforgettable night of music featuring top artists.",
    capacity: 5000,
  },
  {
    name: "Art Exhibition",
    imageThumbnail: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "CULTURAL_ARTS",
    eventOrganization: "Art Gallery Inc.",
    time: "2025-06-15T10:00:00Z",
    location: "Art Gallery, Los Angeles",
    description: "Explore the latest trends in contemporary art.",
    capacity: 1000,
  },
  {
    name: "Tech Conference 2025",
    imageThumbnail: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "OTHER",
    eventOrganization: "Tech Innovators",
    time: "2025-07-10T09:00:00Z",
    location: "Convention Center, San Francisco",
    description: "Join industry leaders for discussions on the future of technology.",
    capacity: 3000,
  },
  {
    name: "Food Festival",
    imageThumbnail: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "OTHER",
    eventOrganization: "Foodies United",
    time: "2025-08-25T12:00:00Z",
    location: "City Park, Chicago",
    description: "Taste delicious food from around the world.",
    capacity: 2000,
  },
  {
    name: "Marathon 2025",
    imageThumbnail: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "SPORTS",
    eventOrganization: "Miami Marathon Org.",
    time: "2025-09-30T07:00:00Z",
    location: "Downtown, Miami",
    description: "Join us for a day of fitness and fun!",
    capacity: 10000,
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
