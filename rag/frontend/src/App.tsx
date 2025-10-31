import { useChat } from "@ai-sdk/react";

export default function App() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
      }/invoke`,
      initialMessages: [],
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add effort level to the message (though our current backend doesn't use it)
    // We could modify the backend later to use this
    handleSubmit(e);
  };

  const handleCancel = () => {
    stop();
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-neutral-800 text-neutral-100 font-sans antialiased">
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Aria's Tale Encyclopedia
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl">
                  Let's chat about{" "}
                  <a
                    className="text-blue-400 hover:text-blue-500"
                    href="https://www.ariastale.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Aria's Tale
                  </a>{" "}
                  Lore!
                </p>
              </div>

              <div className="w-full max-w-2xl space-y-4">
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="What would you like to ask about Aria's Tale?"
                    className="w-full p-4 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-400 focus:border-blue-500 focus:outline-none resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                      {isLoading ? "Thinking..." : "Submit"}
                    </button>
                    {isLoading && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            // Chat Messages View
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </div>
                    <span className="text-sm text-neutral-400 capitalize">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600/20 border border-blue-600/30"
                        : "bg-neutral-700 border border-neutral-600"
                    }`}
                  >
                    <div className="prose prose-invert max-w-none">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      AI
                    </div>
                    <span className="text-sm text-neutral-400">
                      AI Assistant
                    </span>
                  </div>
                  <div className="p-4 bg-neutral-700 border border-neutral-600 rounded-lg">
                    <div className="flex items-center space-x-2 text-neutral-400">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span>Researching your question...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* New message form */}
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="flex space-x-3">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask a follow-up question..."
                    className="flex-1 p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                  {isLoading && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
