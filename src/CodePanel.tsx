"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { CodeLines } from "./CodeLines";
import css from "./Catalog.module.css";

export type SourceFile = { name: string; source: string };

export function CodePanel({
  files,
}: { files: SourceFile[] }) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const file = files[selectedFile];

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(file.source);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select the code to copy it manually.");
    }
  }

  return (
    <section className={css.panel} aria-label="Component example and source">
      <div className={css.sourceHeader}>
        <div className={css.windowControls} aria-hidden="true"><i /><i /><i /></div>
        <span>Source files</span>
      </div>
      <div className={css.sourceToolbar}>
        <div className={css.fileTabs} role="group" aria-label="Source files">
          {files.map((item, index) => (
            <button type="button" key={item.name} aria-pressed={index === selectedFile} onClick={() => {
              setSelectedFile(index);
              setCopyStatus("");
            }}>{item.name}</button>
          ))}
        </div>
        <button className={css.copy} type="button" onClick={copyCode}>
          {copyStatus === "Copied" ? <Check size={15} /> : <Copy size={15} />}
          {copyStatus === "Copied" ? "Copied" : `Copy ${file.name}`}
        </button>
      </div>
      <pre className={css.source} tabIndex={0} aria-label={file.name}>
        <code><CodeLines code={file.source} lang={file.name.endsWith(".css") ? "css" : "tsx"} /></code>
      </pre>
      <span className={copyStatus === "Select the code to copy it manually." ? css.copyError : css.srOnly} role="status">
        {copyStatus}
      </span>
    </section>
  );
}
