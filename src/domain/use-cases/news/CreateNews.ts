import { createNewsRepository } from "../../../adapters/mongo/repository/NewsRepository"
import { NewsStoreInput } from "../../dto/NewsInput"
 
export const createNewsUseCase = (news: NewsStoreInput) => {
    if (!news) {
        throw new Error("name cannot be empty")
    }
    return createNewsRepository(news)
}