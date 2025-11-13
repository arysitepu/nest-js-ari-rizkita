import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateAuthenticationDto, CreateRegisterDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { decryptPwd } from 'src/shared/utils/hash';
import {} from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { GeneralService } from 'src/general/general-service';
import { getDateNow } from 'src/shared/utils/tootls';
@Injectable()
export class AuthenticationService {
  private readonly logger : Logger;
  private readonly jwtSecret: string; 
  constructor(private prisma: PrismaService, private generalService: GeneralService) {
    this.logger = new Logger('Auth Services');
    this.jwtSecret = process.env.JWT_SECRET;
  }

async validate(ids:{
  country_id : string;
  province_id : string;
  city_id: string;
  employee_id: string;
}){
  const { country_id, province_id, city_id, employee_id} = ids;
  const [get_country_id, get_province_id, get_city_id, get_employee_id] = await Promise.all([
      this.prisma.countries.findUnique({
        where: { id: country_id, deleted_at: null },
      }),
      this.prisma.provinces.findUnique({
        where: { id: province_id, deleted_at: null },
      }),
      this.prisma.cities.findUnique({
        where: { id: city_id, deleted_at: null },
      }),
      this.prisma.employees.findUnique({
        where: { id: employee_id, deleted_at: null},
      })
  ])
    if (!get_country_id)
      throw new BadRequestException(
        `Data country type doesn't exist`,
      );
    if (!get_province_id)
      throw new BadRequestException(`Data province doesn't exist`);

    if (!get_city_id)
      throw new BadRequestException(`Data city doesn't exist`);

    if (!get_employee_id)
      throw new BadRequestException(`Data employee doesn't exist`);

    return true;
}

async validateDetail(details: {
  role_id : string,
  company_id : string 
}[]){
  for (let i = 0; i < details.length; i++) {
    const detail = details[i];
      if (detail.role_id) {
        const role = await this.prisma.roles.findUnique({
          where: { id: detail.role_id, deleted_at: null},
        });
        if (!role) {
          throw new BadRequestException(
            `Role with id ${detail.role_id} doesn't exist. please check your data`,
          );
        }
      }

      if (detail.company_id) {
        const role = await this.prisma.companies.findUnique({
          where: { id: detail.company_id, deleted_at: null},
        });
        if (!role) {
          throw new BadRequestException(
            `Company with id ${detail.company_id} doesn't exist. please check your data`,
          );
        }
      }
  }
}

async register(body: CreateRegisterDto) {
   try {
      const {
        name,
        username,
        password,
        confirm_password,
        email,
        no_telp,
        alamat_lengkap,
        country_id,
        province_id,
        city_id,
        employee_id,
        user_role
      } = body
      const result = await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.generalService.encryptPassword(password);
      const confirmPassword = hashedPassword
      const currDate = await getDateNow();
        if(password !== confirm_password){
          throw new BadRequestException(`Password doesn't match`)
        }
         const newData = await tx.users.create({
              data: {
                  name,
                  username,
                  password : hashedPassword,
                  confirm_password : confirmPassword,
                  email,
                  no_telp,
                  alamat_lengkap,
                  country_id,
                  province_id,
                  city_id,
                  employee_id,
                  created_at : currDate,
                  created_by : name 
              }
          })
          if (user_role && user_role.length > 0) {
             const detailUserRole = user_role.map((detail) => {
              return{
                user_id : newData.id,
                role_id : detail.role_id,
                company_id : detail.company_id,
                created_at : currDate,
                created_by : newData.name
              }
             })

              await tx.userRoles.createMany({
                data: detailUserRole,
              });
          }
          return newData
      },{timeout : 10000})
      return {
        status : HttpStatus.OK,
        messagex : `registered successfully`,
        user_id : result.id
      }
   } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed create cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed create data', logMessage);
   }
}
 async login(body: CreateAuthenticationDto) {
    try {
    const { username, password } = body;
    const result_enc = this.generalService.encrypt(password);
    const dec = result_enc;
    const result_dec = this.generalService.decrypt(dec)
      const user = await this.prisma.users.findUnique({
        where: { username },
        include : {
          UserRoles : {
            include : {
              Roles : {
                select : {
                  id : true,
                  role_code : true,
                  role_name : true
                }
              },
              Companies : {
                select : {
                  id : true,
                  company_code : true,
                  company_name : true
                }
              }
            }
          }
        }
      });
      if (!user || !(await bcrypt.compare(result_dec, user.password))) {
        throw new Error('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(result_dec, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }
      const role = user.UserRoles.map((items)=> {
        return {
          role_id : items.Roles.id,
          role_name : items.Roles.role_name
        }
      })
      const company = user.UserRoles.map((items)=> {
        return {
          company_id : items.Companies.id,
          company_name : items.Companies.company_name
        }
      })
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role : role, 
          company : company
         },
        this.jwtSecret,
        { expiresIn: '3h' },
      );
    return {
      status : HttpStatus.OK,
      message: 'Login success',
      token,
    };
    } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed login cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed login data', logMessage);
    }
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
