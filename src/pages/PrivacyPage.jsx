import LegalMarkdownPage from "./LegalMarkdownPage";
import privacyMarkdown from "../../docs/privacy-policy.md?raw";

export default function PrivacyPage() {
  return (
    <LegalMarkdownPage title="Privacy Policy" markdown={privacyMarkdown} inProgress />
  );
}

