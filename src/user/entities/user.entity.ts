import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document; // Mongoose Document type

// Enums for user roles and departments
export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  HR = 'HR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE',
}

// Enums for user departments
export enum Department {
  SHOPIFY = 'SHOPIFY',
  WORDPRESS = 'WORDPRESS',
  CUSTOM = 'CUSTOM',
}

// Registering UserRole enum with GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

// Registering Department enum with GraphQL
registerEnumType(Department, {
  name: 'Department',
});

/**
 * User entity representing a user in the system.
 * Includes GraphQL ObjectType and Mongoose Schema definitions.
 * @class User
 * @extends Document
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - Name of the user.
 * @property {string} email - Email address of the user.
 */
@Schema({ timestamps: true, versionKey: false }) // Mongoose schema with timestamps
@ObjectType()
export class User {
  @Field(() => ID)
  id!: string; // Unique identifier for the user

  @Prop({ default: null })
  @Field({ nullable: true })
  employeeId?: string; // Employee ID for the user (optional)

  @Prop({ required: true })
  @Field()
  name!: string; // Name of the user

  @Prop()
  @Field()
  phoneNumber?: string; // Name of the user

  @Prop({ required: true, unique: true })
  @Field()
  email!: string; // Email address of the user

  @Prop({ required: true, select: false })
  password!: string; // Password for the user (should be hashed in production)

  @Prop({ default: UserRole.EMPLOYEE, enum: UserRole })
  @Field(() => UserRole)
  role: UserRole = UserRole.EMPLOYEE; // Default role for the user

  @Prop({ default: null, enum: Department })
  @Field(() => Department, { nullable: true })
  department?: Department; // Department of the user (optional)
}

export const UserSchema = SchemaFactory.createForClass(User);
