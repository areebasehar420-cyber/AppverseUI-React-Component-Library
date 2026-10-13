import { ReactNode } from 'react';
import {
  DefaultValues, FieldValues, FormProvider, RegisterOptions, Resolver, SubmitHandler, UseFormReturn, useForm, useFormContext,
} from 'react-hook-form';
import { Input, InputProps } from '../Input/Input';

export interface FormProps<T extends FieldValues> {
  /** Initial values for the form fields. */
  defaultValues?: DefaultValues<T>;
  /** Called with the values when validation passes. */
  onSubmit: SubmitHandler<T>;
  /** Optional schema resolver (for example from @hookform/resolvers). */
  resolver?: Resolver<T>;
  /** Form content, or a render function receiving the React Hook Form methods. */
  children: ReactNode | ((methods: UseFormReturn<T>) => ReactNode);
  className?: string;
}

/**
 * Form wrapper built on React Hook Form. Provides form context to `FormField`.
 * Fields are uncontrolled by default, which keeps re-renders low.
 */
export function Form<T extends FieldValues>({ defaultValues, onSubmit, resolver, children, className }: FormProps<T>) {
  const methods = useForm<T>({ defaultValues, resolver });
  return (
    <FormProvider {...methods}>
      <form noValidate className={className} onSubmit={methods.handleSubmit(onSubmit)}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}

export interface FormFieldProps extends Omit<InputProps, 'name' | 'error'> {
  /** Field name (key in the form values). */
  name: string;
  /** React Hook Form validation rules, e.g. `{ required: 'Required' }`. */
  rules?: RegisterOptions;
}

/** Input registered with the surrounding `Form`; shows validation errors automatically. */
export function FormField({ name, rules, ...inputProps }: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const message = errors[name]?.message as string | undefined;
  return <Input {...inputProps} {...register(name, rules)} error={message} />;
}
