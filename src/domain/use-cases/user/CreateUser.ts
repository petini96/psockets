import { createUserRepository } from "../../../adapters/mongo/repository/UserRepository"
import { UserStoreInput } from "../../dto/UserInput"

export const createUserUseCase = (user: UserStoreInput) => {
    if (!user) {
        throw new Error("name cannot be empty")
    }
    return createUserRepository(user)
}