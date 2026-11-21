import * as ObsidianButton from "../registry/styles/obsidian/button/button";
import * as ObsidianCard from "../registry/styles/obsidian/card/card";
import * as ObsidianInput from "../registry/styles/obsidian/input/input";
import * as ObsidianDialog from "../registry/styles/obsidian/dialog/dialog";
import * as MinimalButton from "../registry/styles/minimal/button/button";
import * as MinimalCard from "../registry/styles/minimal/card/card";
import * as MinimalInput from "../registry/styles/minimal/input/input";
import * as MinimalDialog from "../registry/styles/minimal/dialog/dialog";

export const previewComponents = {
  obsidian: { ...ObsidianButton, ...ObsidianCard, ...ObsidianInput, ...ObsidianDialog },
  minimal: { ...MinimalButton, ...MinimalCard, ...MinimalInput, ...MinimalDialog },
};
