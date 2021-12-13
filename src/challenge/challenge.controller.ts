import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChallengeService } from "./challenge.service";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { Challenge } from "./interfaces/challenge.interface";

@Controller("challenge")
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`
    );
    return await this.challengeService.createChallenge(createChallengeDto);
  }
}
