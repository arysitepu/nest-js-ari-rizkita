import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class CreateAuthenticationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  password: string;
}

export class CreateUserRoleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().uuid())
  role_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().uuid())
  company_id: string;
}

export class CreateRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  confirm_password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @JoiSchema(Joi.string().max(13).required())
  no_telp: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().optional())
  alamat_lengkap: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().uuid())
  country_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().uuid())
  province_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().uuid())
  city_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @JoiSchema(Joi.string().uuid())
  employee_id: string;

  @ApiProperty({ type: [CreateUserRoleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserRoleDto)
  user_role: CreateUserRoleDto[];
  
}
