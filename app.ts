import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/database";
import ApiError from "./utils/apiError";
import globalErrorHandling from "./middlewares/errorMiddleware";

// Load environment variables
dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "production";

// Database connection
console.log(dbConnection);
dbConnection();

// Route files
import organizationRoute from "./routes/organizationRoute";
import authRoute from "./routes/authRoute";

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
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalErrorHandling);

const server = app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(0);
  });
});

export default app;
