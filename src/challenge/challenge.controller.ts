import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChallengeService } from "./challenge.service";
import { AtributeChallengeGameDto } from "./dtos/atribute-challenge-game.dto";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { UpdateChallengeDto } from "./dtos/update-challenge.dto";
import { Challenge } from "./interfaces/challenge.interface";
import { ChallengeStatusValidationPipe } from "./pipes/challenge-status-validation.pipe";

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

  @Get()
  async consultChallenges(
    @Query("idPlayer") id: string
  ): Promise<Array<Challenge>> {
    return id
      ? await this.challengeService.consultChallengesOfPlayer(id)
      : await this.challengeService.consultAllChallenges();
  }

  @Put("/:challenge")
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) UpdateChallengeDto: UpdateChallengeDto,
    @Param("challenge") id: string
  ): Promise<void> {
    await this.challengeService.updateChallenge(id, UpdateChallengeDto);
  }

  @Post("/:challenge/game/")
  async atributeChallengeGame(
    @Body(ValidationPipe) atributeChallengeGameDto: AtributeChallengeGameDto,
    @Param("challenge") id: string
  ): Promise<void> {
    return await this.challengeService.atributeChallengeGame(
      id,
      atributeChallengeGameDto
    );
  }

  @Delete("/:_id")
  async deleteChallenge(@Param("id") id: string): Promise<void> {
    await this.challengeService.deleteChallenge(id);
  }
}
