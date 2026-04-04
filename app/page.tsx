import HeroPlayground from "@/components/HeroPlayground";
import LabActivity from "@/components/LabActivity";
import SystemSummary from "@/components/SystemSummary";
import CollaborationFlow from "@/components/CollaborationFlow";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main>
      <HeroPlayground />
      <LabActivity />
      <SystemSummary />
      <CollaborationFlow />
      <CTA />
    </main>
  );
}
