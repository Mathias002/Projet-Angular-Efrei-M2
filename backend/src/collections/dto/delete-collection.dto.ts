import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCollectionDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
