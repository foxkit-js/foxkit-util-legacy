export function dedent(options) {
  const tabWidth = options?.tabWidth ?? 2;
  const useTabs = options?.useTabs ?? false;

  function countWidth(spaces) {
    return spaces.replace(/\t/g, " ".repeat(tabWidth)).length;
  }

  function splitWhitespace(line) {
    // return null for empty lines
    if (/^\s*$/.test(line)) {
      return { width: null, str: "" };
    }

    const match = line.match(/^(\s*)(.*)$/);
    const width = countWidth(match[1]);
    const str = match[2];
    return { width, str };
  }

  function makeSpaces(width) {
    if (useTabs) {
      const tabs = Math.floor(width / tabWidth);
      const extra = width % tabWidth;
      let out = "\t".repeat(tabs);

      if (extra) {
        out += " ".repeat(extra);
      }

      return out;
    }

    return " ".repeat(width);
  }

  function formResult(subject, minWidth) {
    subject
      .map(line =>
        line.width === null ? "" : makeSpaces(line.width - minWidth) + line.str
      )
      .join("\n");
  }

  return str => {
    // prepare subject
    const subject = str.split("\n").map(line => splitWhitespace(line));
    const nonEmptyLines = subject.filter(line => line.width !== null);
    const minWidth = Math.min(...nonEmptyLines.map(line => line.width));

    return formResult(subject, minWidth);
  };
}
