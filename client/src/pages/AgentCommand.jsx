import { useState, useEffect } from 'react';
import { Sparkles, Activity, TrendingUp, Radio, Play, Settings, Cpu } from 'lucide-react';

const AgentCommand = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState([
        { from: 'friday', message: "Good morning, boss! I'm Friday, your executive assistant. How can I help you today?", time: new Date().toISOString() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ dryRun: true, enabledCount: 0, totalCount: 7 });

    useEffect(() => {
        fetchAgentStatus();
        fetchLogs();
        const interval = setInterval(() => {
            fetchAgentStatus();
            fetchLogs();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchAgentStatus = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('/api/agents/status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAgents(data.agents);
            setStats({ dryRun: data.dryRun, enabledCount: data.enabledCount, totalCount: data.totalCount });
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch agent status:', error);
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('/api/agents/logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setLogs(data.logs);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        setChatMessages(prev => [...prev, {
            from: 'user',
            message: chatInput,
            time: new Date().toISOString()
        }]);

        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('/api/agents/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: chatInput })
            });
            const data = await res.json();

            setChatMessages(prev => [...prev, {
                from: 'friday',
                message: data.message,
                time: data.timestamp
            }]);
        } catch (error) {
            console.error('Chat failed:', error);
            setChatMessages(prev => [...prev, {
                from: 'friday',
                message: 'Sorry, I encountered an error. Please try again.',
                time: new Date().toISOString()
            }]);
        }

        setChatInput('');
    };

    const triggerAgent = async (agentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`/api/agents/trigger/${agentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            setChatMessages(prev => [...prev, {
                from: 'friday',
                message: `✅ ${agentId.toUpperCase()} executed successfully.`,
                time: new Date().toISOString()
            }]);

            fetchLogs();
        } catch (error) {
            console.error(`Failed to trigger ${agentId}:`, error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0B0D12]">
                <div className="text-center">
                    <Activity className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Loading Agent Command Center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#13151A] rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
                            <Cpu className="w-8 h-8 text-indigo-400" />
                            Agent Command Center
                        </h1>
                        <p className="text-slate-400 mt-2">Your AI-powered business operating system</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{stats.enabledCount}/{stats.totalCount}</div>
                        <div className="text-sm text-slate-500 font-medium">Agents Active</div>
                        {stats.dryRun && (
                            <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1 text-xs text-amber-400 font-semibold">
                                🔒 DRY RUN MODE
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat with Friday */}
                <div className="lg:col-span-2 bg-[#13151A] rounded-2xl border border-white/5 shadow-xl p-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white">Chat with Friday</h2>
                        <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20 font-semibold">Online</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto mb-4 space-y-3">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl ${msg.from === 'user'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                    : 'bg-[#0B0D12] text-slate-100 border border-white/5'
                                    }`}>
                                    {msg.from === 'friday' && <div className="text-xs font-semibold text-indigo-400 mb-1">✨ Friday</div>}
                                    <div className="text-sm">{msg.message}</div>
                                    <div className="text-xs opacity-60 mt-1 font-mono">
                                        {msg.time ? new Date(msg.time).toLocaleTimeString() : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                            placeholder="Ask Friday anything... (e.g., 'show pipeline', 'status')"
                            className="flex-1 px-4 py-2.5 bg-[#0B0D12] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            onClick={sendChatMessage}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-semibold shadow-lg shadow-indigo-900/20"
                        >
                            Send
                        </button>
                    </div>

                    {/* Quick Commands */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => setChatInput('show status')} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg hover:bg-white/10 transition-all font-medium">
                            📊 Status
                        </button>
                        <button onClick={() => setChatInput('show pipeline')} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg hover:bg-white/10 transition-all font-medium">
                            💰 Pipeline
                        </button>
                        <button onClick={() => setChatInput('help')} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg hover:bg-white/10 transition-all font-medium">
                            ❓ Help
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#13151A] rounded-2xl border border-white/5 shadow-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-2">
                        {logs.map((log, idx) => (
                            <div key={idx} className="text-sm p-3 bg-[#0B0D12] rounded-xl border-l-4 border-indigo-500">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-200">{log.agent.toUpperCase()}</span>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {log.time ? new Date(log.time).toLocaleTimeString() : ''}
                                    </span>
                                </div>
                                <div className="text-slate-400 mt-1">{log.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Agent Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                    Your AI Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map(agent => (
                        <div key={agent.id} className={`bg-[#13151A] rounded-2xl border shadow-xl p-5 transition-all hover:-translate-y-0.5 ${agent.enabled ? 'border-emerald-500/30' : 'border-white/5'
                            }`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl">{agent.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-white">{agent.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${agent.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-500 border border-white/10'
                                    }`}>
                                    {agent.enabled ? 'ON' : 'OFF'}
                                </div>
                            </div>

                            <div className="text-xs text-slate-500 mb-4 flex items-center gap-1 font-medium">
                                <Radio className="w-3 h-3" />
                                {agent.schedule}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => triggerAgent(agent.id)}
                                    disabled={!agent.enabled}
                                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${agent.enabled
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20'
                                        : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    <Play className="w-4 h-4" />
                                    Run Now
                                </button>
                                <button className="px-3 py-2.5 rounded-xl text-sm border border-white/10 text-slate-400 hover:bg-white/5 transition-all">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentCommand;
