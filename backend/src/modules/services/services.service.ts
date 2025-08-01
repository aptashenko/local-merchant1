import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {Service} from "../../entities/services/service.entity";
import {SuccessResponse} from "../../common/interfaces/success-response";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {successResponse} from "../../helpers";
import { ServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
    ) {}

    async getAllServices(): Promise<SuccessResponse<Omit<Service, "userId">[]>> {
        const services: Service[] = await this.serviceRepository.find({
            order: { createdAt: 'DESC' },
        });

        const cleaned = services.map(({ userId, ...rest }) => ({
            ...rest,
            owner: userId,
        }));
        return successResponse(cleaned, 'success')
    }

    async deleteService(id: string, userId: string): Promise<SuccessResponse<boolean>> {
        if (!userId) {
            throw new UnauthorizedException('Access denied')
        }
        const service: Service | null = await this.serviceRepository.findOneBy({id});

        if (!service) {
            throw new NotFoundException(`Service ${id} not found`);
        }

        await this.serviceRepository.remove(service)

        return successResponse(true, 'success')
    }

    async getMyServices(userId: string): Promise<SuccessResponse<Omit<Service, "userId">[]>> {
        const services: Service[] = await this.serviceRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });

        const cleaned = services.map(({ userId, ...rest }) => ({
            ...rest,
            owner: userId,
        }));

        return successResponse(cleaned, 'success')
    }

    async getServiceById(id: string): Promise<SuccessResponse<Omit<Service, "userId">>> {
        if (!id) {
            throw new NotFoundException('Service not found')
        }

        const service: Service | null = await this.serviceRepository.findOneBy({id});

        if (!service) {
            throw new NotFoundException('Service not found')
        }

        const { userId, ...rest } = service;

        return successResponse(rest, 'success')
    }

    async addService(service: ServiceDto, userId: string): Promise<SuccessResponse<ServiceDto>> {
        if (!userId) {
            throw new ForbiddenException('UserId is empty')
        }
        const newService: Service = this.serviceRepository.create({
            ...service,
            userId,
            lat: service.location.lat,
            lg: service.location.lg
        });

        const { id, title, description, category, photos, price , currency , lat, lg,  createdAt } = await this.serviceRepository.save<Service>(newService);
        const payload = {id, title, description, category, photos, price, currency, location: {lat, lg}, createdAt};
        return successResponse(payload, 'success')
    }

    async updateService(serviceId: string, service: ServiceDto, userId: string): Promise<SuccessResponse<ServiceDto>> {
        if (!userId) {
            throw new ForbiddenException('user_id is empty')
        }

        const oldService: Service | null = await this.serviceRepository.findOneBy({id: serviceId});

        if (!oldService) {
            throw new NotFoundException(`There is no service with id ${serviceId}`)
        }

        if (oldService.userId !== userId) {
            throw new ForbiddenException('You can update only your own service');
        }

        const updatedService = this.serviceRepository.merge(oldService, {
            title: service.title,
            description: service.description,
            category: service.category,
            price: service.price,
            photos: service.photos,
            lat: service.location.lat,
            lg: service.location.lg,
        });

        await this.serviceRepository.save(updatedService);
        const { id, title, description, category, photos, price , currency , lat, lg,  createdAt } = await this.serviceRepository.save(updatedService);
        const payload = {id, title, description, category, photos, price, currency, location: {lat, lg}, createdAt};

        return successResponse(payload, 'success');
    }

}
