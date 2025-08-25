import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-honey-flower-50 to-honey-flower-100">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-honey-flower-400 to-honey-flower-600 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-honey-flower-800">📝 ObsidianFlow</h1>
                        </div>
                    </div>
                    <p className="text-xl text-honey-flower-700 max-w-2xl mx-auto">
                        Your personal knowledge management system. Create, connect, and discover insights in your notes with powerful linking and search capabilities.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-honey-flower-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">✍️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-honey-flower-800 mb-2">Real-time Markdown Editor</h3>
                        <p className="text-honey-flower-600">Write in Markdown with live preview. Syntax highlighting and instant rendering make writing a pleasure.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-honey-flower-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🔗</span>
                        </div>
                        <h3 className="text-lg font-semibold text-honey-flower-800 mb-2">Bidirectional Links</h3>
                        <p className="text-honey-flower-600">Connect ideas with [[Note Name]] syntax. Automatically creates backlinks and builds your knowledge graph.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-honey-flower-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🏷️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-honey-flower-800 mb-2">Smart Tagging</h3>
                        <p className="text-honey-flower-600">Organize notes with tags and metadata. Filter and discover related content effortlessly.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-honey-flower-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-semibold text-honey-flower-800 mb-2">Powerful Search</h3>
                        <p className="text-honey-flower-600">Full-text search with advanced filtering. Find any note instantly by content, tags, or metadata.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-honey-flower-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">📁</span>
                        </div>
                        <h3 className="text-lg font-semibold text-honey-flower-800 mb-2">Organized Structure</h3>
                        <p className="text-honey-flower-600">Folder-based organization with collections. Keep your knowledge base structured and accessible.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-honey-flower-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🕸️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-honey-flower-800 mb-2">Graph Visualization</h3>
                        <p className="text-honey-flower-600">See connections between your notes. Interactive graph view reveals patterns and relationships.</p>
                    </div>
                </div>

                {/* App Preview */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16">
                    <h2 className="text-2xl font-bold text-honey-flower-800 mb-6 text-center">Three-Pane Interface</h2>
                    <div className="bg-honey-flower-50 rounded-lg border border-honey-flower-200 overflow-hidden">
                        <div className="flex h-96">
                            {/* Left Sidebar Preview */}
                            <div className="w-1/4 bg-honey-flower-100 border-r border-honey-flower-200 p-4">
                                <div className="space-y-3">
                                    <div className="text-sm font-semibold text-honey-flower-700">📁 Explorer</div>
                                    <div className="space-y-1 ml-2">
                                        <div className="text-xs text-honey-flower-600">📄 Welcome Note</div>
                                        <div className="text-xs text-honey-flower-600">📄 Project Ideas</div>
                                        <div className="text-xs text-honey-flower-600">📄 Meeting Notes</div>
                                    </div>
                                    <div className="text-sm font-semibold text-honey-flower-700 mt-4">🔍 Search</div>
                                    <div className="bg-white rounded px-2 py-1 text-xs text-honey-flower-500">Search notes...</div>
                                    <div className="text-sm font-semibold text-honey-flower-700 mt-4">🏷️ Tags</div>
                                    <div className="flex flex-wrap gap-1">
                                        <span className="text-xs bg-honey-flower-200 text-honey-flower-700 px-2 py-1 rounded">work</span>
                                        <span className="text-xs bg-honey-flower-200 text-honey-flower-700 px-2 py-1 rounded">ideas</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Center Editor Preview */}
                            <div className="flex-1 bg-white p-4 border-r border-honey-flower-200">
                                <div className="space-y-2">
                                    <div className="text-lg font-semibold text-honey-flower-800"># Welcome Note</div>
                                    <div className="text-sm text-honey-flower-600 font-mono">
                                        <div>This is a **markdown** editor with</div>
                                        <div>[[Project Ideas]] linking support.</div>
                                        <div></div>
                                        <div>- Real-time preview</div>
                                        <div>- Syntax highlighting</div>
                                        <div>- Auto-save</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Sidebar Preview */}
                            <div className="w-1/4 bg-honey-flower-100 p-4">
                                <div className="space-y-3">
                                    <div className="text-sm font-semibold text-honey-flower-700">👁️ Preview</div>
                                    <div className="bg-white rounded p-2 text-xs">
                                        <div className="font-semibold">Welcome Note</div>
                                        <div className="mt-1">This is a <strong>markdown</strong> editor...</div>
                                    </div>
                                    <div className="text-sm font-semibold text-honey-flower-700">🔗 Backlinks</div>
                                    <div className="text-xs text-honey-flower-600">No backlinks yet</div>
                                    <div className="text-sm font-semibold text-honey-flower-700">🕸️ Graph</div>
                                    <div className="bg-white rounded h-20 flex items-center justify-center text-xs text-honey-flower-500">
                                        Interactive graph view
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-honey-flower-500 to-honey-flower-600 text-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-3xl font-bold mb-4">Start Building Your Knowledge Garden 🌱</h2>
                        <p className="text-lg mb-8 text-honey-flower-50">
                            Join thousands of thinkers, researchers, and creators who trust ObsidianFlow with their ideas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href={route('register')}>
                                <Button size="lg" className="bg-white text-honey-flower-600 hover:bg-honey-flower-50 font-semibold px-8 py-3">
                                    🚀 Get Started Free
                                </Button>
                            </Link>
                            <Link href={route('login')}>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
                                >
                                    🔑 Sign In
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-honey-flower-100 mt-4">
                            No credit card required • Unlimited notes • Forever free tier
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-honey-flower-600">
                    <p>&copy; 2024 ObsidianFlow. Made with ❤️ for knowledge workers.</p>
                </div>
            </div>
        </div>
    );
}