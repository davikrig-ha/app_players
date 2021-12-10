
import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from "class-validator";
import { Event } from "../interfaces/categorie.interface";

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty()
  readonly categorie: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
