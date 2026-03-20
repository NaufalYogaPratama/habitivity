import React from 'react';

const CHARACTERS_CONFIG: Record<string, { emoji: string; color: string }> = {
    CyberNinja: { emoji: "🥷", color: "from-blue-500 to-cyan-400" },
    PixelHero: { emoji: "👾", color: "from-green-500 to-emerald-400" },
    NeoSamurai: { emoji: "🗡️", color: "from-red-500 to-orange-400" },
    CosmicTraveler: { emoji: "🧑‍🚀", color: "from-indigo-500 to-purple-400" },
    ForestMage: { emoji: "🧙‍♂️", color: "from-teal-500 to-lime-400" }
};

interface AvatarProps {
    avatar?: {
        base: string;
        evolution?: string;
        equipment?: {
            helm?: string;
            armor?: string;
            weapon?: string;
            accessory?: string;
        };
    };
    className?: string;
    emojiSize?: string;
    showEvolution?: boolean;
}

export function UserAvatar({ avatar, className = "w-10 h-10", emojiSize = "text-xl", showEvolution = false }: AvatarProps) {
    const baseId = avatar?.base || "CosmicTraveler";
    const config = CHARACTERS_CONFIG[baseId] || CHARACTERS_CONFIG["CosmicTraveler"];

    // Equipments
    const hasHelm = !!avatar?.equipment?.helm;
    const hasWeapon = !!avatar?.equipment?.weapon;

    return (
        <div className={`relative flex items-center justify-center bg-gradient-to-br ${config.color} rounded-2xl shadow-lg border border-white/20 overflow-visible ${className}`}>
            <span className={`relative z-10 ${emojiSize} drop-shadow-md`}>
                {config.emoji}
            </span>

            {hasHelm && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-black/50 rounded-full w-4 h-4 flex items-center justify-center border border-white/10 z-20" title="Equipped Helm">
                    🪖
                </span>
            )}
            {hasWeapon && (
                <span className="absolute -bottom-1 -left-1 text-[10px] bg-black/50 rounded-full w-4 h-4 flex items-center justify-center border border-white/10 z-20" title="Equipped Weapon">
                    ⚔️
                </span>
            )}

            {showEvolution && avatar?.evolution && avatar.evolution !== "Base" && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-black/80 border border-white/20 px-1.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase shadow-xl whitespace-nowrap z-30">
                    <span className={
                        avatar.evolution === 'Mythic' ? 'text-red-400' :
                            avatar.evolution === 'Legendary' ? 'text-yellow-400' :
                                avatar.evolution === 'Elite' ? 'text-purple-400' :
                                    avatar.evolution === 'Enhanced' ? 'text-blue-400' : 'text-slate-300'
                    }>
                        {avatar.evolution}
                    </span>
                </div>
            )}
        </div>
    );
}
