import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlValidationExceptionFilter } from './common/filters/gql-validation-exception.filter';
import { UserModule } from './user/user.module';

/**
 * Root application module.
 *
 * Imports necessary modules and configures database and GraphQL settings.
 * Provides application-wide services and controllers.
 * @module AppModule
 */
@Module({
  imports: [
    // Connect to local MongoDB instance and use database named `graphQL`.
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/',
    ),
    // Configure GraphQL (Apollo driver) and generate schema at `src/schema.gql`.
    GraphQLModule.forRoot({
      driver: ApolloDriver, // Disable playground in favor of Apollo Sandbox
      playground: false, // Enable Apollo Sandbox
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Path to generated schema file
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use local default landing page
      formatError: (error) => {
        const validationErrors =
          (error.extensions as { validationErrors?: unknown[] } | undefined)
            ?.validationErrors ??
          (
            error.extensions as
              | { originalError?: { response?: { errors?: unknown[] } } }
              | undefined
          )?.originalError?.response?.errors;

        if (validationErrors && validationErrors.length > 0) {
          return {
            message: 'Validation failed',
            errors: validationErrors,
          };
        }

        return error;
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GqlValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
