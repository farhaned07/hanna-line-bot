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
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="text-center">
                    <Activity className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400">Loading Agent Command Center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-600 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
                            <Cpu className="w-8 h-8 text-blue-400" />
                            Agent Command Center
                        </h1>
                        <p className="text-slate-300 mt-2">Your AI-powered business operating system</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{stats.enabledCount}/{stats.totalCount}</div>
                        <div className="text-sm text-slate-400">Agents Active</div>
                        {stats.dryRun && (
                            <div className="mt-2 bg-amber-500/20 border border-amber-600 rounded px-3 py-1 text-xs text-amber-400">
                                🔒 DRY RUN MODE
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat with Friday */}
                <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-bold text-white">Chat with Friday</h2>
                        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-600">Online</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto mb-4 space-y-3">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.from === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-700 text-slate-100 border border-slate-600'
                                    }`}>
                                    {msg.from === 'friday' && <div className="text-xs font-semibold text-blue-400 mb-1">✨ Friday</div>}
                                    <div className="text-sm">{msg.message}</div>
                                    <div className="text-xs opacity-60 mt-1">
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
                            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={sendChatMessage}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Send
                        </button>
                    </div>

                    {/* Quick Commands */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => setChatInput('show status')} className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded hover:bg-slate-600">
                            📊 Status
                        </button>
                        <button onClick={() => setChatInput('show pipeline')} className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded hover:bg-slate-600">
                            💰 Pipeline
                        </button>
                        <button onClick={() => setChatInput('help')} className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded hover:bg-slate-600">
                            ❓ Help
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-2">
                        {logs.map((log, idx) => (
                            <div key={idx} className="text-sm p-2 bg-slate-700/50 rounded border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-200">{log.agent.toUpperCase()}</span>
                                    <span className="text-xs text-slate-400">
                                        {log.time ? new Date(log.time).toLocaleTimeString() : ''}
                                    </span>
                                </div>
                                <div className="text-slate-300 mt-1">{log.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Agent Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Your AI Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map(agent => (
                        <div key={agent.id} className={`bg-slate-800 rounded-lg border shadow-md p-4 ${agent.enabled ? 'border-green-600' : 'border-slate-600'
                            }`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl">{agent.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-white">{agent.name}</h3>
                                        <p className="text-xs text-slate-400">{agent.role}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${agent.enabled ? 'bg-green-500/20 text-green-400 border border-green-600' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {agent.enabled ? 'ON' : 'OFF'}
                                </div>
                            </div>

                            <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                                <Radio className="w-3 h-3" />
                                {agent.schedule}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => triggerAgent(agent.id)}
                                    disabled={!agent.enabled}
                                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition flex items-center justify-center gap-1 ${agent.enabled
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Play className="w-4 h-4" />
                                    Run Now
                                </button>
                                <button className="px-3 py-2 rounded text-sm border border-slate-600 text-slate-400 hover:bg-slate-700">
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
