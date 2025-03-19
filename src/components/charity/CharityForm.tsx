
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Charity } from '@/types/charity';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CharityFormProps {
  charity?: Charity | null;
  userId: string;
  onSaved: (charity: Charity) => void;
}

interface CharityFormValues {
  name: string;
  url: string;
  description: string;
  supporting_text?: string;
}

const CharityForm: React.FC<CharityFormProps> = ({ charity, userId, onSaved }) => {
  const form = useForm<CharityFormValues>({
    defaultValues: {
      name: charity?.name || '',
      url: charity?.url || '',
      description: charity?.description || '',
      supporting_text: charity?.supporting_text || ''
    }
  });
  
  const handleSubmit = async (values: CharityFormValues) => {
    try {
      if (charity) {
        // Update existing charity
        const { data, error } = await supabase
          .from('charities')
          .update({
            name: values.name,
            url: values.url,
            description: values.description,
            supporting_text: values.supporting_text || null
          })
          .eq('id', charity.id)
          .select()
          .single();
          
        if (error) throw error;
        toast.success('Charity information updated successfully');
        onSaved(data);
      } else {
        // Create new charity
        const { data, error } = await supabase
          .from('charities')
          .insert({
            owner_id: userId,
            name: values.name,
            url: values.url,
            description: values.description,
            supporting_text: values.supporting_text || null
          })
          .select()
          .single();
          
        if (error) throw error;
        toast.success('Charity information saved successfully');
        onSaved(data);
      }
    } catch (error) {
      console.error('Error saving charity:', error);
      toast.error('Failed to save charity information');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Charity Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of the charity" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.org/donate" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the charity" 
                      className="h-20 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="supporting_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Text (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about your support" 
                      className="h-20 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              {charity ? 'Update Charity' : 'Save Charity'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CharityForm;
