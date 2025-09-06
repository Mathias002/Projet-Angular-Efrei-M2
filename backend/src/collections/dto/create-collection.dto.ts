import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
