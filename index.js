const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// --------------------------------- load env vars ---------------------------------
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: "config/config.env" });
}

// --------------------------------- import routers files ---------------------------------

const userRouter = require('./routes/admin/admin');
// --------------------------------- initialize app ---------------------------------
const app = express();

// --------------------------------- Logging Middleware ---------------------------------
app.use(morgan("dev"));

// --------------------------------- body parser setup ---------------------------------
app.use(express.json());

// --------------------------------- CORS config---------------------------------
app.use(cors());

//  --------------------------------- main route setup ---------------------------------
app.use("/api/v1/admin", userRouter);
// app.use("/api/v1/user/admin", mainRoutes);
// app.use("/api/v1/user/manager", mainRoutes);
// app.use("/api/v1/user/executive", mainRoutes);
// app.use("/api/v1/user/customer", mainRoutes);

// --------------------------------- error handler ---------------------------------
app.use(errorHandler);

// --------------------------------- Express App setup ---------------------------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(
    chalk.yellowBright.bold(
      `Server is running on PORT: ${PORT} url on mode ${process.env.NODE_ENV}`
    )
  );
});


// --------------------------------- Handle unhandled Promise rejections ---------------------------------
process.on("unhandledRejection", (err) => {
  console.log(chalk.bold.redBright(`Error: ${err.message}`));
  console.log(err);
  server.close(() => {
    console.log(
      chalk.bold.redBright("Server closed due to unhandled promise rejection")
    );
    process.exit(1);
  });
});
