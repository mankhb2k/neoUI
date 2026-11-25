import * as ObsidianButton from "../registry/styles/obsidian/button/button";
import * as ObsidianCard from "../registry/styles/obsidian/card/card";
import * as ObsidianInput from "../registry/styles/obsidian/input/input";
import * as ObsidianDialog from "../registry/styles/obsidian/dialog/dialog";
import * as MinimalButton from "../registry/styles/minimal/button/button";
import * as MinimalCard from "../registry/styles/minimal/card/card";
import * as MinimalInput from "../registry/styles/minimal/input/input";
import * as MinimalDialog from "../registry/styles/minimal/dialog/dialog";
import * as StudioButton from "../registry/styles/studio/button/button";
import * as StudioCard from "../registry/styles/studio/card/card";
import * as StudioInput from "../registry/styles/studio/input/input";
import * as StudioDialog from "../registry/styles/studio/dialog/dialog";
import * as ObsidianTabs from "../registry/styles/obsidian/tabs/tabs";
import * as MinimalTabs from "../registry/styles/minimal/tabs/tabs";
import * as StudioTabs from "../registry/styles/studio/tabs/tabs";
import * as ObsidianDropdownMenu from "../registry/styles/obsidian/dropdown-menu/dropdown-menu";
import * as MinimalDropdownMenu from "../registry/styles/minimal/dropdown-menu/dropdown-menu";
import * as StudioDropdownMenu from "../registry/styles/studio/dropdown-menu/dropdown-menu";
import * as ObsidianSelect from "../registry/styles/obsidian/select/select";
import * as MinimalSelect from "../registry/styles/minimal/select/select";
import * as StudioSelect from "../registry/styles/studio/select/select";
import * as ObsidianContextMenu from "../registry/styles/obsidian/context-menu/context-menu";
import * as MinimalContextMenu from "../registry/styles/minimal/context-menu/context-menu";
import * as StudioContextMenu from "../registry/styles/studio/context-menu/context-menu";
import * as ObsidianSeparator from "../registry/styles/obsidian/separator/separator";
import * as MinimalSeparator from "../registry/styles/minimal/separator/separator";
import * as StudioSeparator from "../registry/styles/studio/separator/separator";

export const previewComponents = {
  obsidian: { ...ObsidianButton, ...ObsidianCard, ...ObsidianInput, ...ObsidianDialog, ...ObsidianTabs, ...ObsidianDropdownMenu, ...ObsidianSelect, ...ObsidianContextMenu, ...ObsidianSeparator },
  minimal: { ...MinimalButton, ...MinimalCard, ...MinimalInput, ...MinimalDialog, ...MinimalTabs, ...MinimalDropdownMenu, ...MinimalSelect, ...MinimalContextMenu, ...MinimalSeparator },
  studio: { ...StudioButton, ...StudioCard, ...StudioInput, ...StudioDialog, ...StudioTabs, ...StudioDropdownMenu, ...StudioSelect, ...StudioContextMenu, ...StudioSeparator },
};
