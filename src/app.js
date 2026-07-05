const express = require("express");
const cors = require("cors");

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");


const app = express();

app.use(cors());

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/notes", noteRoutes);
app.use("/api/auth" , authRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to KnowledgeVault API",
        documentation: "/api-docs"
    });
});

app.use(errorHandler);
module.exports = app;