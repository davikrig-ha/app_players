import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GameSchema } from "src/challenge/interfaces/game.schema";
import { PlayersModule } from "src/players/players.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategorieSchema } from "./interfaces/categorie.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Categorie", schema: CategorieSchema },
      { name: "Game", schema: GameSchema },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
