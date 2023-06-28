import mongoose from "mongoose";
import logger from "./configs/logger.js";

import app from "./app.js";
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.on("error", (err) => {
  logger.error(`Error in connecting to database ${err}`);
  process.exit(1);
});
mongoose
  .connect(MONGODB_URL, { serverSelectionTimeoutMS: 5000 })
  .then(() => logger.info("connected to database"));
if (process.env != "production") {
  mongoose.set("debug", true);
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

// import mongoose from "mongoose";
// import logger from "./configs/logger.js";
// import app from "./app.js";

// const MONGODB_URL = process.env.MONGODB_URL;

// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(MONGODB_URL, {
//       serverSelectionTimeoutMS: 5000,
//     });

//     // Configure connection pooling
//     mongoose.connection.on("connected", () => {
//       mongoose.connection.set("poolSize", 10); // Adjust the poolSize value based on your requirements
//       logger.info("Connected to the database");
//     });
//   } catch (error) {
//     logger.error(`Error in connecting to the database: ${error}`);
//     process.exit(1);
//   }
// };

// mongoose.connection.on("error", (error) => {
//   logger.error(`MongoDB connection error: ${error}`);
// });

// const startServer = () => {
//   const PORT = process.env.PORT || 8000;
//   const server = app.listen(PORT, () => {
//     logger.info(`Server running on PORT ${PORT}`);
//   });

//   const exitHandler = () => {
//     if (server) {
//       server.close(() => {
//         logger.info("Server closed.");
//         process.exit(1);
//       });
//     } else {
//       process.exit(1);
//     }
//   };

//   const unexpectedErrorHandler = (error) => {
//     logger.error(error);
//     exitHandler();
//   };

//   process.on("uncaughtException", unexpectedErrorHandler);
//   process.on("unhandledRejection", unexpectedErrorHandler);

//   // SIGTERM
//   process.on("SIGTERM", () => {
//     if (server) {
//       server.close(() => {
//         logger.info("Server closed.");
//         process.exit(1);
//       });
//     }
//   });
// };

// // Connect to the database and start the server
// connectToDatabase()
//   .then(() => {
//     startServer();
//   })
//   .catch((error) => {
//     logger.error(`Error in starting the server: ${error}`);
//   });
