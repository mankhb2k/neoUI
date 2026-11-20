"use client";

import { useState, type ReactNode } from "react";
import { Button as RegistryButton } from "../registry/components/button";
import { Card as RegistryCard, CardDescription, CardHeader, CardTitle } from "../registry/components/card";
import {
  Activity, ArrowDownRight, ArrowRight, Bell, Check, ChevronDown, ChevronRight,
  CircleHelp, Code2, Command, Copy, CreditCard, Ellipsis, FileText, Filter, Home,
  Layers, LayoutDashboard, LifeBuoy, LogOut, Menu, Moon, MoreHorizontal,
  Plus, Search, Settings, ShieldCheck, Sparkles, Star, Sun, User, Users,
  X, Zap, BarChart3, CalendarDays, CheckCircle2, Clock3, Download, ExternalLink
} from "lucide-react";
import styles from "./App.module.css";
import codeStyles from "./CodeCatalog.module.css";

const installableComponents = [
  {
    name: "button",
    title: "Button",
    description: "Five visual variants and three sizes. No styling library required.",
    code: `import type { ButtonHTMLAttributes, CSSProperties } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "#16aee9", borderColor: "#2dc2fa", color: "#04131b" },
  secondary: { background: "#252a30", borderColor: "#383f47", color: "#e9edf1" },
  outline: { background: "transparent", borderColor: "#3a4149", color: "#d7dde3" },
  ghost: { background: "transparent", borderColor: "transparent", color: "#a7b0ba" },
  danger: { background: "#321d20", borderColor: "#633238", color: "#ff9ba2" },
};

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "7px 10px", fontSize: 12 },
  md: { padding: "10px 14px", fontSize: 13 },
  lg: { padding: "13px 18px", fontSize: 14 },
};

export function Button({ variant = "primary", size = "md", style, ...props }: ButtonProps) {
  return <button {...props} style={{ ...variants[variant], ...sizes[size], alignItems: "center", border: "1px solid", borderRadius: 8, cursor: "pointer", display: "inline-flex", fontFamily: "inherit", fontWeight: 600, justifyContent: "center", lineHeight: 1.2, ...style }} />;
}`,
  },
  {
    name: "card",
    title: "Card",
    description: "Composable surface with header, title, description, and content slots.",
    code: `import type { HTMLAttributes } from "react";

const baseStyle = {
  background: "linear-gradient(145deg, #1a1e22, #15181b)",
  border: "1px solid #343a41",
  borderRadius: 12,
  color: "#f2f4f6",
  padding: 20,
} as const;

export function Card({ style, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} style={{ ...baseStyle, ...style }} />;
}

export function CardHeader({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} style={{ marginBottom: 12, ...style }} />;
}

export function CardTitle({ style, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} style={{ fontSize: 16, fontWeight: 600, margin: 0, ...style }} />;
}

export function CardDescription({ style, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} style={{ color: "#929ba5", fontSize: 13, lineHeight: 1.6, margin: "6px 0 0", ...style }} />;
}

export function CardContent({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} style={style} />;
}`,
  },
];

type Section = { id: string; label: string; icon: React.ReactNode };
const sections: Section[] = [
  { id: "component-code", label: "Copy-ready code", icon: <Code2 size={16}/> },
  { id: "buttons", label: "Buttons", icon: <Command size={16}/> },
  { id: "cards", label: "Cards & surfaces", icon: <Layers size={16}/> },
  { id: "forms", label: "Form controls", icon: <SlidersIcon/> },
  { id: "navigation", label: "Navigation", icon: <Menu size={16}/> },
  { id: "overlays", label: "Overlays", icon: <Bell size={16}/> },
  { id: "data", label: "Data display", icon: <BarChart3 size={16}/> },
  { id: "feedback", label: "Feedback", icon: <Activity size={16}/> },
  { id: "effects", label: "Effects & tokens", icon: <Sparkles size={16}/> }
];
function SlidersIcon(){ return <Filter size={16}/> }

