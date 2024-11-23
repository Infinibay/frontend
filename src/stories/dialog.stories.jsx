import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SizeProvider } from "@/components/ui/size-provider";

export default {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
  },
};

// Base template for all stories
const Template = ({ size = "md", ...args }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SizeProvider size={size}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter your name" className="mb-4" />
            <Input placeholder="Enter your email" type="email" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SizeProvider>
  );
};

// Default story
export const Default = Template.bind({});
Default.args = {
  size: "md",
};

// All sizes story
export const AllSizes = () => (
  <div className="flex gap-4">
    <SizeProvider size="sm">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Small Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>
              This is a small-sized dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Small input example" />
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SizeProvider>

    <SizeProvider size="md">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Medium Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medium Dialog</DialogTitle>
            <DialogDescription>
              This is a medium-sized dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Medium input example" />
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SizeProvider>

    <SizeProvider size="lg">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Large Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>
              This is a large-sized dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Large input example" />
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SizeProvider>

    <SizeProvider size="xl">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Extra Large Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extra Large Dialog</DialogTitle>
            <DialogDescription>
              This is an extra large-sized dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Extra large input example" />
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SizeProvider>
  </div>
);

// Complex form example
export const ComplexForm = () => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <SizeProvider size="md">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit Settings</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Update your account settings. This information will be displayed publicly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] rounded-md border border-input bg-transparent p-3 text-sm shadow-sm"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SizeProvider>
  );
};
