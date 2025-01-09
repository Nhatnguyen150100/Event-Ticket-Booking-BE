const logger = require("../config/winston");
const seedUsers = require("./user_seeders");

const runSeeders = async () => {
  await seedUsers();
  logger.info("Thêm dữ liệu thành công!");
};

runSeeders().catch((error) => {
  logger.error("Lỗi khi chạy seeder:", error);
  process.exit(1);
});