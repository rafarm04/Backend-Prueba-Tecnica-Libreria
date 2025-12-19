import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'George Orwell' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '1984' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 1299,
    description: 'Price in cents',
  })
  @IsNumber()
  @Min(0)
  price: number;
}
