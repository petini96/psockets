import { Request, Response } from "express"
import { createChoiceUseCase } from "../../../domain/use-cases/choices/CreateChoices"
import { ChoiceInput } from "../../../domain/dto/ChoiceInput";
import { Choice } from "../../../adapters/mongo/schemas/choiceSchema";
import { getAllChoices } from "../../../adapters/mongo/repository/ChoiceRepository";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const newsRequest = req.body as ChoiceInput
  try {
    const news = await createChoiceUseCase(newsRequest)
    return res.status(200).json(news);
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const choices = await getAllChoices();
    return res.status(200).json(choices);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Erro ao buscar escolhas" });
  }
};

export const vote = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { optionId } = req.body;

  try {
    const choice = await Choice.findById(id);
    if (!choice) {
      return res.status(404).json({ error: "Escolha não encontrada" });
    }

    const option = choice.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(404).json({ error: "Opção não encontrada" });
    }

    option.votes = (option.votes || 0) + 1;
    choice.totalVotes = (choice.totalVotes || 0) + 1;

    await choice.save();
    return res.status(200).json(choice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao registrar voto" });
  }
};