import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class UpdateCategorieDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
