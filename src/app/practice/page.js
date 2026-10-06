import PracticeView from "@/components/PracticeView";

export const metadata = {
  title: "Typing Practice — DSA Typing Master",
  description: "Interactive Python code typing tutor for LeetCode DSA patterns.",
};

export default function PracticePage() {
  return <PracticeView initialSlug="two-sum" />;
}
