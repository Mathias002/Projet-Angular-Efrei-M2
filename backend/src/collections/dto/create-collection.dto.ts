import { IsNotEmpty, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
