export const components = {
  schemas: {
    registerUserRequest: {
      type: "object",

      required: ["name", "email", "password", "isActive"],

      properties: {
        name: {
          type: "string",
          description: "Name of the user",
          example: "example",
        },

        email: {
          type: "string",
          format: "email",
          description: "Email of the user",
          example: "example@gmail.com",
        },

        password: {
          type: "string",
          format: "password",
          description: "Password of the user",
          example: "Password@123",
        },

        isActive: {
          type: "boolean",
          description: "Indicates if the user is active",
          example: true,
        },
      },
    },

    registerUserResponse: {
      type: "object",

      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "User registered successfully",
        },

        user: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            name: {
              type: "string",
              example: "example",
            },

            email: {
              type: "string",
              format: "email",
              example: "example@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password@123",
            },

            isActive: {
              type: "boolean",
              example: true,
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },

    LoginRequest: {
      type: "object",

      required: ["email", "password"],

      properties: {
        email: {
          type: "string",
          format: "email",
          example: "example@gmail.com",
        },

        password: {
          type: "string",
          format: "password",
          example: "Password@123",
        },
      },
    },

    LoginResponse: {
      type: "object",

      properties: {
        success: {
          type: "number",
          example: 1,
        },

        message: {
          type: "string",
          example: "Login successful",
        },
        token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIs...",
        },
        data: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            name: {
              type: "string",
              example: "example",
            },

            email: {
              type: "string",
              format: "email",
              example: "example@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password@123",
            },

            isActive: {
              type: "boolean",
              example: true,
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },

    ErrorResponse: {
      type: "object",

      properties: {
        success: {
          type: "boolean",
          example: false,
        },

        statusCode: {
          type: "integer",
          example: 400,
        },

        message: {
          type: "string",
          example: "Bad request",
        },
      },
    },
  },

  responses: {
    BadRequest: {
      description: "Bad request",

      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse",
          },
        },
      },
    },

    Unauthorized: {
      description: "Unauthorized",

      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse",
          },
        },
      },
    },

    Forbidden: {
      description: "Forbidden",

      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse",
          },
        },
      },
    },

    NotFound: {
      description: "Resource not found",

      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse",
          },
        },
      },
    },

    InternalServerError: {
      description: "Internal server error",

      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse",
          },
        },
      },
    },
  },

  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};
