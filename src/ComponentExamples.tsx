"use client";

import { ArrowRight, ArrowUpRight, Code, Copy, CreditCard, LogOut, Pencil, Plus, Settings, Trash2, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { previewComponents } from "./catalog-previews";
import type { CatalogStyle } from "./catalog-data";
import { useThemeStore } from "./theme-store";
import { CodeLines } from "./CodeLines";
import css from "./Catalog.module.css";

type Kit = Pick<
  (typeof previewComponents)["obsidian"],
  "Button" | "ButtonGroup" | "Spinner" | "Card" | "CardHeader" | "CardContent" | "CardFooter" | "Input"
  | "Dialog" | "DialogTrigger" | "DialogClose" | "DialogContent" | "DialogHeader" | "DialogBody" | "DialogFooter"
  | "Tabs" | "TabsTrigger"
  | "DropdownMenu" | "DropdownMenuTrigger" | "DropdownMenuContent" | "DropdownMenuLabel" | "DropdownMenuItem"
  | "DropdownMenuSeparator" | "DropdownMenuShortcut" | "DropdownMenuSub" | "DropdownMenuSubTrigger" | "DropdownMenuSubContent"
  | "Select" | "SelectTrigger" | "SelectValue" | "SelectContent" | "SelectItem" | "SelectLabel" | "SelectSeparator"
>;

type Example = {
  id: string;
  title: string;
  description: ReactNode;
  code: string;
  render: (kit: Kit) => ReactNode;
  /** Limit the example to these style names. Omit to show it for every style. */
  styles?: string[];
};

const buttonExamples: Example[] = [
  {
    id: "size",
    title: "Size",
    description: <>Use the <code>size</code> prop to change the size of the button.</>,
    code: `import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

<Button size="small">Small</Button>
<Button size="icon-small" aria-label="Open">
  <ArrowUpRight />
</Button>

<Button size="medium">Medium</Button>

<Button size="default">Default</Button>
<Button size="icon" aria-label="Open">
  <ArrowUpRight />
</Button>

<Button size="large">Large</Button>
<Button size="icon-large" aria-label="Open">
  <ArrowUpRight />
</Button>`,
    render: ({ Button }) => (
      <>
        <div className={css.sizePair}>
          <Button size="small">Small</Button>
          <Button size="icon-small" aria-label="Open"><ArrowUpRight /></Button>
        </div>
        <div className={css.sizePair}>
          <Button size="medium">Medium</Button>
        </div>
        <div className={css.sizePair}>
          <Button size="default">Default</Button>
          <Button size="icon" aria-label="Open"><ArrowUpRight /></Button>
        </div>
        <div className={css.sizePair}>
          <Button size="large">Large</Button>
          <Button size="icon-large" aria-label="Open"><ArrowUpRight /></Button>
        </div>
      </>
    ),
  },
  {
    id: "default",
    title: "Default",
    description: "The default button for the primary action on a screen.",
    code: `import { Button } from "@/components/ui/button"

<Button>Button</Button>`,
    render: ({ Button }) => <Button>Button</Button>,
  },
  {
    id: "outline",
    title: "Outline",
    description: "Use the outline variant for secondary actions that still need emphasis.",
    code: `import { Button } from "@/components/ui/button"

<Button variant="outline">Outline</Button>`,
    render: ({ Button }) => <Button variant="outline">Outline</Button>,
  },
  {
    id: "secondary",
    title: "Secondary",
    description: "A quieter filled button for less important actions.",
    code: `import { Button } from "@/components/ui/button"

<Button variant="secondary">Secondary</Button>`,
    render: ({ Button }) => <Button variant="secondary">Secondary</Button>,
  },
  {
    id: "soft",
    title: "Soft",
    description: "A tinted accent button for highlighted but low-emphasis labels or actions.",
    code: `import { Button } from "@/components/ui/button"

<Button variant="soft">Popular</Button>`,
    render: ({ Button }) => <Button variant="soft">Popular</Button>,
    styles: ["obsidian", "studio"],
  },
  {
    id: "ghost",
    title: "Ghost",
    description: "For toolbars and dense UI where the button should not draw attention.",
    code: `import { Button } from "@/components/ui/button"

<Button variant="ghost">Ghost</Button>`,
    render: ({ Button }) => <Button variant="ghost">Ghost</Button>,
  },
  {
    id: "destructive",
    title: "Destructive",
    description: "Use for actions that delete or permanently change data.",
    code: `import { Button } from "@/components/ui/button"

<Button variant="destructive">Delete</Button>`,
    render: ({ Button }) => <Button variant="destructive">Delete</Button>,
  },
  {
    id: "link",
    title: "Link",
    description: "Looks like a text link but behaves like a button.",
    code: `import { Button } from "@/components/ui/button"

<Button variant="link">Link</Button>`,
    render: ({ Button }) => <Button variant="link">Link</Button>,
  },
  {
    id: "icon",
    title: "Icon",
    description: <>Use <code>size=&quot;icon&quot;</code> for an icon-only button. Always set an <code>aria-label</code>.</>,
    code: `import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

<Button size="icon" aria-label="Add">
  <Plus />
</Button>`,
    render: ({ Button }) => (
      <Button size="icon" aria-label="Add"><Plus size={16} /></Button>
    ),
  },
  {
    id: "with-icon",
    title: "With Icon",
    description: <>Add <code>data-icon=&quot;inline-start&quot;</code> or <code>data-icon=&quot;inline-end&quot;</code> to the icon for the correct spacing.</>,
    code: `import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"

<Button>
  <Plus data-icon="inline-start" />
  New Branch
</Button>
<Button>
  Fork
  <ArrowRight data-icon="inline-end" />
</Button>`,
    render: ({ Button }) => (
      <>
        <Button><Plus data-icon="inline-start" size={16} />New Branch</Button>
        <Button>Fork<ArrowRight data-icon="inline-end" size={16} /></Button>
      </>
    ),
  },
  {
    id: "spinner",
    title: "Spinner",
    description: <>Render a <code>&lt;Spinner /&gt;</code> inside the button to show a loading state. Add the <code>data-icon</code> attribute for the correct spacing.</>,
    code: `import { Button, Spinner } from "@/components/ui/button"

<Button disabled>
  <Spinner data-icon="inline-start" />
  Generating
</Button>
<Button variant="outline" disabled>
  Downloading
  <Spinner data-icon="inline-end" />
</Button>`,
    render: ({ Button, Spinner }) => (
      <>
        <Button disabled><Spinner data-icon="inline-start" />Generating</Button>
        <Button variant="outline" disabled>Downloading<Spinner data-icon="inline-end" /></Button>
      </>
    ),
  },
  {
    id: "button-group",
    title: "Button Group",
    description: <>Use <code>ButtonGroup</code> to join related buttons into one control.</>,
    code: `import { Button, ButtonGroup } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

<ButtonGroup>
  <Button variant="outline">Back</Button>
  <Button variant="outline">
    Next
    <ArrowRight data-icon="inline-end" />
  </Button>
</ButtonGroup>`,
    render: ({ Button, ButtonGroup }) => (
      <ButtonGroup>
        <Button variant="outline">Back</Button>
        <Button variant="outline">Next<ArrowRight data-icon="inline-end" size={16} /></Button>
      </ButtonGroup>
    ),
  },
];

const cardExamples: Example[] = [
  {
    id: "content",
    title: "Content",
    description: <>A card only needs <code>CardContent</code>. Add a header or footer when you need them.</>,
    code: `import { Card, CardContent } from "@/components/ui/card"

<Card>
  <CardContent>
    <p>Your storage is 80% full.</p>
  </CardContent>
</Card>`,
    render: ({ Card, CardContent }) => (
      <div className={css.exampleCard}>
        <Card>
          <CardContent><p>Your storage is 80% full.</p></CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "header-content",
    title: "Header and Content",
    description: <>Use a <code>&lt;h3&gt;</code> and a <code>&lt;p&gt;</code> inside <code>CardHeader</code> for the title and description.</>,
    code: `import { Card, CardContent, CardHeader } from "@/components/ui/card"

<Card>
  <CardHeader>
    <h3>Project overview</h3>
  </CardHeader>
  <CardContent>
    <small>Updated today</small>
  </CardContent>
</Card>`,
    render: ({ Card, CardHeader, CardContent }) => (
      <div className={css.exampleCard}>
        <Card>
          <CardHeader>
            <h3>Project overview</h3>
          </CardHeader>
          <CardContent><small>Updated today</small></CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "content-footer",
    title: "Content and Footer",
    description: <>Use <code>CardFooter</code> for actions. It lays out its children in a row.</>,
    code: `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardContent>
    <p>Your storage is 80% full.</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Dismiss</Button>
    <Button>Upgrade</Button>
  </CardFooter>
</Card>`,
    render: ({ Button, Card, CardContent, CardFooter }) => (
      <div className={css.exampleCard}>
        <Card>
          <CardContent><p>Your storage is 80% full.</p></CardContent>
          <CardFooter>
            <Button variant="outline">Dismiss</Button>
            <Button>Upgrade</Button>
          </CardFooter>
        </Card>
      </div>
    ),
  },
  {
    id: "header-content-footer",
    title: "Header, Content and Footer",
    description: <>Combine all three sections for a complete card.</>,
    code: `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

<Card>
  <CardHeader>
    <h3>Project overview</h3>
  </CardHeader>
  <CardContent>
    <small>Updated today</small>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>`,
    render: ({ Button, Card, CardHeader, CardContent, CardFooter }) => (
      <div className={css.exampleCard}>
        <Card>
          <CardHeader>
            <h3>Project overview</h3>
          </CardHeader>
          <CardContent><small>Updated today</small></CardContent>
          <CardFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    ),
  },
];

const inputExamples: Example[] = [
  {
    id: "default",
    title: "Default",
    description: <>Use <code>Input</code> inside a label to collect short text.</>,
    code: `import { Input } from "@/components/ui/input"

<label>
  Email address
  <Input type="email" placeholder="you@example.com" />
</label>`,
    render: ({ Input }) => (
      <label className={css.exampleInput}>
        Email address
        <Input type="email" placeholder="you@example.com" />
      </label>
    ),
  },
  {
    id: "disabled",
    title: "Disabled",
    description: <>Add the <code>disabled</code> attribute to block editing.</>,
    code: `import { Input } from "@/components/ui/input"

<label>
  Workspace ID
  <Input defaultValue="neonix-7f3a" disabled />
</label>`,
    render: ({ Input }) => (
      <label className={css.exampleInput}>
        Workspace ID
        <Input defaultValue="neonix-7f3a" disabled />
      </label>
    ),
  },
];

const dialogExamples: Example[] = [
  {
    id: "confirm",
    title: "Confirm",
    description: <>Wrap the parts in <code>Dialog</code>. <code>DialogTrigger</code> opens it, and <code>DialogClose</code> closes it. The close button in <code>DialogHeader</code> is added for you.</>,
    code: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button variant="outline">Delete project</Button>} />
  <DialogContent>
    <DialogHeader><h2>Delete project?</h2></DialogHeader>
    <DialogBody>
      <p>This action cannot be undone. All files in this project will be removed.</p>
    </DialogBody>
    <DialogFooter>
      <DialogClose render={<Button size="medium" variant="outline">Cancel</Button>} />
      <DialogClose render={<Button size="medium" variant="destructive">Delete</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    render: ({ Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogBody, DialogFooter, Button }) => (
      <Dialog>
        <DialogTrigger render={<Button variant="outline">Delete project</Button>} />
        <DialogContent>
          <DialogHeader><h2>Delete project?</h2></DialogHeader>
          <DialogBody>
            <p>This action cannot be undone. All files in this project will be removed.</p>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button size="medium" variant="outline">Cancel</Button>} />
            <DialogClose render={<Button size="medium" variant="destructive">Delete</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "form",
    title: "Form",
    description: <>Put an <code>Input</code> in <code>DialogBody</code> to collect data before saving.</>,
    code: `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button>Edit profile</Button>} />
  <DialogContent>
    <DialogHeader><h2>Edit profile</h2></DialogHeader>
    <DialogBody>
      <label>
        Display name
        <Input defaultValue="Neonix" />
      </label>
    </DialogBody>
    <DialogFooter>
      <DialogClose render={<Button size="medium" variant="outline">Cancel</Button>} />
      <DialogClose render={<Button size="medium">Save</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    render: ({ Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogBody, DialogFooter, Button, Input }) => (
      <Dialog>
        <DialogTrigger render={<Button>Edit profile</Button>} />
        <DialogContent>
          <DialogHeader><h2>Edit profile</h2></DialogHeader>
          <DialogBody>
            <label className={css.exampleInput}>
              Display name
              <Input defaultValue="Neonix" />
            </label>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button size="medium" variant="outline">Cancel</Button>} />
            <DialogClose render={<Button size="medium">Save</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "close-button",
    title: "Close Button",
    description: <>Set <code>showCloseButton</code> on <code>DialogHeader</code> to show or hide the X button. It is shown by default.</>,
    code: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button variant="outline">With close button</Button>} />
  <DialogContent>
    <DialogHeader showCloseButton={true}><h2>Notifications</h2></DialogHeader>
    <DialogBody><p>You have 3 unread messages.</p></DialogBody>
  </DialogContent>
</Dialog>

<Dialog>
  <DialogTrigger render={<Button variant="outline">Without close button</Button>} />
  <DialogContent>
    <DialogHeader showCloseButton={false}><h2>Notifications</h2></DialogHeader>
    <DialogBody><p>You have 3 unread messages.</p></DialogBody>
    <DialogFooter>
      <DialogClose render={<Button size="medium">Got it</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    render: ({ Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogBody, DialogFooter, Button }) => (
      <>
        <Dialog>
          <DialogTrigger render={<Button variant="outline">With close button</Button>} />
          <DialogContent>
            <DialogHeader showCloseButton={true}><h2>Notifications</h2></DialogHeader>
            <DialogBody><p>You have 3 unread messages.</p></DialogBody>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Without close button</Button>} />
          <DialogContent>
            <DialogHeader showCloseButton={false}><h2>Notifications</h2></DialogHeader>
            <DialogBody><p>You have 3 unread messages.</p></DialogBody>
            <DialogFooter>
              <DialogClose render={<Button size="medium">Got it</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    ),
  },
];

const tabsExamples: Example[] = [
  {
    id: "default",
    title: "Default",
    description: <>Use <code>Tabs</code> with <code>TabsTrigger</code> items. Set <code>defaultValue</code> for an uncontrolled group, or pass <code>value</code> and <code>onValueChange</code> to control it.</>,
    code: `import { Tabs, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="annually">
  <TabsTrigger value="monthly">Monthly</TabsTrigger>
  <TabsTrigger value="annually">Annually</TabsTrigger>
</Tabs>`,
    render: ({ Tabs, TabsTrigger }) => (
      <Tabs defaultValue="annually">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="annually">Annually</TabsTrigger>
      </Tabs>
    ),
  },
  {
    id: "disabled",
    title: "Disabled",
    description: <>Add <code>disabled</code> to a <code>TabsTrigger</code> to block that option. Arrow keys skip it.</>,
    code: `import { Tabs, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="monthly">
  <TabsTrigger value="monthly">Monthly</TabsTrigger>
  <TabsTrigger value="annually">Annually</TabsTrigger>
  <TabsTrigger value="enterprise" disabled>Enterprise</TabsTrigger>
</Tabs>`,
    render: ({ Tabs, TabsTrigger }) => (
      <Tabs defaultValue="monthly">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="annually">Annually</TabsTrigger>
        <TabsTrigger value="enterprise" disabled>Enterprise</TabsTrigger>
      </Tabs>
    ),
  },
  {
    id: "line",
    title: "Line",
    description: <>Use the <code>variant=&quot;line&quot;</code> prop on <code>Tabs</code> for a line style.</>,
    code: `import { Tabs, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview" variant="line">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="analytics">Analytics</TabsTrigger>
  <TabsTrigger value="reports">Reports</TabsTrigger>
</Tabs>`,
    render: ({ Tabs, TabsTrigger }) => (
      <Tabs defaultValue="overview" variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </Tabs>
    ),
  },
];

const dropdownMenuExamples: Example[] = [
  {
    id: "basic",
    title: "Basic",
    description: <>Open a menu from any button with <code>DropdownMenuTrigger</code>. Use <code>DropdownMenuLabel</code> and <code>DropdownMenuSeparator</code> to group items.</>,
    code: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    render: ({ Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "submenu",
    title: "Submenu",
    description: <>Wrap a <code>DropdownMenuSubTrigger</code> and a <code>DropdownMenuSubContent</code> in <code>DropdownMenuSub</code>. It opens on hover or with the right arrow key.</>,
    code: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
  <DropdownMenuContent>
    <DropdownMenuItem>New Tab</DropdownMenuItem>
    <DropdownMenuItem>New Window</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Email link</DropdownMenuItem>
        <DropdownMenuItem>Messages</DropdownMenuItem>
        <DropdownMenuItem>Notes</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Print</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    render: ({ Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>New Tab</DropdownMenuItem>
          <DropdownMenuItem>New Window</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email link</DropdownMenuItem>
              <DropdownMenuItem>Messages</DropdownMenuItem>
              <DropdownMenuItem>Notes</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Print</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "shortcuts",
    title: "Shortcuts",
    description: <>Add <code>DropdownMenuShortcut</code> inside an item to show its keyboard shortcut on the right.</>,
    code: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
  <DropdownMenuContent>
    <DropdownMenuItem>
      New File
      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Open
      <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Save
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Quit
      <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    render: ({ Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>New File<DropdownMenuShortcut>⌘N</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Open<DropdownMenuShortcut>⌘O</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Save<DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Quit<DropdownMenuShortcut>⌘Q</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "icons",
    title: "Icons",
    description: <>Put an icon before the label. Icons are sized and colored for you.</>,
    code: `import { CreditCard, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
  <DropdownMenuContent>
    <DropdownMenuItem><User /> Profile</DropdownMenuItem>
    <DropdownMenuItem><CreditCard /> Billing</DropdownMenuItem>
    <DropdownMenuItem><Settings /> Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem><LogOut /> Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    render: ({ Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem><User /> Profile</DropdownMenuItem>
          <DropdownMenuItem><CreditCard /> Billing</DropdownMenuItem>
          <DropdownMenuItem><Settings /> Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem><LogOut /> Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "destructive",
    title: "Destructive",
    description: <>Use <code>variant=&quot;destructive&quot;</code> on an item for actions that delete or permanently change data.</>,
    code: `import { Copy, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
  <DropdownMenuContent>
    <DropdownMenuItem><Pencil /> Edit</DropdownMenuItem>
    <DropdownMenuItem><Copy /> Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive"><Trash2 /> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    render: ({ Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem><Pencil /> Edit</DropdownMenuItem>
          <DropdownMenuItem><Copy /> Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"><Trash2 /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const countries = [
  "Argentina", "Australia", "Brazil", "Canada", "China", "Denmark",
  "Egypt", "France", "Germany", "India", "Japan", "Kenya",
  "Mexico", "Norway", "Poland", "Vietnam",
];

const selectExamples: Example[] = [
  {
    id: "default",
    title: "Default",
    description: <>Use <code>SelectTrigger</code> with a <code>SelectValue</code> for the placeholder, then list the <code>SelectItem</code> options in <code>SelectContent</code>.</>,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select defaultValue="pro">
  <SelectTrigger>
    <SelectValue placeholder="Select a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="starter">Starter</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
    <SelectItem value="enterprise">Enterprise</SelectItem>
  </SelectContent>
</Select>`,
    render: ({ Select, SelectTrigger, SelectValue, SelectContent, SelectItem }) => (
      <Select defaultValue="pro">
        <SelectTrigger>
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "groups",
    title: "Groups",
    description: <>Use <code>SelectLabel</code> as a heading and <code>SelectSeparator</code> to divide the options into groups.</>,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a food" />
  </SelectTrigger>
  <SelectContent>
    <SelectLabel>Fruits</SelectLabel>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectSeparator />
    <SelectLabel>Vegetables</SelectLabel>
    <SelectItem value="carrot">Carrot</SelectItem>
    <SelectItem value="spinach">Spinach</SelectItem>
  </SelectContent>
</Select>`,
    render: ({ Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator }) => (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a food" />
        </SelectTrigger>
        <SelectContent>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectSeparator />
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="spinach">Spinach</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "disabled",
    title: "Disabled",
    description: <>Add <code>disabled</code> to a <code>SelectItem</code> to block that option. Arrow keys skip it.</>,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select defaultValue="starter">
  <SelectTrigger>
    <SelectValue placeholder="Select a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="starter">Starter</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
    <SelectItem value="enterprise" disabled>Enterprise (contact sales)</SelectItem>
  </SelectContent>
</Select>`,
    render: ({ Select, SelectTrigger, SelectValue, SelectContent, SelectItem }) => (
      <Select defaultValue="starter">
        <SelectTrigger>
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise" disabled>Enterprise (contact sales)</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "scrolling",
    title: "Scrolling",
    description: <>A long list scrolls inside <code>SelectContent</code>. Use the mouse wheel or the arrow keys, and the focused item scrolls into view.</>,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const countries = [
  "Argentina", "Australia", "Brazil", "Canada", "China", "Denmark",
  "Egypt", "France", "Germany", "India", "Japan", "Kenya",
  "Mexico", "Norway", "Poland", "Vietnam",
]

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a country" />
  </SelectTrigger>
  <SelectContent>
    {countries.map((country) => (
      <SelectItem key={country} value={country}>{country}</SelectItem>
    ))}
  </SelectContent>
</Select>`,
    render: ({ Select, SelectTrigger, SelectValue, SelectContent, SelectItem }) => (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>{country}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
];

const exampleSets: Record<string, Example[]> = {
  button: buttonExamples,
  card: cardExamples,
  input: inputExamples,
  dialog: dialogExamples,
  tabs: tabsExamples,
  "dropdown-menu": dropdownMenuExamples,
  select: selectExamples,
};


export function ComponentExamples({ style, page }: { style: CatalogStyle; page: string }) {
  const mode = useThemeStore((state) => state.mode);
  const kit = previewComponents[style.name as keyof typeof previewComponents] as Kit;
  const examples = (exampleSets[page] ?? []).filter((example) => !example.styles || example.styles.includes(style.name));

  return (
    <div className={css.docs} data-neo-style={style.name} data-theme={mode}>
      {examples.map((example) => (
        <ExampleBlock key={example.id} example={example} kit={kit} />
      ))}
    </div>
  );
}

function ExampleBlock({ example, kit }: { example: Example; kit: Kit }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className={css.example} id={example.id} aria-labelledby={`${example.id}-title`}>
      <h2 id={`${example.id}-title`}>{example.title}</h2>
      <p>{example.description}</p>
      <div className={css.exampleFrame}>
        <div className={css.exampleStage}>{example.render(kit)}</div>
        <div className={css.codeBar}>
          <button
            type="button"
            className={css.viewCode}
            aria-expanded={showCode}
            onClick={() => setShowCode((open) => !open)}
          >
            <Code size={14} />
            {showCode ? "Hide Code" : "View Code"}
          </button>
        </div>
        {showCode && (
          <pre className={css.codeBlock} tabIndex={0} aria-label={`${example.title} code`}>
            <code><CodeLines code={example.code} lang="tsx" /></code>
          </pre>
        )}
      </div>
    </section>
  );
}
