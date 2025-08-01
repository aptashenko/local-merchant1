import {ServicesService} from "./services.service";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServiceDto } from './dto/service.dto';
import { SuccessResponse } from '../../common/interfaces/success-response';
import { Service } from '../../entities/services/service.entity';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}
    @Get('all')
    getAll() {
        return this.servicesService.getAllServices();
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    getMy(@Req() req): Promise<SuccessResponse<Omit<Service, "userId">[]>> {
        return this.servicesService.getMyServices(req.user.sub);
    }


    @Get(':id')
    getById(@Param('id') id: string): Promise<SuccessResponse<Omit<Service, 'userId'>>> {
        return this.servicesService.getServiceById(id);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    createService(@Body() body: ServiceDto, @Req() req): Promise<SuccessResponse<ServiceDto>> {
        return this.servicesService.addService(body, req.user.sub)
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    updateService(@Param('id') id: string, @Body() body: ServiceDto, @Req() req): Promise<SuccessResponse<ServiceDto>> {
        return this.servicesService.updateService(id, body, req.user.sub)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteService(@Body() id: string, @Req() req): Promise<SuccessResponse<boolean>> {
        return this.servicesService.deleteService(id, req.user.sub)
    }
}
