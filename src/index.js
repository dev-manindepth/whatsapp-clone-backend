import mongoose from "mongoose";
import logger from "./configs/logger.js";

import app from "./app.js";
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.on("error", (err) => {
  logger.error(`Error in connecting to database ${err}`);
  process.exit(1);
});
mongoose.connect(MONGODB_URL).then(() => logger.info("connected to database"));
if(process.env!= 'production'){
  mongoose.set('debug',true)
}
const PORT = process.env.PORT || 8000;
let server;
server = app.listen(PORT, () => {
  logger.info(`Server running on PORT ${PORT}`);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
