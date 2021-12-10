import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategorieSchema } from "./interfaces/categorie.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Categorie", schema: CategorieSchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
