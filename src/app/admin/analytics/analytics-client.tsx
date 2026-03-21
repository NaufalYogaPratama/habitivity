'use client';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsClient({ chartData, statsOverview, totalUsers, totalFocusMins }: any) {

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    {/* PERUBAHAN: Emoji diganti gambar icon-shop */}
                    <Image
                        src="/assets/logo/icon-analytics.png"
                        alt="Analytics"
                        width={32}
                        height={32}
                        className="object-contain drop-shadow-md"
                        priority
                    />
                    Platform Analytics
                </h1>
                <p className="text-slate-400 text-sm mt-1">Deep dive into Habitivity's growth and engagement metrics.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <Card className="bg-[#151823] border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <CardHeader className="pb-1 p-4">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Hero Roster</CardDescription>
                        <CardTitle className="text-2xl font-black text-emerald-400">{totalUsers.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-[10px] text-slate-400">Registered</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-blue-500/20 shadow-lg shadow-blue-500/5">
                    <CardHeader className="pb-1 p-4">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Deep Work (30d)</CardDescription>
                        <CardTitle className="text-2xl font-black text-blue-400">{Math.floor(totalFocusMins / 60)}h</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-[10px] text-slate-400">Total Focus</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-amber-500/20 shadow-lg shadow-amber-500/5">
                    <CardHeader className="pb-1 p-4">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Gold Economy</CardDescription>
                        <CardTitle className="text-2xl font-black text-amber-400">{statsOverview.totalGold.toLocaleString()}g</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-[10px] text-slate-400">Circulation</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
                    <CardHeader className="pb-1 p-4">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Shop Volume</CardDescription>
                        <CardTitle className="text-2xl font-black text-fuchsia-400">{statsOverview.totalPurchases.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-[10px] text-slate-400">Items Sold</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                    <CardHeader className="pb-1 p-4">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Quests Beaten</CardDescription>
                        <CardTitle className="text-2xl font-black text-cyan-400">{statsOverview.completedQuests.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-[10px] text-slate-400">Victories</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-rose-500/20 shadow-lg shadow-rose-500/5">
                    <CardHeader className="pb-1 p-4">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Active Quests</CardDescription>
                        <CardTitle className="text-2xl font-black text-rose-400">{statsOverview.activeQuests.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-[10px] text-slate-400">On-going</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#151823] border-white/[0.06] p-4 col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Focus Engagement (Last 30 Days)</CardTitle>
                        <CardDescription>Daily total focus minutes logged by gamers.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full mt-4 p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickFormatter={(tick) => tick.substring(5)} />
                                <YAxis stroke="#ffffff50" fontSize={10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#60A5FA' }}
                                />
                                <Line type="monotone" dataKey="focusMinutes" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#60A5FA' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-white/[0.06] p-4 col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Daily New Registration Growth</CardTitle>
                        <CardDescription>New heroes joining Habitivity over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full mt-4 p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickFormatter={(tick) => tick.substring(5)} />
                                <YAxis stroke="#ffffff50" fontSize={10} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#34d399' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="newUsers" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
