import { Body, Get, JsonController, Put, Req, Res } from "routing-controllers";
import type { LLMProviderRequest } from "../dto/lmprovider/LLMProviderRequest.js";
import { llmProviderService } from "../services/LLMProviderService.js";
import type { LLMProviderStatusRequest } from "../dto/lmprovider/LLMProviderStatusRequest.js";

JsonController("/llm-provider");
export class LLMProviderController {
  /**
   * @openapi
   * /api/llm-provider:
   *   put:
   *     tags:
   *       - LLM Provider
   *     summary: Create or update LLM provider
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/LLMProviderRequest"
   *     responses:
   *       200:
   *         description: LLM provider saved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LLMProviderResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Put()
  async upsertProvider(
    @Req() req: any,
    @Body({ validate: true }) llProviderRequest: LLMProviderRequest,
    @Res() res: any,
  ) {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        status: 0,
        message: "Unauthorized",
      });
    }
    const provider = await llmProviderService.upsertProvider(
      userId,
      llProviderRequest,
    );
    return res.status(200).json({
      status: 1,
      message: "LLM provider saved successfully",
      data: provider,
    });
  }

  /**
   * @openapi
   * /api/llm-provider:
   *   get:
   *     tags:
   *       - LLM Provider
   *     summary: Get active LLM provider
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: LLM provider retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LLMProviderResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get("/")
  async getProvider(@Req() req: any, @Res() res: any): Promise<Response> {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        status: 0,
        message: "Unauthorized",
      });
    }
    const provider = await llmProviderService.getProvider(userId);
    return res.status(200).json({
      status: 1,
      message: "LLM provider retrieved successfully",
      data: provider,
    });
  }

  /**
   * @openapi
   * /api/llm-provider/status:
   *   put:
   *     tags:
   *       - LLM Provider
   *     summary: Activate or deactivate LLM provider
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/LLMProviderStatusRequest"
   *     responses:
   *       200:
   *         description: LLM provider status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LLMProviderResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Put("/status")
  async updateStatus(
    @Req() req: any,
    @Body({ validate: true })
    body: LLMProviderStatusRequest,
    @Res() res: any,
  ) {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        status: 0,
        message: "Unauthorized",
      });
    }
    const provider = await llmProviderService.updateStatus(
      userId,
      body.isActive,
    );
    return res.status(200).json({
      status: 1,
      message: body.isActive
        ? "LLM provider activated successfully"
        : "LLM provider deactivated successfully",
      data: provider,
    });
  }
}
