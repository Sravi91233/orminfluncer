'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ApiKey } from '@/types';
import { useEffect } from 'react';

const formSchema = z.object({
  serviceName: z.string().min(1, { message: 'Service name is required.' }),
  keyValue: z.string().min(10, { message: 'API Key must be at least 10 characters.' }),
});

interface ApiKeyFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: ApiKey | null;
  onCancel: () => void;
}

export function ApiKeyForm({ onSubmit, initialData, onCancel }: ApiKeyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: '',
      keyValue: '',
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        serviceName: initialData.serviceName,
        keyValue: initialData.keyValue,
      });
    } else {
       form.reset({
        serviceName: '',
        keyValue: '',
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Instagram, YouTube" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keyValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key or Token</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter the secret key or token" {...field} />
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
