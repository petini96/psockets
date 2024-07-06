import { NewsStoreInput } from "../../../domain/dto/NewsInput"
import { News } from "../schemas/newsSchema"

export async function createNewsRepository(newNews: NewsStoreInput) {
    try {
        const news = new News({
            title: newNews.title,
            message: newNews.message
        });
        await news.save()
        return news
    } catch (error) {
        console.error(error)
    }
}