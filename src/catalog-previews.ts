import * as PremiumButton from "../registry/styles/obsidian/button";
import * as PremiumCard from "../registry/styles/obsidian/card";
import * as PremiumInput from "../registry/styles/obsidian/input";
import * as MinimalButton from "../registry/styles/minimal/button";
import * as MinimalCard from "../registry/styles/minimal/card";
import * as MinimalInput from "../registry/styles/minimal/input";

export const previewComponents = {
  obsidian: { ...PremiumButton, ...PremiumCard, ...PremiumInput },
  minimal: { ...MinimalButton, ...MinimalCard, ...MinimalInput },
};
