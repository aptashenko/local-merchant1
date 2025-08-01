// match.decorator.ts
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function Match(
    property: string,
    validationOptions?: ValidationOptions
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'match',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return value === (args.object as any)[relatedPropertyName];
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must match ${args.constraints[0]}`;
                },
            },
        });
    };
}
