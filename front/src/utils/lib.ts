import { Remarkable } from "remarkable";

export const convertMarkdownToHTML = (markdown: any) => {
    // const md = new Remarkable({linkify: true});
    const md = new Remarkable()
    let html = md.render(markdown);
    return html;
  };