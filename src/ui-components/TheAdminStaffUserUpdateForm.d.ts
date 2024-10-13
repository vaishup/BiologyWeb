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
export declare type TheAdminStaffUserUpdateFormInputValues = {
    name?: string;
    phoneNumber?: string;
    email?: string;
    userType?: string;
};
export declare type TheAdminStaffUserUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    userType?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TheAdminStaffUserUpdateFormOverridesProps = {
    TheAdminStaffUserUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    userType?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TheAdminStaffUserUpdateFormProps = React.PropsWithChildren<{
    overrides?: TheAdminStaffUserUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    theAdminStaffUser?: any;
    onSubmit?: (fields: TheAdminStaffUserUpdateFormInputValues) => TheAdminStaffUserUpdateFormInputValues;
    onSuccess?: (fields: TheAdminStaffUserUpdateFormInputValues) => void;
    onError?: (fields: TheAdminStaffUserUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TheAdminStaffUserUpdateFormInputValues) => TheAdminStaffUserUpdateFormInputValues;
    onValidate?: TheAdminStaffUserUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TheAdminStaffUserUpdateForm(props: TheAdminStaffUserUpdateFormProps): React.ReactElement;
