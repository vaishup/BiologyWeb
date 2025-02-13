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
export declare type TheShiftsUpdateFormInputValues = {
    duties?: string;
    staffId?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string;
    shiftstatus?: string;
    userId?: string;
    checkInTIme?: string;
    checkOutTime?: string;
    AdminTime?: string;
    AssignStatus?: string;
    locationID?: string;
    amendment?: string;
};
export declare type TheShiftsUpdateFormValidationValues = {
    duties?: ValidationFunction<string>;
    staffId?: ValidationFunction<string>;
    time?: ValidationFunction<string>;
    startTime?: ValidationFunction<string>;
    endTime?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    shiftstatus?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    checkInTIme?: ValidationFunction<string>;
    checkOutTime?: ValidationFunction<string>;
    AdminTime?: ValidationFunction<string>;
    AssignStatus?: ValidationFunction<string>;
    locationID?: ValidationFunction<string>;
    amendment?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TheShiftsUpdateFormOverridesProps = {
    TheShiftsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    duties?: PrimitiveOverrideProps<TextFieldProps>;
    staffId?: PrimitiveOverrideProps<TextFieldProps>;
    time?: PrimitiveOverrideProps<TextFieldProps>;
    startTime?: PrimitiveOverrideProps<TextFieldProps>;
    endTime?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    shiftstatus?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    checkInTIme?: PrimitiveOverrideProps<TextFieldProps>;
    checkOutTime?: PrimitiveOverrideProps<TextFieldProps>;
    AdminTime?: PrimitiveOverrideProps<TextFieldProps>;
    AssignStatus?: PrimitiveOverrideProps<TextFieldProps>;
    locationID?: PrimitiveOverrideProps<TextFieldProps>;
    amendment?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TheShiftsUpdateFormProps = React.PropsWithChildren<{
    overrides?: TheShiftsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    theShifts?: any;
    onSubmit?: (fields: TheShiftsUpdateFormInputValues) => TheShiftsUpdateFormInputValues;
    onSuccess?: (fields: TheShiftsUpdateFormInputValues) => void;
    onError?: (fields: TheShiftsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TheShiftsUpdateFormInputValues) => TheShiftsUpdateFormInputValues;
    onValidate?: TheShiftsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TheShiftsUpdateForm(props: TheShiftsUpdateFormProps): React.ReactElement;
