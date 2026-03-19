import { Metadata } from "next";
import QuestBoardClient from "./QuestBoardClient";

export const metadata: Metadata = {
  title: "Quest Board | Habitivity",
  description: "Manajemen misi dan tugas Anda.",
};

export default function QuestsPage() {
  return (
    <div className="flex-1">
      {/* Client Component handles its own header */}
      <QuestBoardClient />
    </div>
  );
}