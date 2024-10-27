const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorHandling = require("./middlewares/errorMiddleware");

dotenv.config({ path: ".env" });
const PORT = process.env.PORT;
const MODE = process.env.MODE;

// Database connection
dbConnection();

// Route files
const organizationRoute = require("./routes/organizationRoute");
const authRoute = require("./routes/authRoute");

const app = express();

if (MODE === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${MODE}`);
}

app.use(express.json());

// Routes
app.use("/api/v1/organizations", organizationRoute);
app.use("/api/v1/", authRoute);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalErrorHandling);

const server = app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(0);
  });
});
