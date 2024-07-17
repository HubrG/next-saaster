import { cn } from "@/src/lib/utils";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";

type Props = {
  form: { control: any };
  name: string;
  label: string;
  setFile?: (file: File) => void;
  accept?: string;
  placeholder?: string;
  description?: string;
  displayLabel?: boolean;
  children?: React.ReactNode;
  inputRef?: any;
  className?: string;
  type?:
    | "text"
    | "email"
    | "file"
    | "password"
    | "textarea"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "select"
    | "checkbox"
    | "radio";
  selectOptions?: { value: string; label: string }[];
};
type Inputs = {
  file: File;
};
export const Field = ({
  form,
  name,
  label,
  setFile,
  selectOptions,
  inputRef,
  displayLabel = true,
  className,
  accept,
  children,
  placeholder,
  description,
  type = "text",
}: Props) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { ref, ...rest } = register("file");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          <FormItem className={className}>
            <FormLabel className={cn({ "!hidden": !displayLabel })}>
              {label}
            </FormLabel>
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  onKeyDown={(e) => {
                    e.preventDefault;
                  }}
                  className={className}
                  placeholder={placeholder}
                  {...field}
                />
              ) : type === "file" ? (
                <Input
                  {...rest}
                  ref={inputRef}
                  type={type}
                  placeholder={placeholder}
                  // For one file only
                  onChangeCapture={(e) => {
                    if (
                      setFile &&
                      e.target instanceof HTMLInputElement &&
                      e.target.files
                    ) {
                      setFile(e.target.files[0]);
                    }
                    field.onChange(e);
                  }}
                  accept={accept}
                  className={className}
                />
              ) : type === "select" ? (
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {selectOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={type}
                  onKeyDown={(e) => e.preventDefault}
                  className={className}
                  placeholder={placeholder}
                  {...field}
                />
              )}
            </FormControl>
            {children}
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};
