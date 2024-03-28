import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";

type Props = {
  form: { control: any };
  name: string;
  label: string;
  setFile?: (file: File) => void;
  accept?: string;
  placeholder?: string;
  description?: string;
  children?: React.ReactNode;
  inputRef?: any;
  className?: string;
  type?: "text" | "email" | "file" | "password" | "textarea";
};

export const Field = ({
  form,
  name,
  label,
  setFile,
  inputRef,
  className,
  accept,
  children,
  placeholder,
  description,
  type = "text",
}: Props) => {

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          {type === "textarea" ? (
            <FormItem>
              <FormLabel>
                {label} <FormMessage />
              </FormLabel>
              <FormControl>
                <Textarea
                  onKeyDown={(e) => {
                    e.preventDefault;
                  }}
                  className={className}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormDescription>{description}</FormDescription>
            </FormItem>
          ) : type === "file" ? (
            <FormItem>
              <FormLabel>
                {label} <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
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
                  {...form}
                />
              </FormControl>
              {children}
              <FormDescription>{description}</FormDescription>
            </FormItem>
          ) : (
            <FormItem className={className}>
              <FormLabel>
                {label} <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  type={type}
                  onKeyDown={(e) => e.preventDefault}
                  className={className}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              {children}
              <FormDescription>{description}</FormDescription>
            </FormItem>
          )}
        </>
      )}
    />
  );
};
