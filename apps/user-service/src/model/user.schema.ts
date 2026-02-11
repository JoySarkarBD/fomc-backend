import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  HR = 'HR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum Department {
  SHOPIFY = 'SHOPIFY',
  WORDPRESS = 'WORDPRESS',
  CUSTOM = 'CUSTOM',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: null, trim: true })
  employeeId?: string;

  @Prop({ required: true, trim: true })
  phoneNumber!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ default: null, lowercase: true, trim: true })
  secondaryEmail?: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  @Prop({
    type: String,
    enum: Department,
    default: null,
  })
  department?: Department;
}

export const UserSchema = SchemaFactory.createForClass(User);

// INDEXES
UserSchema.index({ employeeId: 1 });
UserSchema.index({ department: 1 });
