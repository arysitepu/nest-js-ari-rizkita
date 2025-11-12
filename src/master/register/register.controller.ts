import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { JoiPipe } from 'nestjs-joi';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Register')
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('create')
 async create(@Body(JoiPipe) createRegisterDto: CreateRegisterDto) {
    return this.registerService.create(createRegisterDto);
  }

  @Get('findUser')
 async findAll() {
    return this.registerService.findAll();
  }

  @Get('detail/:id')
 async findOne(@Param('id') id: string) {
    return this.registerService.findOne(+id);
  }

  @Patch('update/:id')
 async update(@Param('id') id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
    return this.registerService.update(+id, updateRegisterDto);
  }

  @Delete('delete/:id')
async  remove(@Param('id') id: string) {
    return this.registerService.remove(+id);
  }
}
