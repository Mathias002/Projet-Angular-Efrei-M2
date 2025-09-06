import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;
}
