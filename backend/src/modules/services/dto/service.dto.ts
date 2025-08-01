import { ServiceCategory, ServiceCurrency } from '../../../entities/services/service.types';
import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lg: number;
}



export class ServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @IsEnum(ServiceCurrency)
  currency: ServiceCurrency;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString({ each: true })
  photos: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  location: CoordinatesDto;
}
