// Line-based syntax highlighter that mimics VS Code (Dark Modern) for TSX and CSS.
// Tokenize lines in order with one shared state so JSX, comments and bracket depth carry across lines.

export type Lang = "tsx" | "css";
export type Token = { text: string; color?: string };

type Frame =
  | { kind: "code" }
  | { kind: "text" }
  | { kind: "tag"; closing: boolean; named: boolean };

export type HighlightState = {
  stack: Frame[];
  last: string;
  comment: boolean;
  depth: number;
  typeKw: boolean;
  braces: number;
  inValue: boolean;
  inAttr: boolean;
};

export function createState(): HighlightState {
  return { stack: [{ kind: "code" }], last: "", comment: false, depth: 0, typeKw: false, braces: 0, inValue: false, inAttr: false };
}

const C = {
  comment: "#6a9955",
  string: "#ce9178",
  number: "#b5cea8",
  control: "#c586c0",
  declare: "#569cd6",
  type: "#4ec9b0",
  func: "#dcdcaa",
  variable: "#9cdcfe",
  tag: "#569cd6",
  angle: "#808080",
  selector: "#d7ba7d",
};
const BRACKETS = ["#ffd700", "#da70d6", "#179fff"];

const PINK = new Set(["import", "export", "from", "return", "default", "if", "else", "await", "as", "switch", "case", "break", "throw", "try", "catch", "finally", "for", "while", "do", "continue", "yield"]);
const BLUE = new Set(["const", "let", "var", "function", "class", "interface", "enum", "extends", "implements", "new", "typeof", "async", "void", "in", "of", "instanceof", "true", "false", "null", "undefined", "this", "static", "public", "private", "readonly", "keyof", "satisfies", "declare", "namespace"]);
const PRIMITIVES = new Set(["string", "number", "boolean", "any", "unknown", "never", "object", "symbol", "bigint"]);
const TYPE_CONTEXT = new Set([":", "<", "extends", "as", "|", "&", "implements", "=>"]);
const EXPR_KEYWORDS = new Set(["return", "default", "case", "else", "await", "yield", "typeof", "in", "of", "as", "delete", "void", "throw"]);

