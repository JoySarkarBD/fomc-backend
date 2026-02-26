import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
} from "@nestjs/swagger";

type SingleOrArray<T> = T | T[];

interface SwaggerRequestConfig {
  params?: SingleOrArray<ApiParamOptions>;
  queries?: SingleOrArray<ApiQueryOptions>;
  queryDto?: Type<unknown>;
  paramDto?: Type<unknown>;
}

export function ApiRequestDetails(
  config: SwaggerRequestConfig,
): MethodDecorator {
  const decorators: MethodDecorator[] = [];

  // Params
  if (config?.params) {
    const paramArray = Array.isArray(config.params)
      ? config.params
      : [config.params];

    decorators.push(...paramArray.map((param) => ApiParam(param)));
  }

  // Manual Queries
  if (config?.queries) {
    const queryArray = Array.isArray(config.queries)
      ? config.queries
      : [config.queries];

    decorators.push(...queryArray.map((query) => ApiQuery(query)));
  }

  // 🔥 DTO Query Support
  if (config?.queryDto) {
    decorators.push(ApiExtraModels(config.queryDto));
  }

  // 🔥 DTO Param Support
  if (config?.paramDto) {
    decorators.push(ApiExtraModels(config.paramDto));
  }

  return applyDecorators(...decorators);
}
