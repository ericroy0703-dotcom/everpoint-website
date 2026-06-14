import LegalMarkdownPage from "./LegalMarkdownPage";
import termsMarkdown from "../../docs/terms-and-conditions.md?raw";

export default function TermsPage() {
  return (
    <LegalMarkdownPage
      title="Terms and Conditions"
      markdown={termsMarkdown}
      inProgress
    />
  );
}

