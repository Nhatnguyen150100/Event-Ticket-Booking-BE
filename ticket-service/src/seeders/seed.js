const logger = require("../config/winston");

const runSeeders = async () => {
  logger.info("Seeders started");
  logger.info("Seeders succeeded");
};

runSeeders().catch((error) => {
  logger.error("Seeders failed:", error);
  process.exit(1);
});
