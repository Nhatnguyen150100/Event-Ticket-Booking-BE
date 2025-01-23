"use strict";

import eventService from "../services/ticketsService";

const eventController = {
  createEvent: async (req, res) => {
    try {
      const result = await eventService.createEvent(req.body);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getEventById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await eventService.getEventById(id);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  updateEvent: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await eventService.updateEvent(id, req.body);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  deleteEvent: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await eventService.deleteEvent(id);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const result = await eventService.getAllEvents(req.query);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default eventController;
