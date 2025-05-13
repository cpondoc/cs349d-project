import LogsPage from "./LogsPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Query Logs | a11y",
  };
}

export default function Page() {
  return <LogsPage />;
} 