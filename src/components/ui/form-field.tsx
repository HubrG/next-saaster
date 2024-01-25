import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

type Props = {
  form: { control: any };
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
};

export const Field = ({
  form,
  name,
  label,
  placeholder,
  description,
}: Props) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          <FormItem>
            <FormLabel>
              {label} <FormMessage />
            </FormLabel>
            <FormControl>
              <Input
                onKeyDown={(e) => e.preventDefault}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
          </FormItem>
        </>
      )}
    />
  );
};
