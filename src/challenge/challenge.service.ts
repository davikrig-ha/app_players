import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CategoriesService } from "src/categories/categories.service";
import { PlayersService } from "src/players/players.service";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { ChallengeStatus } from "./interfaces/challenge-status.enum";
import { Challenge, Game } from "./interfaces/challenge.interface";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel("Challenge") private readonly challengeModel: Model<Challenge>,
    @InjectModel("Game") private readonly gameModel: Model<Game>,
    private readonly PlayersService: PlayersService,
    private readonly categoriesService: CategoriesService
  ) {}
  private readonly logger = new Logger(ChallengeService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    /*
        Verificar se os jogadores informados estão cadastrados
        */

    const players = await this.PlayersService.consultAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player.id == playerDto.id
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `this id ${playerDto.id} does not a player!`
        );
      }
    });

    /*
        Verificar se o solicitante é um dos jogadores da partida
        */

    const solicitIsPlayerOfGame = await createChallengeDto.players.filter(
      (player) => player.id == createChallengeDto.solicit
    );
    this.logger.log(`solicit is a pleyer of the game ${solicitIsPlayerOfGame}`);
    if (solicitIsPlayerOfGame.length == 0) {
      throw new BadRequestException(`the solicit was a player`);
    }
    /*
        Descobrimos a categoria com base no ID do jogador solicitante
        */

    const playerCategorie = await this.categoriesService.consultPlayerCategorie(
      createChallengeDto.solicit
    );

    /*
        Para prosseguir o solicitante deve fazer parte de uma categoria
        */

    if (!playerCategorie) {
      throw new BadRequestException(
        `The solicit not was registred in a categorie!`
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.categorie = playerCategorie.categorie;
    createdChallenge.dateSolicited = new Date();
    /*
    Quando um desafio for criado, definimos o status desafio como pendente
    */
    createdChallenge.status = ChallengeStatus.PENDING;
    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);
    return await createdChallenge.save();
  }
}
