/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { AdminProfile } from "../API.ts";
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
export declare type AdminProfileUpdateFormInputValues = {
    displayName?: string;
};
export declare type AdminProfileUpdateFormValidationValues = {
    displayName?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AdminProfileUpdateFormOverridesProps = {
    AdminProfileUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    displayName?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AdminProfileUpdateFormProps = React.PropsWithChildren<{
    overrides?: AdminProfileUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    adminProfile?: AdminProfile;
    onSubmit?: (fields: AdminProfileUpdateFormInputValues) => AdminProfileUpdateFormInputValues;
    onSuccess?: (fields: AdminProfileUpdateFormInputValues) => void;
    onError?: (fields: AdminProfileUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AdminProfileUpdateFormInputValues) => AdminProfileUpdateFormInputValues;
    onValidate?: AdminProfileUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AdminProfileUpdateForm(props: AdminProfileUpdateFormProps): React.ReactElement;
