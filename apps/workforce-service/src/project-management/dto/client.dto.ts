import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {
  @ApiProperty({
    required: true,
    description: "The name of the client",
    example: "Acme Corp",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;
}

export class UpdateClientDto {
  @ApiProperty({
    required: true,
    description: "The name of the client",
    example: "Acme Corp Updated",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;
}
