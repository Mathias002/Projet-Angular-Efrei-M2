import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCollectionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;
}
