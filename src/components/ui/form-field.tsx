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
  placeholder?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  type?: "text" | "email" | "password" | "textarea";
};

export const Field = ({
  form,
  name,
  label,
  className,
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
          ) : (
            <FormItem>
              <FormLabel>
                {label} <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  type={type}
                  onKeyDown={(e) => e.preventDefault}
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
