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
export declare type AdminProfileCreateFormInputValues = {
    displayName?: string;
};
export declare type AdminProfileCreateFormValidationValues = {
    displayName?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AdminProfileCreateFormOverridesProps = {
    AdminProfileCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    displayName?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AdminProfileCreateFormProps = React.PropsWithChildren<{
    overrides?: AdminProfileCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AdminProfileCreateFormInputValues) => AdminProfileCreateFormInputValues;
    onSuccess?: (fields: AdminProfileCreateFormInputValues) => void;
    onError?: (fields: AdminProfileCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AdminProfileCreateFormInputValues) => AdminProfileCreateFormInputValues;
    onValidate?: AdminProfileCreateFormValidationValues;
} & React.CSSProperties>;
export default function AdminProfileCreateForm(props: AdminProfileCreateFormProps): React.ReactElement;