function App() {
  const [active, setActive] = useState("buttons");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [tab, setTab] = useState("Overview");
  const [billing, setBilling] = useState("Yearly");
  const [accordion, setAccordion] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = sections.filter(s => s.label.toLowerCase().includes(search.toLowerCase()));
  const go = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const notify = () => { setToast(true); window.setTimeout(() => setToast(false), 2800); };
  const copyToken = () => { navigator.clipboard?.writeText("#0A0B0D"); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  const copyComponent = async (name: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedComponent(name);
      window.setTimeout(() => setCopiedComponent(null), 1800);
    } catch {
      notify();
    }
  };

  return <div className={styles.app}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}><div className={styles.brandMark}><Sparkles size={18}/></div><span>NEONIX</span><span className={styles.brandTag}>UI LAB</span></div>
      <div className={styles.workspace}><div className={styles.workspaceAvatar}>N</div><div><strong>Neonix Studio</strong><small>Design workspace</small></div><ChevronDown size={15}/></div>
      <div className={styles.sideLabel}>LIBRARY</div>
      <nav className={styles.sideNav}>
        {sections.map(s => <button key={s.id} className={`${styles.navItem} ${active===s.id?styles.navActive:""}`} onClick={()=>go(s.id)}>{s.icon}<span>{s.label}</span>{active===s.id&&<span className={styles.navDot}/>}</button>)}
      </nav>
      <div className={styles.sideBottom}>
        <div className={styles.helpCard}><div className={styles.helpIcon}><LifeBuoy size={17}/></div><strong>Need a hand?</strong><p>Explore the component docs and usage notes.</p><button onClick={()=>notify()}>Open documentation <ArrowUpRightIcon/></button></div>
        <div className={styles.profile}><div className={styles.profileAvatar}>MT</div><div><strong>Workspace owner</strong><small>Free workspace</small></div><MoreHorizontal size={17}/></div>
      </div>
    </aside>

    <main className={styles.main}>
      <header className={styles.topbar}>
        <div className={styles.breadcrumb}><span>Library</span><ChevronRight size={14}/><strong>Components</strong></div>
        <div className={styles.topActions}><div className={styles.searchBox}><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search components..." /><kbd>⌘ K</kbd></div><button className={styles.iconButton} aria-label="Notifications" onClick={notify}><Bell size={17}/><i/></button><div className={styles.topAvatar}>M</div></div>
      </header>

      <div className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroEyebrow}><span className={styles.liveDot}/> REACT COMPONENT REGISTRY</div>
          <div className={styles.heroRow}><div><h1>Quietly powerful.<br/><em>Precisely crafted.</em></h1><p>A considered collection of dark, minimal interface components — built for modern products and made to adapt.</p></div><div className={styles.heroActions}><button className={styles.buttonPrimary} onClick={()=>go("buttons")}>Explore components <ArrowRight size={16}/></button><button className={styles.buttonGhost} onClick={copyToken}><Copy size={15}/>{copied?"Copied token":"Copy base color"}</button></div></div>
          <div className={styles.heroMeta}><span><span className={styles.metaBullet}/> 8 COMPONENT CATEGORIES</span><span>REACT + NEXT.JS</span><span>CLI READY</span></div>
        </section>

        <div className={styles.notice}><div className={styles.noticeIcon}><Sparkles size={17}/></div><div><strong>One visual language, many building blocks.</strong><p>Each example is intentionally restrained: soft borders, layered charcoal surfaces, subtle glass and a single cyan accent.</p></div><button onClick={()=>setModal(true)} className={styles.noticeAction}>View design principles <ArrowRight size={15}/></button></div>

        <section id="component-code" className={styles.section}>
          <SectionHead index="00" title="Copy-ready components" desc="Preview each component, inspect its TSX, and copy the source into your project."/>
          <div className={codeStyles.grid}>
            {installableComponents.map((component) => (
              <article className={codeStyles.card} key={component.name}>
                <div className={codeStyles.cardHeader}>
                  <div><span className={codeStyles.fileName}>{component.name}.tsx</span><p>{component.description}</p></div>
                  <button className={codeStyles.copyButton} onClick={() => copyComponent(component.name, component.code)}>
                    {copiedComponent === component.name ? <Check size={14}/> : <Copy size={14}/>}
                    {copiedComponent === component.name ? "Copied" : "Copy code"}
                  </button>
                </div>
                <div className={codeStyles.preview}>
                  {component.name === "button" ? <div className={codeStyles.buttonPreview}><RegistryButton>Get started <ArrowRight size={14}/></RegistryButton><RegistryButton variant="secondary">Secondary</RegistryButton><RegistryButton variant="outline">Outline</RegistryButton><RegistryButton variant="danger">Delete</RegistryButton></div> : <RegistryCard><CardHeader><CardTitle>Workspace overview</CardTitle><CardDescription>A reusable surface for your next project.</CardDescription></CardHeader><span className={codeStyles.cardMeta}>Updated just now</span></RegistryCard>}
                </div>
                <details className={codeStyles.source}>
                  <summary><span>View source</span><code>TSX</code><ChevronDown size={14}/></summary>
                  <pre><code>{component.code}</code></pre>
                </details>
              </article>
            ))}
          </div>
        </section>

        {filtered.length===0 && <div className={styles.emptySearch}>No matching section. Try “buttons”, “cards” or “forms”.</div>}

        <section id="buttons" className={styles.section}>
          <SectionHead index="01" title="Buttons" desc="Clear actions, carefully weighted hierarchy."/>
          <div className={styles.gridTwo}>
            <Showcase title="Button variants" note="Primary, secondary, subtle and destructive.">
              <div className={styles.demoRow}><button className={styles.buttonPrimary}>Get started <ArrowRight size={15}/></button><button className={styles.buttonSecondary}>Secondary</button><button className={styles.buttonOutline}>Outline</button><button className={styles.buttonGhost}>Ghost</button></div>
              <div className={styles.demoRow}><button className={styles.buttonDanger}>Delete project</button><button className={styles.buttonLink}>Learn more <ExternalLink size={13}/></button></div>
            </Showcase>
            <Showcase title="Sizes & icon buttons" note="Compact controls for dense toolbars and navigation.">
              <div className={styles.demoRow}><button className={`${styles.buttonPrimary} ${styles.small}`}>Small</button><button className={styles.buttonPrimary}>Default</button><button className={`${styles.buttonPrimary} ${styles.large}`}>Large</button></div>
              <div className={styles.demoRow}><button className={styles.iconButton}><Plus size={16}/></button><button className={styles.iconButton}><Search size={16}/></button><button className={styles.iconButton}><Settings size={16}/></button><button className={styles.iconButton}><Ellipsis size={16}/></button><button className={styles.buttonPrimary} onClick={notify}><Zap size={15}/> Run action</button></div>
            </Showcase>
          </div>
        </section>

        <section id="cards" className={styles.section}>
          <SectionHead index="02" title="Cards & surfaces" desc="Layered containers, from quiet surfaces to elevated glass."/>
          <div className={styles.gridThree}>
            <Showcase title="Surface card"><div className={styles.surfaceCard}><div className={styles.cardIcon}><Layers size={18}/></div><h3>Workspace overview</h3><p>A neutral surface for grouping related information.</p><div className={styles.cardFoot}><span>Updated just now</span><ArrowUpRightIcon/></div></div></Showcase>
            <Showcase title="Glass card"><div className={styles.glassCard}><div className={styles.glassOrb}/><div className={styles.cardIcon}><Sparkles size={18}/></div><h3>Make it remarkable.</h3><p>Translucent layers with restrained blur and soft highlights.</p><span className={styles.glassTag}>GLASS SURFACE</span></div></Showcase>
            <Showcase title="Metric card"><div className={styles.metricCard}><div className={styles.metricTop}><span>Monthly revenue</span><span className={styles.metricIcon}><BarChart3 size={16}/></span></div><strong>$24,680</strong><div className={styles.metricBottom}><span className={styles.positive}><ArrowDownRight size={14}/> 12.8%</span><span>vs last month</span></div><MiniBars/></div></Showcase>
          </div>
          <div className={styles.gridTwo}>
            <Showcase title="Profile card"><div className={styles.profileCard}><div className={styles.personAvatar}>JD</div><div className={styles.personInfo}><strong>Jordan Davis</strong><span>Product designer</span><div className={styles.personMeta}><span><MapPinIcon/> Remote</span><span><Clock3 size={12}/> Available</span></div></div><button className={styles.buttonOutline}>View profile</button></div></Showcase>
            <Showcase title="Plan card"><div className={styles.planCard}><div className={styles.planHeader}><div><span className={styles.planLabel}>PRO PLAN</span><h3>For growing teams</h3></div><span className={styles.popular}>POPULAR</span></div><div className={styles.price}>$24 <small>/ month</small></div><p>Everything you need to move faster.</p><div className={styles.planFeatures}><span><Check size={14}/> Unlimited projects</span><span><Check size={14}/> Team collaboration</span><span><Check size={14}/> Priority support</span></div><button className={styles.buttonPrimary} onClick={notify}>Choose this plan <ArrowRight size={15}/></button></div></Showcase>
          </div>
        </section>

        <section id="forms" className={styles.section}>
          <SectionHead index="03" title="Form controls" desc="Inputs designed to feel calm, legible and responsive."/>
          <div className={styles.gridTwo}>
            <Showcase title="Text fields" note="Default, focused, search and helper states.">
              <label className={styles.fieldLabel}>Full name<input className={styles.input} placeholder="e.g. Alex Morgan"/></label>
              <label className={styles.fieldLabel}>Email address<div className={styles.inputIcon}><input className={styles.input} placeholder="alex@company.com"/><User size={16}/></div><small>We’ll never share your email.</small></label>
              <label className={styles.fieldLabel}>Search<div className={styles.inputIcon}><Search size={16}/><input className={styles.input} placeholder="Search anything..."/></div></label>
            </Showcase>
            <Showcase title="Selection controls">
              <label className={styles.fieldLabel}>Workspace type<select className={styles.input}><option>Personal workspace</option><option>Team workspace</option><option>Enterprise</option></select></label>
              <label className={styles.checkRow}><input type="checkbox" defaultChecked/> <span><b>Product updates</b><small>Receive occasional product news.</small></span></label>
              <label className={styles.checkRow}><input type="checkbox"/> <span><b>Usage analytics</b><small>Help us improve the experience.</small></span></label>
              <div className={styles.switchRow}><span><b>Dark appearance</b><small>Use the dark interface.</small></span><button className={`${styles.switch} ${toggle?styles.switchOn:""}`} onClick={()=>setToggle(!toggle)} aria-label="Toggle dark appearance"><i/></button></div>
              <label className={styles.fieldLabel}>Volume <input className={styles.range} type="range" defaultValue="68"/></label>
            </Showcase>
          </div>
        </section>

        <section id="navigation" className={styles.section}>
          <SectionHead index="04" title="Navigation" desc="Simple ways to move through complex products."/>
          <div className={styles.gridTwo}>
            <Showcase title="Tabs" note="Switch between related views.">
              <div className={styles.tabs}>{["Overview","Activity","Settings"].map(t=><button key={t} onClick={()=>setTab(t)} className={tab===t?styles.tabActive:""}>{t}{t==="Activity"&&<span className={styles.tabCount}>4</span>}</button>)}</div>
              <div className={styles.tabPanel}><strong>{tab}</strong><p>{tab==="Overview"?"A concise summary of your workspace and recent performance.":tab==="Activity"?"Recent actions and updates from your team.":"Manage preferences, access and workspace details."}</p></div>
            </Showcase>
            <Showcase title="Breadcrumb & menu">
              <div className={styles.breadcrumbDemo}><span>Workspace</span><ChevronRight size={14}/><span>Projects</span><ChevronRight size={14}/><strong>Website redesign</strong></div>
              <div className={styles.menuWrap}><button className={styles.buttonSecondary} onClick={()=>setMenuOpen(!menuOpen)}>Open menu <ChevronDown size={14}/></button>{menuOpen&&<div className={styles.dropdown}><button><User size={14}/> Profile</button><button><Settings size={14}/> Settings</button><button><CreditCard size={14}/> Billing</button><div/><button className={styles.dropdownDanger}><LogOut size={14}/> Sign out</button></div>}</div>
            </Showcase>
          </div>
        </section>

        <section id="overlays" className={styles.section}>
          <SectionHead index="05" title="Overlays" desc="Contextual layers that keep the current task in focus."/>
          <div className={styles.gridThree}>
            <Showcase title="Dialog"><div className={styles.miniDialog}><div className={styles.dialogTop}><strong>Delete workspace?</strong><X size={15}/></div><p>This action cannot be undone. All workspace data will be permanently removed.</p><div className={styles.dialogActions}><button className={styles.buttonSecondary}>Cancel</button><button className={styles.buttonDanger}>Delete</button></div></div><button className={styles.textAction} onClick={()=>setModal(true)}>Open interactive dialog <ArrowRight size={14}/></button></Showcase>
            <Showcase title="Popover"><div className={styles.popoverDemo}><div className={styles.popoverBubble}><strong>Quick tip</strong><p>You can invite teammates from workspace settings.</p><span>Got it <ArrowRight size={12}/></span></div><button className={styles.buttonOutline}>What’s this? <CircleHelp size={14}/></button></div></Showcase>
            <Showcase title="Context menu"><div className={styles.contextMenu}><button><Copy size={14}/> Copy link <kbd>⌘ C</kbd></button><button><FileText size={14}/> Duplicate</button><button><Download size={14}/> Download</button><div/><button className={styles.dropdownDanger}><X size={14}/> Remove</button></div></Showcase>
          </div>
        </section>

        <section id="data" className={styles.section}>
          <SectionHead index="06" title="Data display" desc="Useful information, presented with a clear visual hierarchy."/>
          <div className={styles.gridTwo}>
            <Showcase title="Activity table">
              <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>MEMBER</th><th>STATUS</th><th>DATE</th><th/></tr></thead><tbody><tr><td><span className={styles.tablePerson}><i>JD</i> Jordan Davis</span></td><td><span className={styles.status}><i/> Active</span></td><td>Today</td><td><MoreHorizontal size={16}/></td></tr><tr><td><span className={styles.tablePerson}><i>AK</i> Avery Kim</span></td><td><span className={styles.statusPending}>Pending</span></td><td>Yesterday</td><td><MoreHorizontal size={16}/></td></tr><tr><td><span className={styles.tablePerson}><i>ML</i> Morgan Lee</span></td><td><span className={styles.status}><i/> Active</span></td><td>Oct 18</td><td><MoreHorizontal size={16}/></td></tr></tbody></table></div>
            </Showcase>
            <Showcase title="Progress & badges">
              <div className={styles.progressHeader}><span>Storage used</span><strong>68%</strong></div><div className={styles.progress}><i/></div><div className={styles.progressMeta}><span>68 GB of 100 GB</span><span>32 GB remaining</span></div>
              <div className={styles.badgeRow}><span className={styles.badgeBlue}>Popular</span><span className={styles.badgeGreen}>Active</span><span className={styles.badgeAmber}>Pending</span><span className={styles.badgeNeutral}>Draft</span></div>
              <div className={styles.avatarStack}><i>JD</i><i>AK</i><i>ML</i><i>+4</i><span>7 team members</span></div>
            </Showcase>
          </div>
        </section>

        <section id="feedback" className={styles.section}>
          <SectionHead index="07" title="Feedback" desc="Small signals that keep users informed and confident."/>
          <div className={styles.gridThree}>
            <Showcase title="Alert"><div className={styles.alert}><ShieldCheck size={17}/><div><strong>All systems operational</strong><p>Your workspace is running normally.</p></div></div></Showcase>
            <Showcase title="Toast notification"><div className={styles.toastPreview}><CheckCircle2 size={18}/><div><strong>Changes saved</strong><p>Your updates are now live.</p></div><X size={14}/></div><button className={styles.textAction} onClick={notify}>Show toast notification <ArrowRight size={14}/></button></Showcase>
            <Showcase title="Accordion"><div className={styles.accordion}>{["Can I change my plan later?","Where can I manage members?","How does billing work?"].map((q,i)=><div key={q}><button onClick={()=>setAccordion(accordion===i?-1:i)}>{q}<ChevronDown size={15}/></button>{accordion===i&&<p>Yes. You can manage this at any time from your workspace settings.</p>}</div>)}</div></Showcase>
          </div>
        </section>

        <section id="effects" className={styles.section}>
          <SectionHead index="08" title="Effects & design tokens" desc="The visual foundations behind the entire component collection."/>
          <Showcase title="Color palette" note="Core surfaces, text hierarchy and the cyan accent.">
            <div className={styles.swatches}>{[["Canvas","#090A0C"],["Surface 1","#111316"],["Surface 2","#191C20"],["Surface 3","#24282D"],["Border","#343A42"],["Muted","#9299A3"],["Text","#F3F5F7"],["Accent","#20B8F4"]].map(([n,c])=><button key={n} onClick={()=>{navigator.clipboard?.writeText(c);notify()}}><i style={{background:c}}/><span>{n}</span><code>{c}</code></button>)}</div>
          </Showcase>
          <div className={styles.gridTwo}>
            <Showcase title="Surface depth"><div className={styles.depthSamples}><div>01 · FLAT SURFACE</div><div>02 · SOFT BORDER</div><div>03 · ELEVATED</div><div>04 · GLASS LAYER</div></div></Showcase>
            <Showcase title="Motion principles"><div className={styles.motionList}><span><i className={styles.motionDot}/> Hover lift <code>160ms</code></span><span><i className={styles.motionDot}/> Panel reveal <code>220ms</code></span><span><i className={styles.motionDot}/> Modal spring <code>320ms</code></span><span><i className={styles.motionDot}/> Reduced motion <code>respected</code></span></div></Showcase>
          </div>
        </section>

        <footer className={styles.footer}><div className={styles.brand}><div className={styles.brandMark}><Sparkles size={16}/></div><span>NEONIX</span></div><span>Designed for clarity. Built for reuse.</span><span>© 2026 Neonix UI Lab</span></footer>
      </div>
    </main>

    {modal&&<div className={styles.modalBackdrop} onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><div className={styles.modal}><button className={styles.modalClose} onClick={()=>setModal(false)}><X size={17}/></button><div className={styles.modalIcon}><Sparkles size={20}/></div><span className={styles.eyebrow}>DESIGN PRINCIPLES</span><h2>Less noise.<br/><em>More intention.</em></h2><p>Obsidian uses restrained contrast, consistent spacing and subtle depth to keep attention on content and action.</p><div className={styles.principleList}><span><Check size={15}/> One accent color per surface</span><span><Check size={15}/> Borders before heavy shadows</span><span><Check size={15}/> Motion should clarify, not decorate</span></div><button className={styles.buttonPrimary} onClick={()=>setModal(false)}>Got it <Check size={15}/></button></div></div>}
    {toast&&<div className={styles.liveToast}><CheckCircle2 size={18}/><div><strong>Action completed</strong><small>Your interaction was successful.</small></div><button onClick={()=>setToast(false)}><X size={15}/></button></div>}
  </div>;
}

function SectionHead({index,title,desc}:{index:string;title:string;desc:string}) {
  return <div className={styles.sectionHead}><span>{index}</span><div><h2>{title}</h2><p>{desc}</p></div><div className={styles.sectionLine}/></div>;
}
function Showcase({title,note,children}:{title:string;note?:string;children:ReactNode}) {
  return <div className={styles.showcase}><div className={styles.showcaseHead}><div><strong>{title}</strong>{note&&<p>{note}</p>}</div><button aria-label="More options"><MoreHorizontal size={17}/></button></div><div className={styles.showcaseBody}>{children}</div></div>;
}
function MiniBars(){return <div className={styles.miniBars}>{[25,40,32,60,48,75,56,88,66,95,74,100].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div>}
function ArrowUpRightIcon(){return <ArrowRight size={13}/>}
function MapPinIcon(){return <span style={{fontSize:11}}>⌖</span>}

export default App;
