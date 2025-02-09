/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TheViewIDUserCreateFormInputValues = {
    name?: string;
    employeeId?: string;
    profileStatus?: string;
    attachment?: string;
};
export declare type TheViewIDUserCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    employeeId?: ValidationFunction<string>;
    profileStatus?: ValidationFunction<string>;
    attachment?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TheViewIDUserCreateFormOverridesProps = {
    TheViewIDUserCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    employeeId?: PrimitiveOverrideProps<TextFieldProps>;
    profileStatus?: PrimitiveOverrideProps<TextFieldProps>;
    attachment?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TheViewIDUserCreateFormProps = React.PropsWithChildren<{
    overrides?: TheViewIDUserCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TheViewIDUserCreateFormInputValues) => TheViewIDUserCreateFormInputValues;
    onSuccess?: (fields: TheViewIDUserCreateFormInputValues) => void;
    onError?: (fields: TheViewIDUserCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TheViewIDUserCreateFormInputValues) => TheViewIDUserCreateFormInputValues;
    onValidate?: TheViewIDUserCreateFormValidationValues;
} & React.CSSProperties>;
export default function TheViewIDUserCreateForm(props: TheViewIDUserCreateFormProps): React.ReactElement;
