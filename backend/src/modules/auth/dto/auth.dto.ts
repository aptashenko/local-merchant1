import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
import {Match} from "../../../common/validators/match.decorator";

export class RegisterDto {
    @IsEmail({}, { message: 'Login must be an email' })
    @IsNotEmpty({message: 'Email is required'})
    login: string;

    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    password: string;

    @Match('password', { message: 'Passwords do not match' })
    @IsNotEmpty({message: 'Password is required'})
    confirm_password: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Login must be an email' })
    @IsNotEmpty({message: 'Email is required'})
    login: string;

    @IsNotEmpty({message: 'Password is required'})
    password: string;
}
