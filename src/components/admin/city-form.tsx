'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppCity } from '@/types';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'City name is required.' }),
  state: z.string().min(1, { message: 'State name is required.' }),
});

interface CityFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: AppCity | null;
  onCancel: () => void;
}

export function CityForm({ onSubmit, initialData, onCancel }: CityFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      state: '',
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        state: initialData.state,
      });
    } else {
       form.reset({
        name: '',
        state: '',
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
