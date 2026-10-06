import PracticeView from "@/components/PracticeView";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    title: `Practice: ${resolvedParams?.slug} — DSA Typing Master`,
    description: "Interactive Python code typing tutor for LeetCode DSA patterns.",
  };
}

export default async function ProblemPracticePage({ params }) {
  const resolvedParams = await params;
  return <PracticeView initialSlug={resolvedParams?.slug} />;
}
