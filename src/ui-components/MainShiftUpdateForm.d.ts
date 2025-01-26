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
export declare type MainShiftUpdateFormInputValues = {
    locationID?: string;
    shiftName?: string;
    duties?: string;
    shiftDate?: string;
    shiftStartTime?: string;
    shiftEndTime?: string;
    createdBy?: string;
    startDate?: string;
    endDate?: string;
    shiftstatus?: string;
    userId?: string;
    staffIds?: string[];
};
export declare type MainShiftUpdateFormValidationValues = {
    locationID?: ValidationFunction<string>;
    shiftName?: ValidationFunction<string>;
    duties?: ValidationFunction<string>;
    shiftDate?: ValidationFunction<string>;
    shiftStartTime?: ValidationFunction<string>;
    shiftEndTime?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    shiftstatus?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    staffIds?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MainShiftUpdateFormOverridesProps = {
    MainShiftUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    locationID?: PrimitiveOverrideProps<TextFieldProps>;
    shiftName?: PrimitiveOverrideProps<TextFieldProps>;
    duties?: PrimitiveOverrideProps<TextFieldProps>;
    shiftDate?: PrimitiveOverrideProps<TextFieldProps>;
    shiftStartTime?: PrimitiveOverrideProps<TextFieldProps>;
    shiftEndTime?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    shiftstatus?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    staffIds?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MainShiftUpdateFormProps = React.PropsWithChildren<{
    overrides?: MainShiftUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    mainShift?: any;
    onSubmit?: (fields: MainShiftUpdateFormInputValues) => MainShiftUpdateFormInputValues;
    onSuccess?: (fields: MainShiftUpdateFormInputValues) => void;
    onError?: (fields: MainShiftUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MainShiftUpdateFormInputValues) => MainShiftUpdateFormInputValues;
    onValidate?: MainShiftUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MainShiftUpdateForm(props: MainShiftUpdateFormProps): React.ReactElement;