const WS = /\s+/y;
const STRING = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/y;
const NUMBER_TS = /\d+(?:\.\d+)?/y;
const IDENT_TS = /[A-Za-z_$][\w$]*/y;
const IDENT_TAG = /[A-Za-z_$][\w$:-]*(?:\.[A-Za-z_$][\w$]*)*/y;
const TEXT_RUN = /<?[^<{]*/y;
const UNIT_NUMBER = /-?\d*\.?\d+[A-Za-z%]*/y;
const HEX = /#[0-9a-fA-F]{3,8}\b/y;
const HASH_ID = /#[A-Za-z_][\w-]*/y;
const AT_RULE = /@[\w-]+/y;
const IMPORTANT = /!\s*important/y;
const CUSTOM_PROP = /--[\w-]+/y;
const CLASS_SEL = /\.[A-Za-z_][\w-]*/y;
const PSEUDO = /::?[A-Za-z-]+/y;
const IDENT_CSS = /[A-Za-z_-][\w-]*/y;

function match(re: RegExp, line: string, pos: number): string | null {
  re.lastIndex = pos;
  const m = re.exec(line);
  return m && m.index === pos ? m[0] : null;
}

function createOutput() {
  const tokens: Token[] = [];
  return {
    tokens,
    push(text: string, color?: string) {
      if (!text) return;
      const prev = tokens[tokens.length - 1];
      if (prev && prev.color === color) prev.text += text;
      else tokens.push({ text, color });
    },
  };
}

function openBracket(st: HighlightState) {
  const color = BRACKETS[st.depth % 3];
  st.depth += 1;
  return color;
}

function closeBracket(st: HighlightState) {
  st.depth = Math.max(0, st.depth - 1);
  return BRACKETS[st.depth % 3];
}

function prevIsValue(last: string) {
  if (last === ")" || last === "]") return true;
  if (/^[\w$]+$/.test(last)) return !EXPR_KEYWORDS.has(last);
  return false;
}

function codeIdentifier(word: string, rest: string, st: HighlightState): string {
  const last = st.last;
  const assigned = /^\s*=(?![=>])/.test(rest);

  if (word === "type" && !assigned && /^\s+[A-Za-z{]/.test(rest)) {
    st.typeKw = true;
    return C.declare;
  }
  if (st.typeKw) {
    st.typeKw = false;
    return C.type;
  }
  if (last === "interface" || last === "class" || last === "enum") return C.type;
  if (last === ".") return /^\s*\(/.test(rest) ? C.func : C.variable;
  if (assigned) return C.variable;
  if (/^\s*:(?!:)/.test(rest) && (last === "{" || last === ",")) return C.variable;
  if (PINK.has(word)) return C.control;
  if (BLUE.has(word)) return C.declare;
  if (last === "function") return C.func;
  if (/^\s*\(/.test(rest)) return C.func;
  if (PRIMITIVES.has(word)) return C.declare;
  if (/^[A-Z]/.test(word) && TYPE_CONTEXT.has(last)) return C.type;
  return C.variable;
}

function tokenizeTsx(line: string, st: HighlightState): Token[] {
  const { tokens, push } = createOutput();
  const top = () => st.stack[st.stack.length - 1];
  let pos = 0;

  while (pos < line.length) {
    if (st.comment) {
      const end = line.indexOf("*/", pos);
      if (end === -1) {
        push(line.slice(pos), C.comment);
        pos = line.length;
      } else {
        push(line.slice(pos, end + 2), C.comment);
        pos = end + 2;
        st.comment = false;
      }
      continue;
    }

    const frame = top();
    const ch = line[pos];
    const next = line[pos + 1] ?? "";

    if (frame.kind === "text") {
      if (ch === "<" && /[A-Za-z>/]/.test(next)) {
        const closing = next === "/";
        push(closing ? "</" : "<", C.angle);
        st.stack.push({ kind: "tag", closing, named: false });
        pos += closing ? 2 : 1;
      } else if (ch === "{") {
        push("{", openBracket(st));
        st.stack.push({ kind: "code" });
        pos += 1;
      } else {
        const run = match(TEXT_RUN, line, pos) ?? ch;
        push(run);
        pos += run.length;
      }
      continue;
    }

    if (frame.kind === "tag") {
      const ws = match(WS, line, pos);
      if (ws) {
        push(ws);
        pos += ws.length;
        continue;
      }
      if (ch === "/" && next === ">") {
        push("/>", C.angle);
        st.stack.pop();
        st.last = "/>";
        pos += 2;
        continue;
      }
      if (ch === ">") {
        push(">", C.angle);
        st.stack.pop();
        if (frame.closing) {
          if (top().kind === "text") st.stack.pop();
        } else {
          st.stack.push({ kind: "text" });
        }
        st.last = ">";
        pos += 1;
        continue;
      }
      const str = match(STRING, line, pos);
      if (str) {
        push(str, C.string);
        pos += str.length;
        continue;
      }
      if (ch === "{") {
        push("{", openBracket(st));
        st.stack.push({ kind: "code" });
        pos += 1;
        continue;
      }
      const word = match(IDENT_TAG, line, pos);
      if (word) {
        if (!frame.named) {
          frame.named = true;
          push(word, /^[A-Z]/.test(word) || word.includes(".") ? C.type : C.tag);
        } else {
          push(word, C.variable);
        }
        pos += word.length;
        continue;
      }
      push(ch);
      pos += 1;
      continue;
    }

    // Code frame
    const ws = match(WS, line, pos);
    if (ws) {
      push(ws);
      pos += ws.length;
      continue;
    }
    if (ch === "/" && next === "/") {
      push(line.slice(pos), C.comment);
      pos = line.length;
      continue;
    }
    if (ch === "/" && next === "*") {
      const end = line.indexOf("*/", pos + 2);
      if (end === -1) {
        push(line.slice(pos), C.comment);
        st.comment = true;
        pos = line.length;
      } else {
        push(line.slice(pos, end + 2), C.comment);
        pos = end + 2;
      }
      continue;
    }
    const str = match(STRING, line, pos);
    if (str) {
      push(str, C.string);
      st.last = str;
      st.typeKw = false;
      pos += str.length;
      continue;
    }
    const num = match(NUMBER_TS, line, pos);
    if (num) {
      push(num, C.number);
      st.last = num;
      pos += num.length;
      continue;
    }
    if (ch === "{") {
      push("{", openBracket(st));
      st.stack.push({ kind: "code" });
      st.last = "{";
      pos += 1;
      continue;
    }
    if (ch === "}") {
      push("}", closeBracket(st));
      if (st.stack.length > 1 && top().kind === "code") st.stack.pop();
      st.last = "}";
      pos += 1;
      continue;
    }
    if (ch === "(" || ch === "[") {
      push(ch, openBracket(st));
      st.last = ch;
      pos += 1;
      continue;
    }
    if (ch === ")" || ch === "]") {
      push(ch, closeBracket(st));
      st.last = ch;
      pos += 1;
      continue;
    }
    if (ch === "=" && next === ">") {
      push("=>", C.declare);
      st.last = "=>";
      pos += 2;
      continue;
    }
    if (ch === "<" && /[A-Za-z>]/.test(next) && !prevIsValue(st.last)) {
      push("<", C.angle);
      st.stack.push({ kind: "tag", closing: false, named: false });
      st.last = "<";
      pos += 1;
      continue;
    }
    const word = match(IDENT_TS, line, pos);
    if (word) {
      push(word, codeIdentifier(word, line.slice(pos + word.length), st));
      st.last = word;
      pos += word.length;
      continue;
    }
    push(ch);
    if (ch === ";") st.typeKw = false;
    st.last = ch;
    pos += 1;
  }
  return tokens;
}

function tokenizeCss(line: string, st: HighlightState): Token[] {
  const { tokens, push } = createOutput();
  const brace = line.indexOf("{");
  const atRule = line.trim().startsWith("@");
  let pos = 0;

  while (pos < line.length) {
    if (st.comment) {
      const end = line.indexOf("*/", pos);
      if (end === -1) {
        push(line.slice(pos), C.comment);
        pos = line.length;
      } else {
        push(line.slice(pos, end + 2), C.comment);
        pos = end + 2;
        st.comment = false;
      }
      continue;
    }

    const ch = line[pos];
    const next = line[pos + 1] ?? "";
    let mode: "selector" | "at" | "prop";
    if ((brace !== -1 && pos < brace) || (brace === -1 && st.braces === 0)) mode = atRule ? "at" : "selector";
    else mode = "prop";

    if (ch === "/" && next === "*") {
      const end = line.indexOf("*/", pos + 2);
      if (end === -1) {
        push(line.slice(pos), C.comment);
        st.comment = true;
        pos = line.length;
      } else {
        push(line.slice(pos, end + 2), C.comment);
        pos = end + 2;
      }
      continue;
    }
    if (ch === "{") {
      push("{", openBracket(st));
      st.braces += 1;
      st.inValue = false;
      pos += 1;
      continue;
    }
    if (ch === "}") {
      push("}", closeBracket(st));
      st.braces = Math.max(0, st.braces - 1);
      st.inValue = false;
      pos += 1;
      continue;
    }
    if (ch === ";") {
      push(";");
      st.inValue = false;
      pos += 1;
      continue;
    }
    if (ch === "(" || ch === "[") {
      push(ch, openBracket(st));
      if (ch === "[") st.inAttr = true;
      pos += 1;
      continue;
    }
    if (ch === ")" || ch === "]") {
      push(ch, closeBracket(st));
      if (ch === "]") st.inAttr = false;
      pos += 1;
      continue;
    }
    const ws = match(WS, line, pos);
    if (ws) {
      push(ws);
      pos += ws.length;
      continue;
    }
    const str = match(STRING, line, pos);
    if (str) {
      push(str, C.string);
      pos += str.length;
      continue;
    }
    const valueLike = (mode === "prop" && st.inValue) || mode === "at";
    if (valueLike) {
      const hex = match(HEX, line, pos);
      if (hex) {
        push(hex, C.number);
        pos += hex.length;
        continue;
      }
      const num = match(UNIT_NUMBER, line, pos);
      if (num) {
        push(num, C.number);
        pos += num.length;
        continue;
      }
    }
    const at = match(AT_RULE, line, pos);
    if (at) {
      push(at, C.control);
      pos += at.length;
      continue;
    }
    const important = match(IMPORTANT, line, pos);
    if (important) {
      push(important, C.declare);
      pos += important.length;
      continue;
    }
    const custom = match(CUSTOM_PROP, line, pos);
    if (custom) {
      push(custom, C.variable);
      pos += custom.length;
      continue;
    }
    if (mode === "selector") {
      const id = match(HASH_ID, line, pos);
      const cls = match(CLASS_SEL, line, pos);
      const pseudo = match(PSEUDO, line, pos);
      const hit = id ?? cls ?? pseudo;
      if (hit) {
        push(hit, C.selector);
        pos += hit.length;
        continue;
      }
    }
    const word = match(IDENT_CSS, line, pos);
    if (word) {
      const rest = line.slice(pos + word.length);
      let color: string;
      if (mode === "selector") color = st.inAttr ? C.variable : C.selector;
      else if (mode === "at") color = C.variable;
      else if (/^\s*\{/.test(rest)) color = C.selector;
      else if (/^\(/.test(rest)) color = C.func;
      else color = st.inValue ? C.string : C.variable;
      push(word, color);
      pos += word.length;
      continue;
    }
    if (ch === ":" && mode === "prop" && !st.inValue) st.inValue = true;
    push(ch);
    pos += 1;
  }
  return tokens;
}

export function tokenizeLine(line: string, lang: Lang, state: HighlightState): Token[] {
  return lang === "css" ? tokenizeCss(line, state) : tokenizeTsx(line, state);
}
