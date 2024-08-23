import { sendBucket } from "../../../adapters/aws-s3";
import { createUserRepository } from "../../../adapters/mongo/repository/UserRepository"
import { UserStoreInput } from "../../dto/UserInput"

export const createUserUseCase = async (user: UserStoreInput, filePath: string): Promise<any> => {
    if (!user.name) {
        throw new Error("name cannot be empty");
    }

    try {
        const key = `players/${user.name}-${Date.now()}.jpg`;

        const photoUrl = await sendBucket({
            bucketName: "psockets",
            key: key,
            filePath: filePath
        });

        user.photo = photoUrl;

        return await createUserRepository(user);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create user");
    }
}