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
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ default: null })
  employeeId?: string;

  @Prop({ required: true })
  phoneNumber?: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ default: null })
  secondaryEmail?: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop({ default: UserRole.EMPLOYEE, enum: UserRole })
  role: UserRole = UserRole.EMPLOYEE;

  @Prop({ default: null, enum: Department })
  department?: Department;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ employeeId: 1, phoneNumber: 1, department: 1 });
