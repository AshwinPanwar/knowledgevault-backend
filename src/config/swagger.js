const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KnowledgeVault API",
            version: "1.0.0",
            description: "REST API documentation for KnowledgeVault"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./src/routes/*.js"]   // ← This line is VERY important
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;