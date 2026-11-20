import * as ObsidianButton from "../registry/styles/obsidian/button";
import * as ObsidianCard from "../registry/styles/obsidian/card";
import * as ObsidianInput from "../registry/styles/obsidian/input";
import * as MinimalButton from "../registry/styles/minimal/button";
import * as MinimalCard from "../registry/styles/minimal/card";
import * as MinimalInput from "../registry/styles/minimal/input";

export const previewComponents = {
  obsidian: { ...ObsidianButton, ...ObsidianCard, ...ObsidianInput },
  minimal: { ...MinimalButton, ...MinimalCard, ...MinimalInput },
};
