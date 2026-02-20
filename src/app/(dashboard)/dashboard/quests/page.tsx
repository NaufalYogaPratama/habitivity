import { Metadata } from "next";
import QuestBoardClient from "./QuestBoardClient";

export const metadata: Metadata = {
  title: "Quest Board | Habitivity",
  description: "Manajemen misi dan tugas Anda.",
};

export default function QuestsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Papan Misi (Quest Board) ⚔️</h2>
      </div>
      <div className="hidden space-y-4 md:block">
        <p className="text-muted-foreground">
          Selesaikan misi untuk mendapatkan XP dan Gold. Makin sulit misinya, makin besar hadiahnya!
        </p>
      </div>
      
      {/* Memanggil Client Component */}
      <QuestBoardClient />
    </div>
  );
}