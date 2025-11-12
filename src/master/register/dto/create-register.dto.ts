import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";
import { regexValidationInput } from "src/shared/utils/constant";

export class CreateAuthsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
    Joi.string().required().uuid(),
    )
    group_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
    Joi.string().required().uuid(),
    )
    company_id: string;
}
export class CreateRegisterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
        Joi.string().max(100).required().regex(regexValidationInput, { invert: true }),
    )
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
        Joi.string().max(100).required().regex(regexValidationInput, { invert: true }),
    )
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
        Joi.string().min(8).required().pattern(/^(?=.*[0-9])(?=.*[^A-Za-z0-9])(.{8,})$/, {name: 'Password must be at least 8 characters, include a number and a special character.'})
    )
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
        Joi.string().min(8).required().pattern(/^(?=.*[0-9])(?=.*[^A-Za-z0-9])(.{8,})$/, {name: 'Password must be at least 8 characters, include a number and a special character.'})
    )
    confirm_password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
        Joi.string()
        .required()
        .regex(regexValidationInput, { invert: true })
        .allow(null)
        .email(),
    )
    employee_email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
        Joi.string().max(100).required().regex(regexValidationInput, { invert: true }),
    )
    nomor_telp: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @JoiSchema(
        Joi.string().optional().regex(regexValidationInput, { invert: true }),
    )
    alamat: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
    Joi.string().required().uuid(),
    )
    country_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
    Joi.string().required().uuid(),
    )
    province_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @JoiSchema(
    Joi.string().required().uuid(),
    )
    city_id: string;

    @ApiProperty({ type: [CreateAuthsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAuthsDto)
    create_auth: CreateAuthsDto[];
}
