import { UserStoreInput } from "../../../domain/dto/UserInput"
import { User } from "../schemas/userSchema"

export async function createUserRepository(newUser: UserStoreInput) {
    try {
        const user = new User({
            name: newUser.name,
            photo: newUser.photo
        });
        await user.save()
        return user
    } catch (error) {
        console.error(error)
    }
}