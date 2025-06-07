"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Search, Paperclip, MapPin, Upload, Globe, Mic, Send, MoreHorizontal, Share, ThumbsUp, ThumbsDown, Copy, Bookmark, Plus } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url: string;
    domain: string;
    favicon?: string;
  }>;
  relatedQuestions?: string[];
}

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 25, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-gray-400">|</span>
      )}
    </span>
  );
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeSuggestions = [
    "Stance Analysis",
    "Sentiment Analysis", 
    "Find",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowWelcome(false);

    // Simulate AI response delay
    setTimeout(() => {
      const mockResponse = generateMockResponse(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: mockResponse.content,
        timestamp: new Date(),
        sources: mockResponse.sources,
        relatedQuestions: mockResponse.relatedQuestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (query: string) => {
    const responses = {
      content: `**${query}** is a comprehensive topic that involves multiple analytical approaches and methodologies. Let me break this down systematically:

## Definition and Key Concepts

**Stance analysis** —often referred to as *stance detection* —is the process of identifying the position or attitude that a speaker or writer expresses toward a specific proposition, topic, or target within a text. This position can be categorized as *in favor*, *against*, or *neutral* regarding the given target.

## What Is Stance?

• Stance is defined as an individual's "attitudes, feelings, judgments, or commitment" to a proposition.

• It reflects how someone would answer a specific question or proposition, which is not necessarily tied to the emotional tone (sentiment) of the statement.

• For example, "I'm voting for Joe Biden" expresses a stance (support for Biden) but does not necessarily convey positive or negative sentiment.

## Stance vs. Sentiment

• **Stance** refers to the position toward a specific target or proposition (support, opposition, or neutrality).

• **Sentiment** refers to the emotional valence (positive, negative, or neutral) of the text.

• These are related but distinct: a positive sentiment can express a negative stance toward a target, and vice versa. For instance, "So excited to see Trump out of the White House!" carries positive sentiment but expresses a negative stance toward Trump.

## Summary

Stance analysis is a nuanced task that goes beyond sentiment analysis by focusing on the specific position expressed toward a target, regardless of the emotional tone. It is widely used in political science, social media research, and misinformation detection, and requires careful consideration of both the text and its context for accurate interpretation.`,
      sources: [
        {
          title: 'Stance detection: a practical guide to...',
          url: 'https://cambridge.org/core',
          domain: 'Cambridge Core',
          favicon: '🎓'
        },
        {
          title: 'Stance (linguistics) - Wikipedia',
          url: 'https://en.wikipedia.org',
          domain: 'en.wikipedia',
          favicon: 'W'
        },
        {
          title: 'A Tutorial on Stance Detection - Association for...',
          url: 'https://dl.acm.org',
          domain: 'dl.acm',
          favicon: '📚'
        },
        {
          title: 'Stance Detection | Papers With Code',
          url: 'https://paperswithcode.com',
          domain: 'paperswithcode',
          favicon: '📄'
        }
      ],
      relatedQuestions: [
        "How does stance detection differentiate from sentiment analysis in political texts",
        "What are the main methods used for stance detection in social media analysis",
        "How can textual entailment be applied to identify support or opposition in a document",
        "Why is it important to distinguish between attitude and sentiment when analyzing beliefs"
      ]
    };

    return responses;
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {showWelcome && messages.length === 0 ? (
        /* Welcome Screen - Exact Perplexity Style */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-4xl font-light text-white tracking-wide">thinkFi ai</h1>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-2xl mb-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative bg-[#2a2a2a] rounded-xl border border-gray-700/50 focus-within:border-gray-600 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-4 pr-16 focus:outline-none text-lg"
                />
                
                {/* Input Icons */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bottom Row Icons */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="p-2 bg-[#20b2aa] hover:bg-[#1a9b94] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Suggestion Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {welcomeSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full text-sm transition-colors border border-gray-700/50 hover:border-gray-600/50"
              >
                <span className="mr-2">🔍</span>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-light">Stance Analysis</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <span className="w-4 h-4 bg-[#20b2aa] rounded-sm flex items-center justify-center text-xs">🔍</span>
                  <span>thinkFi ai</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🔗</span>
                  <span>Sources</span>
                  <span className="bg-gray-700 px-1 rounded text-xs">7</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⚙️</span>
                  <span>Tasks</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5 text-gray-400" />
              </button>
              <button className="px-3 py-1 bg-[#20b2aa] hover:bg-[#1a9b94] rounded-lg text-sm transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Sources Section */}
              <div className="mb-8">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { title: 'Stance detection: a practical guide to...', domain: 'Cambridge Core', icon: '🎓' },
                    { title: 'Stance (linguistics) - Wikipedia', domain: 'en.wikipedia', icon: 'W' },
                    { title: 'A Tutorial on Stance Detection - Association for...', domain: 'dl.acm', icon: '📚' },
                    { title: 'Stance Detection | Papers With Code', domain: 'paperswithcode', icon: '📄' }
                  ].map((source, idx) => (
                    <div key={idx} className="p-3 bg-[#2a2a2a] rounded-lg border border-gray-700/50">
                      <div className="flex items-start space-x-2">
                        <span className="text-sm">{source.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{source.title}</p>
                          <p className="text-xs text-gray-400">{source.domain}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="prose prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-6">Stance Analysis: Definition and Key Concepts</h1>
                
                {isTyping ? (
                  <div className="text-gray-300">
                    <TypingEffect 
                      text={`**Stance analysis** —often referred to as *stance detection* —is the process of identifying the position or attitude that a speaker or writer expresses toward a specific proposition, topic, or target within a text. This position can be categorized as *in favor*, *against*, or *neutral* regarding the given target.

## What Is Stance?

• Stance is defined as an individual's "attitudes, feelings, judgments, or commitment" to a proposition.

• It reflects how someone would answer a specific question or proposition, which is not necessarily tied to the emotional tone (sentiment) of the statement.

• For example, "I'm voting for Joe Biden" expresses a stance (support for Biden) but does not necessarily convey positive or negative sentiment.

## Stance vs. Sentiment

• **Stance** refers to the position toward a specific target or proposition (support, opposition, or neutrality).

• **Sentiment** refers to the emotional valence (positive, negative, or neutral) of the text.

• These are related but distinct: a positive sentiment can express a negative stance toward a target, and vice versa. For instance, "So excited to see Trump out of the White House!" carries positive sentiment but expresses a negative stance toward Trump.`}
                      speed={20}
                      onComplete={() => setIsTyping(false)}
                    />
                  </div>
                ) : (
                  <div className="text-gray-300 space-y-6">
                    <p>
                      <strong>Stance analysis</strong> —often referred to as <em>stance detection</em> —is the process of identifying the position or attitude that a speaker or writer expresses toward a specific proposition, topic, or target within a text. This position can be categorized as <em>in favor</em>, <em>against</em>, or <em>neutral</em> regarding the given target.
                    </p>

                    <h2 className="text-xl font-semibold text-white">What Is Stance?</h2>
                    <ul className="space-y-2">
                      <li>Stance is defined as an individual's "attitudes, feelings, judgments, or commitment" to a proposition.</li>
                      <li>It reflects how someone would answer a specific question or proposition, which is not necessarily tied to the emotional tone (sentiment) of the statement.</li>
                      <li>For example, "I'm voting for Joe Biden" expresses a stance (support for Biden) but does not necessarily convey positive or negative sentiment.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white">Stance vs. Sentiment</h2>
                    <ul className="space-y-2">
                      <li><strong>Stance</strong> refers to the position toward a specific target or proposition (support, opposition, or neutrality).</li>
                      <li><strong>Sentiment</strong> refers to the emotional valence (positive, negative, or neutral) of the text.</li>
                      <li>These are related but distinct: a positive sentiment can express a negative stance toward a target, and vice versa. For instance, "So excited to see Trump out of the White House!" carries positive sentiment but expresses a negative stance toward Trump.</li>
                    </ul>
                  </div>
                )}

                {!isTyping && (
                  <>
                    {/* Comparison Table */}
                    <div className="my-8 overflow-x-auto">
                      <table className="w-full border border-gray-700 rounded-lg">
                        <thead>
                          <tr className="bg-[#2a2a2a]">
                            <th className="px-4 py-3 text-left border-r border-gray-700">Aspect</th>
                            <th className="px-4 py-3 text-left border-r border-gray-700">Stance Analysis</th>
                            <th className="px-4 py-3 text-left">Sentiment Analysis</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-700">
                            <td className="px-4 py-3 border-r border-gray-700">Focus</td>
                            <td className="px-4 py-3 border-r border-gray-700">Position towards a specific target/proposition</td>
                            <td className="px-4 py-3">Emotional tone (positive/negative)</td>
                          </tr>
                          <tr className="border-t border-gray-700">
                            <td className="px-4 py-3 border-r border-gray-700">Target Requirements</td>
                            <td className="px-4 py-3 border-r border-gray-700">yes (explicit or implicit)</td>
                            <td className="px-4 py-3">not always (can be general)</td>
                          </tr>
                          <tr className="border-t border-gray-700">
                            <td className="px-4 py-3 border-r border-gray-700">Example Output</td>
                            <td className="px-4 py-3 border-r border-gray-700">Favor, Against, Neutral</td>
                            <td className="px-4 py-3">Positive, Negative, Neutral</td>
                          </tr>
                          <tr className="border-t border-gray-700">
                            <td className="px-4 py-3 border-r border-gray-700">Example</td>
                            <td className="px-4 py-3 border-r border-gray-700">"Jeb Bush is the only sane candidate..." (Against Trump)</td>
                            <td className="px-4 py-3">"I love this!" (Positive sentiment)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Summary */}
                    <h2 className="text-xl font-semibold text-white">Summary</h2>
                    <p>
                      Stance analysis is a nuanced task that goes beyond sentiment analysis by focusing on the specific position expressed toward a target, regardless of the emotional tone. It is widely used in political science, social media research, and misinformation detection, and requires careful consideration of both the text and its context for accurate interpretation.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 my-6">
                      <button className="flex items-center space-x-2 px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors">
                        <Share className="w-4 h-4" />
                        <span>Share it</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors">
                        <span>📄</span>
                        <span>export</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors">
                        <span>✏️</span>
                        <span>rewrite</span>
                      </button>
                      <div className="flex items-center space-x-2 ml-auto">
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          <ThumbsUp className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          <ThumbsDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Connected Section */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">≡</span>
                        Connected
                      </h3>
                      <div className="space-y-3">
                        {[
                          "How does stance detection differentiate from sentiment analysis in political texts",
                          "What are the main methods used for stance detection in social media analysis",
                          "How can textual entailment be applied to identify support or opposition in a document",
                          "Why is it important to distinguish between attitude and sentiment when analyzing beliefs"
                        ].map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(question)}
                            className="flex items-center justify-between w-full text-left p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors group"
                          >
                            <span className="text-gray-300">{question}</span>
                            <Plus className="w-4 h-4 text-[#20b2aa] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center space-x-3 bg-[#2a2a2a] rounded-xl border border-gray-700/50 focus-within:border-gray-600 transition-colors">
                  <button type="button" className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-3 text-gray-400 hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ask anything..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none py-3"
                    disabled={isTyping}
                  />
                  
                  <div className="flex items-center space-x-2 pr-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Upload className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 bg-[#20b2aa] hover:bg-[#1a9b94] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;