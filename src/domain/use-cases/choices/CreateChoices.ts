import { ChoiceInput } from "../../dto/ChoiceInput";
import { createChoiceRepository } from "../../../adapters/mongo/repository/ChoiceRepository";

export const createChoiceUseCase = async (choiceInput: ChoiceInput) => {
  if (!choiceInput || !choiceInput.options) {
    throw new Error("As opções não podem estar vazias.");
  }
  if (!Array.isArray(choiceInput.options) || choiceInput.options.length !== 2) {
    throw new Error("A escolha deve ter exatamente duas opções.");
  }

  return await createChoiceRepository(choiceInput);
};