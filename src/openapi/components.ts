export const Components = {
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

    LLMProviderRequest: {
      type: "object",
      required: ["provider", "apiKey", "chatModel", "embeddingModel"],
      properties: {
        provider: {
          type: "string",
          description: "LLM provider type",
          enum: ["GEMINI", "OPENAI"],
          example: "GEMINI",
        },

        apiKey: {
          type: "string",
          format: "password",
          description: "API key of the LLM provider",
          example: "AIzaSyxxxxxxxxxxxxxxxx",
        },

        chatModel: {
          type: "string",
          description: "Chat generation model",
          example: "gemini-3.6-flash",
        },

        embeddingModel: {
          type: "string",
          description: "Embedding model",
          example: "gemini-embedding-001",
        },
      },
    },

    LLMProviderStatusRequest: {
      type: "object",

      required: ["isActive"],

      properties: {
        isActive: {
          type: "boolean",
          description: "Activate or deactivate the LLM provider",
          example: true,
        },
      },
    },

    LLMProviderResponse: {
      type: "object",

      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "LLM provider saved successfully",
        },
        data: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            provider: {
              type: "string",
              enum: ["GEMINI", "OPENAI"],
              example: "GEMINI",
            },

            chatModel: {
              type: "string",
              example: "gemini-3.6-flash",
            },

            embeddingModel: {
              type: "string",
              example: "gemini-embedding-001",
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
    UpdateUserRequest: {
      type: "object",

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
          description: "New password of the user",
          example: "example@123",
        },
      },
    },

    UserProfileResponse: {
      type: "object",

      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "User profile retrieved successfully",
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

    CreateAppRequest: {
      type: "object",

      required: ["name", "systemPrompt"],

      properties: {
        name: {
          type: "string",
          description: "Name of the app",
          example: "My Chat App",
        },

        systemPrompt: {
          type: "string",
          description: "System prompt used by the app",
          example: "You are a helpful AI assistant.",
        },

        description: {
          type: "string",
          description: "Description of the app",
          example: "My document chat application",
        },

        status: {
          type: "boolean",
          description: "Indicates if the app is active",
          example: true,
        },

        llmProvider: {
          type: "boolean",
          description: "Indicates whether the app can use LLM features",
          example: false,
        },
      },
    },

    CreateAppResponse: {
      type: "object",

      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "Successfully create app",
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
              example: "My Chat App",
            },

            slug: {
              type: "string",
              example: "my-chat-app",
            },

            userId: {
              type: "string",
              format: "uuid",
            },

            systemPrompt: {
              type: "string",
              example: "You are a helpful AI assistant.",
            },

            description: {
              type: "string",
              example: "My document chat application",
            },

            status: {
              type: "boolean",
              example: true,
            },

            llmProvider: {
              type: "boolean",
              example: false,
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

    UploadResourceResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "File uploaded successfully",
        },

        data: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            fileName: {
              type: "string",
              example: "550e8400-e29b-41d4-a716-446655440000-resume.pdf",
            },

            filePath: {
              type: "string",
              example: "uploads/channel-id/resume.pdf",
            },

            size: {
              type: "integer",
              example: 524288,
              description: "File size in bytes",
            },

            fileType: {
              type: "string",
              enum: ["pdf", "docx"],
              example: "pdf",
            },

            status: {
              type: "string",
              example: "pending",
            },

            additionalInfo: {
              type: "object",
              properties: {
                originalName: {
                  type: "string",
                  example: "resume.pdf",
                },

                mimeType: {
                  type: "string",
                  example: "application/pdf",
                },
              },
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

    FindResourceResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "successfully got resource file list",
        },

        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },

              channelId: {
                type: "string",
                format: "uuid",
              },

              fileName: {
                type: "string",
                example: "sample.pdf",
              },

              filePath: {
                type: "string",
                example: "uploads/uuid/sample.pdf",
              },

              fileType: {
                type: "string",
                example: "pdf",
              },

              fileSize: {
                type: "integer",
                example: 524288,
              },

              status: {
                type: "string",
                example: "COMPLETED",
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
    },

    DeleteResourceResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },

        message: {
          type: "string",
          example: "successfully delete resource file",
        },
      },
    },

    CreateChannelRequest: {
      type: "object",
      required: ["name", "description", "channelType"],
      properties: {
        name: {
          type: "string",
          description: "Name of the channel",
          example: "Customer Support",
        },
        description: {
          type: "string",
          description: "Description of the channel",
          example: "Customer support documents",
        },
        channelType: {
          type: "string",
          description: "Type of the channel",
          example: "files",
        },
      },
    },

    CreateChannelResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },
        message: {
          type: "string",
          example: "Channel created successfully",
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
              example: "Customer Support",
            },
            description: {
              type: "string",
              example: "Customer support documents",
            },
            channelType: {
              type: "string",
              example: "files",
            },
            userId: {
              type: "string",
              format: "uuid",
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

    GetChannelsResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },
        message: {
          type: "string",
          example: "Channels fetched successfully",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              name: {
                type: "string",
                example: "Customer Support",
              },
              description: {
                type: "string",
                example: "Customer support documents",
              },
              channelType: {
                type: "string",
                example: "files",
              },
              userId: {
                type: "string",
                format: "uuid",
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
    },

    GetChannelResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },
        message: {
          type: "string",
          example: "Channel fetched successfully",
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
              example: "Customer Support",
            },
            description: {
              type: "string",
              example: "Customer support documents",
            },
            channelType: {
              type: "string",
              example: "files",
            },
            userId: {
              type: "string",
              format: "uuid",
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

    UpdateChannelRequest: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Updated channel name",
          example: "Updated Customer Support",
        },
        description: {
          type: "string",
          description: "Updated channel description",
          example: "Updated customer support documents",
        },
      },
    },

    UpdateChannelResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },
        message: {
          type: "string",
          example: "Channel updated successfully",
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
              example: "Updated Customer Support",
            },
            description: {
              type: "string",
              example: "Updated customer support documents",
            },
            channelType: {
              type: "string",
              example: "files",
            },
            userId: {
              type: "string",
              format: "uuid",
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

    DeleteChannelResponse: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 1,
        },
        message: {
          type: "string",
          example: "Channel deleted successfully",
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
