"use client";

import { ArrowRight, ArrowUpRight, Code, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { previewComponents } from "./catalog-previews";
import type { CatalogStyle } from "./catalog-data";
import { useThemeStore } from "./theme-store";
import { CodeLines } from "./CodeLines";
import css from "./Catalog.module.css";

type Kit = Pick<
  (typeof previewComponents)["obsidian"],
  "Button" | "ButtonGroup" | "Spinner" | "Card" | "CardHeader" | "CardContent" | "CardFooter" | "Input"
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
    styles: ["obsidian"],
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

const exampleSets: Record<string, Example[]> = {
  button: buttonExamples,
  card: cardExamples,
  input: inputExamples,
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
