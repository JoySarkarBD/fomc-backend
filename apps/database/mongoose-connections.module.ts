import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import config from "../config/config";

const mongoUri =
  config.MONGO_URI ?? "mongodb://127.0.0.1:27017/office-management";

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
      readPreference: "primary",
    }),
    MongooseModule.forRoot(mongoUri, {
      connectionName: "PRIMARY_DB",
      readPreference: "primary",
    }),
    MongooseModule.forRoot(mongoUri, {
      connectionName: "SECONDARY_DB",
      readPreference: "secondaryPreferred",
    }),
  ],
  exports: [MongooseModule],
})
export class MongooseConnectionsModule {}
