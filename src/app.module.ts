import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PlayersModule } from "./players/players.module";
import { CategoriesModule } from './categories/categories.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://davi:170601da@cluster0.hocvo.mongodb.net/applayer?retryWrites=true&w=majority"
    ),
    PlayersModule,
    CategoriesModule,
    ChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
