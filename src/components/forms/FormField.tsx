
import React, { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label?: string;
  id?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children?: ReactNode;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'input';
  inputType?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface CustomFieldProps extends BaseFieldProps {
  type: 'custom';
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps | CustomFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, id, required, error, className, children, type } = props;

  const renderField = () => {
    switch (type) {
      case 'input':
        const inputProps = props as InputFieldProps;
        return (
          <Input
            id={id}
            type={inputProps.inputType || 'text'}
            value={inputProps.value}
            onChange={(e) => inputProps.onChange(e.target.value)}
            placeholder={inputProps.placeholder}
            className={cn(error && "border-red-500")}
            required={required}
          />
        );

      case 'select':
        const selectProps = props as SelectFieldProps;
        return (
          <Select value={selectProps.value} onValueChange={selectProps.onChange}>
            <SelectTrigger className={cn(error && "border-red-500")}>
              <SelectValue placeholder={selectProps.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {selectProps.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        const textareaProps = props as TextareaFieldProps;
        return (
          <Textarea
            id={id}
            value={textareaProps.value}
            onChange={(e) => textareaProps.onChange(e.target.value)}
            placeholder={textareaProps.placeholder}
            rows={textareaProps.rows || 3}
            className={cn(error && "border-red-500")}
            required={required}
          />
        );

      case 'custom':
        return children;

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-red-600")}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
