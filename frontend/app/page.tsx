import AgentPage from "./AgentPage";

export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Home | Agent o11y",
  };
}

export default function Page() {
  return <AgentPage />;
}
