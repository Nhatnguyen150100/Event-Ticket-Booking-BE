const logger = require("../config/winston");
const seedEvents = require("./event_seeders");

const runSeeders = async () => {
  logger.info("Seeders started");
  await seedEvents();
  logger.info("Seeders succeeded");
};

runSeeders().catch((error) => {
  logger.error("Seeders failed:", error);
  process.exit(1);
});