import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the card',
    },
  },
};

// Basic Card
export const Basic = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </>
    ),
    className: 'w-[350px]',
  },
};

// Card with Footer
export const WithFooter = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Create a new project with pre-configured settings and dependencies.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </>
    ),
    className: 'w-[350px]',
  },
};

// Notification Card
export const NotificationCard = {
  args: {
    children: (
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-500" />
            <div className="font-semibold">New Update Available</div>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Just now
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          A new software update is available for download.
        </div>
      </CardContent>
    ),
    className: 'w-[380px]',
  },
};

// Profile Card
export const ProfileCard = {
  args: {
    children: (
      <>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-muted" />
          </div>
          <CardTitle className="mt-4">John Doe</CardTitle>
          <CardDescription>Software Engineer</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Full-stack developer with a passion for building beautiful user interfaces
            and scalable backend systems.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" size="sm">Message</Button>
          <Button size="sm">Follow</Button>
        </CardFooter>
      </>
    ),
    className: 'w-[300px]',
  },
};

// Pricing Card
export const PricingCard = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle className="text-2xl">Pro Plan</CardTitle>
          <CardDescription>
            <span className="text-3xl font-bold">$29</span>
            <span className="text-muted-foreground">/month</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited Projects
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Priority Support
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Custom Domain
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Get Started</Button>
        </CardFooter>
      </>
    ),
    className: 'w-[300px]',
  },
};
