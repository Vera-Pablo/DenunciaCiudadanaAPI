import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import healthRoutes from "./routes/health.routes.js";
import roleRoutes from "./routes/role.routes.js";
import statusRoutes from "./routes/status.routes.js";
import typeRoutes from "./routes/type.routes.js";
import userRoutes from "./routes/user.routes.js";
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
app.use(base_route, roleRoutes);
app.use(base_route, statusRoutes);
app.use(base_route, typeRoutes);
app.use(base_route, userRoutes);

app.use(errorHandler);

export default app;
