import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlayersModule } from "src/players/players.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategorieSchema } from "./interfaces/categorie.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Categorie", schema: CategorieSchema }]),
    PlayersModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
