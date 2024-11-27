import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageProps {
  role: 'user' | 'assistant' | 'system'
  content: string
  loading?: boolean
}

export function Message({ role, content, loading }: MessageProps) {
  return (
    <div
      className={`flex ${
        role === 'user' 
          ? 'justify-end' 
          : role === 'assistant' 
            ? 'justify-start' 
            : 'justify-center'
      }`}
    >
      <div
        className={`max-w-[80%] px-6 py-4 rounded-2xl ${
          role === 'user'
            ? 'bg-accent/10 text-accent'
            : role === 'assistant'
              ? 'bg-background-light/50 dark:bg-background-dark/50 text-gray-800 dark:text-gray-200'
              : 'bg-red-500 text-white'
        } backdrop-blur-lg border border-gray-200/10 dark:border-gray-800/10
          shadow-[0_0_15px_rgba(0,0,0,0.03)] dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]
          ${loading ? 'animate-pulse' : ''}`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : role === 'assistant' ? (
          <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-pre:my-1 prose-pre:bg-gray-800/50 prose-pre:text-gray-100">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="my-1" {...props} />,
                pre: ({node, ...props}) => (
                  <pre
                    className="p-4 rounded-lg bg-gray-800/50 text-gray-100 overflow-x-auto"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm md:text-base font-light whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  )
}
