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
export declare type TheShiftsCreateFormInputValues = {
    Location?: string;
    duties?: string;
    staffId?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string;
    shiftstatus?: string;
    userId?: string;
};
export declare type TheShiftsCreateFormValidationValues = {
    Location?: ValidationFunction<string>;
    duties?: ValidationFunction<string>;
    staffId?: ValidationFunction<string>;
    time?: ValidationFunction<string>;
    startTime?: ValidationFunction<string>;
    endTime?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    shiftstatus?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TheShiftsCreateFormOverridesProps = {
    TheShiftsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Location?: PrimitiveOverrideProps<TextFieldProps>;
    duties?: PrimitiveOverrideProps<TextFieldProps>;
    staffId?: PrimitiveOverrideProps<TextFieldProps>;
    time?: PrimitiveOverrideProps<TextFieldProps>;
    startTime?: PrimitiveOverrideProps<TextFieldProps>;
    endTime?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    shiftstatus?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TheShiftsCreateFormProps = React.PropsWithChildren<{
    overrides?: TheShiftsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TheShiftsCreateFormInputValues) => TheShiftsCreateFormInputValues;
    onSuccess?: (fields: TheShiftsCreateFormInputValues) => void;
    onError?: (fields: TheShiftsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TheShiftsCreateFormInputValues) => TheShiftsCreateFormInputValues;
    onValidate?: TheShiftsCreateFormValidationValues;
} & React.CSSProperties>;
export default function TheShiftsCreateForm(props: TheShiftsCreateFormProps): React.ReactElement;
