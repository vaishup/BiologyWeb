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
export declare type TheStaffUpdateFormInputValues = {
    name?: string;
    phoneNumber?: string;
    email?: string;
    DOB?: string;
    photourl?: string;
    isBiomatritcs?: string;
    profileStatus?: string;
    Location?: string;
    IsActive?: string;
    shiftIds?: string[];
    userId?: string;
    latitude?: string;
    longitude?: string;
};
export declare type TheStaffUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    DOB?: ValidationFunction<string>;
    photourl?: ValidationFunction<string>;
    isBiomatritcs?: ValidationFunction<string>;
    profileStatus?: ValidationFunction<string>;
    Location?: ValidationFunction<string>;
    IsActive?: ValidationFunction<string>;
    shiftIds?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    latitude?: ValidationFunction<string>;
    longitude?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TheStaffUpdateFormOverridesProps = {
    TheStaffUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    DOB?: PrimitiveOverrideProps<TextFieldProps>;
    photourl?: PrimitiveOverrideProps<TextFieldProps>;
    isBiomatritcs?: PrimitiveOverrideProps<TextFieldProps>;
    profileStatus?: PrimitiveOverrideProps<TextFieldProps>;
    Location?: PrimitiveOverrideProps<TextFieldProps>;
    IsActive?: PrimitiveOverrideProps<TextFieldProps>;
    shiftIds?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    latitude?: PrimitiveOverrideProps<TextFieldProps>;
    longitude?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TheStaffUpdateFormProps = React.PropsWithChildren<{
    overrides?: TheStaffUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    theStaff?: any;
    onSubmit?: (fields: TheStaffUpdateFormInputValues) => TheStaffUpdateFormInputValues;
    onSuccess?: (fields: TheStaffUpdateFormInputValues) => void;
    onError?: (fields: TheStaffUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TheStaffUpdateFormInputValues) => TheStaffUpdateFormInputValues;
    onValidate?: TheStaffUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TheStaffUpdateForm(props: TheStaffUpdateFormProps): React.ReactElement;
