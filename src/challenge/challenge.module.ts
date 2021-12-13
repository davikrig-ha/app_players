import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengeSchema } from './interfaces/challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Challenge", schema: ChallengeSchema }]),
    PlayersModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService]
})
export class ChallengeModule {}
