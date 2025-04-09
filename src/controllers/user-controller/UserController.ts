import { Response, Request } from "express";
import User from "src/models/DBCollectionSchemaModel/User.model";
import { userService } from "../../services/user-service/UserService";

class UserController {
    public async validateJsonToken(token: string) {

    }

    public async registerUser(req: Request, res: Response) {
        try {
            const userDetails = req?.body;
            const response = await userService.registerUser(userDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async loginUser(user: User) {

    }
}

const userController = new UserController();
export { userController };