import React from 'react';

const CHARACTERS_CONFIG: Record<string, { emoji: string; color: string }> = {
    CyberNinja: { emoji: "🥷", color: "from-blue-500 to-cyan-400" },
    PixelHero: { emoji: "👾", color: "from-green-500 to-emerald-400" },
    NeoSamurai: { emoji: "🗡️", color: "from-red-500 to-orange-400" },
    CosmicTraveler: { emoji: "🧑‍🚀", color: "from-indigo-500 to-purple-400" },
    ForestMage: { emoji: "🧙‍♂️", color: "from-teal-500 to-lime-400" }
};

const KNOWN_EQUIPMENT_ICONS: Record<string, string> = {
    "Basic Helm": "🪖", "Cyber Visor": "🥽", "Void Crown": "👑", "Infinity Halo": "😇",
    "Standard Suit": "👕", "Stealth Vest": "🦺", "Plasma Core": "🛡️", "Quantum Shield": "🔮",
    "Training Blade": "🗡️", "Laser Dagger": "🔪", "Void Saber": "⚔️", "Excalibur NG": "🗡️",
    "Power Glove": "🧤", "Hologram Wing": "🦋", "Time Ring": "💍", "Infinity Gauntlet": "🧤",
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
    const helm = avatar?.equipment?.helm;
    const weapon = avatar?.equipment?.weapon;
    const armor = avatar?.equipment?.armor;
    const accessory = avatar?.equipment?.accessory;

    return (
        <div className={`relative flex items-center justify-center bg-gradient-to-br ${config.color} rounded-2xl shadow-lg border border-white/20 overflow-visible ${className}`}>
            <span className={`relative z-10 ${emojiSize} drop-shadow-md`}>
                {config.emoji}
            </span>

            {helm && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-black/60 rounded-full w-5 h-5 flex items-center justify-center border border-white/20 z-20 shadow-sm" title={helm}>
                    {KNOWN_EQUIPMENT_ICONS[helm] || "🪖"}
                </span>
            )}
            {armor && (
                <span className="absolute -top-1.5 -left-1.5 text-[10px] bg-black/60 rounded-full w-5 h-5 flex items-center justify-center border border-white/20 z-20 shadow-sm" title={armor}>
                    {KNOWN_EQUIPMENT_ICONS[armor] || "👕"}
                </span>
            )}
            {weapon && (
                <span className="absolute -bottom-1.5 -left-1.5 text-[10px] bg-black/60 rounded-full w-5 h-5 flex items-center justify-center border border-white/20 z-20 shadow-sm" title={weapon}>
                    {KNOWN_EQUIPMENT_ICONS[weapon] || "⚔️"}
                </span>
            )}
            {accessory && (
                <span className="absolute -bottom-1.5 -right-1.5 text-[10px] bg-black/60 rounded-full w-5 h-5 flex items-center justify-center border border-white/20 z-20 shadow-sm" title={accessory}>
                    {KNOWN_EQUIPMENT_ICONS[accessory] || "💍"}
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
