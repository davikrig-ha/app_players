import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CategoriesService } from "src/categories/categories.service";
import { PlayersService } from "src/players/players.service";
import { AtributeChallengeGameDto } from "./dtos/atribute-challenge-game.dto";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { UpdateChallengeDto } from "./dtos/update-challenge.dto";
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

  async consultAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate("solicit")
      .populate("players")
      .populate("game")
      .exec();
  }

  async consultChallengesOfPlayer(id: any): Promise<Array<Challenge>> {
    const players = await this.PlayersService.consultAllPlayers();

    const playerFilter = players.filter((player) => player.id == id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`this id ${id} is not a player!`);
    }

    return await this.challengeModel
      .find()
      .where("players")
      .in(id)
      .populate("solicit")
      .populate("players")
      .populate("game")
      .exec();
  }

  async updateChallenge(
    id: string,
    updateChallengeDto: UpdateChallengeDto
  ): Promise<void> {
    const findChallenge = await this.challengeModel.findById(id).exec();

    if (!findChallenge) {
      throw new NotFoundException(`Challenge ${id} not registred!`);
    }

    /*
     Atualizaremos a data da resposta quando o status do desafio vier preenchido 
     */
    if (updateChallengeDto.status) {
      findChallenge.dateResponce = new Date();
    }
    findChallenge.status = updateChallengeDto.status;
    findChallenge.dateChallenge = updateChallengeDto.dateChallenge;

    await this.challengeModel
      .findOneAndUpdate({ id }, { $set: findChallenge })
      .exec();
  }

  async atributeChallengeGame(
    id: string,
    atributeChallengeGameDto: AtributeChallengeGameDto
  ): Promise<void> {
    const findChallenge = await this.challengeModel.findById(id).exec();

    if (!findChallenge) {
      throw new BadRequestException(`Challenge ${id} not registred!`);
    }

    /*
     Verificar se o jogador vencedor faz parte do desafio
     */
    const playerFilter = findChallenge.Players.filter(
      (player) => player.id == atributeChallengeGameDto.def
    );

    this.logger.log(`findChallenge: ${findChallenge}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `this winner player is not found in the game!`
      );
    }

    /*
     Primeiro vamos criar e persistir o objeto partida
     */
    const createGame = new this.gameModel(atributeChallengeGameDto);

    /*
    Atribuir ao objeto partida a categoria recuperada no desafio
    */
    createGame.categorie = findChallenge.categorie;

    /*
    Atribuir ao objeto partida os jogadores que fizeram parte do desafio
    */
    createGame.players = findChallenge.Players;

    const result = await createGame.save();

    /*
     Quando uma partida for registrada por um usuário, mudaremos o 
     status do desafio para realizado
     */
    findChallenge.status = ChallengeStatus.ACCOMPLISHED;

    /*  
     Recuperamos o ID da partida e atribuimos ao desafio
     */
    findChallenge.game = result.id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ id }, { $set: findChallenge })
        .exec();
    } catch (error) {
      /*
         Se a atualização do desafio falhar excluímos a partida 
         gravada anteriormente
         */
      await this.gameModel.deleteOne({ id: result.id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(id: string): Promise<void> {
    const findChallenge = await this.challengeModel.findById(id).exec();

    if (!findChallenge) {
      throw new BadRequestException(`Challenge ${id} not registered!`);
    }

    /*
     Realizaremos a deleção lógica do desafio, modificando seu status para
     CANCELADO
     */
    findChallenge.status = ChallengeStatus.CANCELLED;

    await this.challengeModel
      .findOneAndUpdate({ id }, { $set: findChallenge })
      .exec();
  }
}
