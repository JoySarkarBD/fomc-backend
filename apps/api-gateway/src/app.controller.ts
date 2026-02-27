/**
 * @fileoverview Health-check controller for the API Gateway.
 */

import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

/** Root controller — exposes a simple health-check endpoint. */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** @returns Status string confirming the gateway is alive. */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
