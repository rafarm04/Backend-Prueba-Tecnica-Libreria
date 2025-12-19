import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteBookDto {
  @ApiProperty({
    example: 'ckx123abc456',
    description: 'Book ID',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
