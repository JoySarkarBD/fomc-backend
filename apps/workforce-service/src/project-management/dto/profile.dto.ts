import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({
    required: true,
    description: "The name of the profile",
    example: "Standard Profile",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    required: true,
    description: "The name of the profile",
    example: "Standard Profile Updated",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;
}
