import LogDetailPage from "./LogDetailPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Log Details | a11y",
  };
}

export default function Page() {
  return <LogDetailPage />;
} 