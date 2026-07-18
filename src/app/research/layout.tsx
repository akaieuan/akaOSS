// Reuse the paper's .paper-body typography for rendered research posts.
import "../paper/paper.css";

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
