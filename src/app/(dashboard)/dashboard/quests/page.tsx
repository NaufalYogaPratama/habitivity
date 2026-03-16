import { Metadata } from "next";
import QuestBoardClient from "./QuestBoardClient";

export const metadata: Metadata = {
  title: "Quest Board | Habitivity",
  description: "Manajemen misi dan tugas Anda.",
};

export default function QuestsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                      <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl"> ⚔️</span>(Quest Board)
                    </h1>
    
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