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
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>API Documentation</title>
      </head>
      <body>
        <h1>Welcome to the API</h1>
        <p>To use this API, here are the available paths:</p>
        <ul>
          <li><strong>/api/v1/organizations</strong> - Manage organizations</li>
          <li><strong>/api/v1/auth</strong> - Authentication routes</li>
          <!-- Add other paths as needed -->
        </ul>
      </body>
    </html>
  `);
});
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
