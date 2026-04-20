import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const base_route = "/api/v1";

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("DenunciaCiudadana API Status: Online");
});

app.use(base_route, healthRoutes);

app.use(errorHandler);

export default app;
