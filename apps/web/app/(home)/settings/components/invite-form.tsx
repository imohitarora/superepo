"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/hooks/use-toast"

const inviteFormSchema = z.object({
  inviteEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "user"]),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

const defaultValues: Partial<InviteFormValues> = {
  inviteEmail: "",
  role: "user",
}

export function InviteForm() {
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: InviteFormValues) {
    try {
      // TODO: Implement API call to send invite
      // await sendInvite(data)
      toast({
        title: "Invite sent",
        description: "The invitation has been sent successfully.",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invite. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Invite User</h3>
          <FormField
            control={form.control}
            name="inviteEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Send invite</Button>
      </form>
    </Form>
  )
}
