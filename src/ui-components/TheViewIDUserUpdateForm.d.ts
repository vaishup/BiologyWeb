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
export declare type TheViewIDUserUpdateFormInputValues = {
    name?: string;
    employeeId?: string;
    profileStatus?: string;
    attachment?: string;
    isLogin?: string;
    scanNumber?: string;
};
export declare type TheViewIDUserUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    employeeId?: ValidationFunction<string>;
    profileStatus?: ValidationFunction<string>;
    attachment?: ValidationFunction<string>;
    isLogin?: ValidationFunction<string>;
    scanNumber?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TheViewIDUserUpdateFormOverridesProps = {
    TheViewIDUserUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    employeeId?: PrimitiveOverrideProps<TextFieldProps>;
    profileStatus?: PrimitiveOverrideProps<TextFieldProps>;
    attachment?: PrimitiveOverrideProps<TextFieldProps>;
    isLogin?: PrimitiveOverrideProps<TextFieldProps>;
    scanNumber?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TheViewIDUserUpdateFormProps = React.PropsWithChildren<{
    overrides?: TheViewIDUserUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    theViewIDUser?: any;
    onSubmit?: (fields: TheViewIDUserUpdateFormInputValues) => TheViewIDUserUpdateFormInputValues;
    onSuccess?: (fields: TheViewIDUserUpdateFormInputValues) => void;
    onError?: (fields: TheViewIDUserUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TheViewIDUserUpdateFormInputValues) => TheViewIDUserUpdateFormInputValues;
    onValidate?: TheViewIDUserUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TheViewIDUserUpdateForm(props: TheViewIDUserUpdateFormProps): React.ReactElement;
