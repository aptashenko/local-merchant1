import {SuccessResponse} from "../common/interfaces/success-response";

export function successResponse<T>(data: T, message: string): SuccessResponse<T> {
    return { data, message };
}
