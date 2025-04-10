// adapters/mongo/repository/ChoiceRepository.ts
import { ChoiceInput } from "../../../domain/dto/ChoiceInput";
import { Choice } from "../schemas/choiceSchema";

export async function createChoiceRepository(choice: ChoiceInput) {
  try {
    if (!choice.options || choice.options.length !== 2) {
      throw new Error("A escolha deve ter exatamente duas opções.");
    }

    const newChoice = new Choice({
      options: choice.options.map((text: string, index: number) => ({
        id: index + 1,
        text,
      })),
    });

    const savedChoice = await newChoice.save();
    return savedChoice;
  } catch (error: any) {
    throw new Error(`Erro ao salvar a escolha: ${error.message}`);
  }
}

export async function getAllChoices() {
  try {
    const choices = await Choice.find();
    return choices;
  } catch (error: any) {
    throw new Error(`Erro ao buscar escolhas: ${error.message}`);
  }
}