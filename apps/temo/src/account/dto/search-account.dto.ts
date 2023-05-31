import { IsString, IsNumber, IsOptional } from 'class-validator';

export default class SearchAccountsDTO {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  size?: number;
}
