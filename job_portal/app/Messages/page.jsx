"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { MessageCircle, Search, Send, Paperclip, Loader2, FileText, X } from "lucide-react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_BASE.replace(/\/api$/, "");
const resolveAttachmentUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${SOCKET_URL}${url}`;
};

const formatRelativeTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return date.toLocaleString();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
};

const ThreadListItem = ({ thread, isActive, onSelect, isOnline }) => (
  <button
    onClick={onSelect}
    className={`w-full rounded-xl border p-4 text-left transition ${
      isActive ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-gray-300 hover:bg-white"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{thread.employerName || "Employer"}</p>
          {isOnline && (
            <span className="inline-flex items-center" aria-label="Online">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{thread.lastMessage || "No messages yet"}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-400">{formatRelativeTime(thread.lastMessageAt)}</span>
        {thread.unreadCount > 0 && (
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
            {thread.unreadCount}
          </span>
        )}
      </div>
    </div>
  </button>
);

const MessageBubble = ({ message }) => {
  const isApplicant = message.senderType === "applicant";
  const timestamp = new Date(message.createdAt).toLocaleString();

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-4 ${
        isApplicant
          ? "ml-auto max-w-xl border-indigo-600 bg-indigo-600 text-white"
          : "max-w-2xl border-gray-200 bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-sm font-medium">
        <span>{isApplicant ? "You" : "Employer"}</span>
        <span className={isApplicant ? "text-indigo-100" : "text-gray-500"}>{timestamp}</span>
      </div>
      <p className="whitespace-pre-line text-sm leading-6">{message.body}</p>
      {message.attachments.length > 0 && (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900/90">
          {message.attachments.map((file, idx) => {
            const href = resolveAttachmentUrl(file.url);
            return (
              <a
                key={`${message._id}-att-${idx}`}
                href={href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-indigo-200 hover:bg-white transition"
              >
                <Paperclip className="h-4 w-4" />
                <span className="max-w-[200px] truncate">{file.name || file.label || `Attachment ${idx + 1}`}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

const normalizeMessage = (message) => {
  if (!message) return null;
  const id = message._id || message.id || `temp-${Date.now()}`;
  return {
    _id: id.toString(),
    employer: message.employer?.toString?.() ?? message.employer ?? null,
    applicant: message.applicant?.toString?.() ?? message.applicant ?? null,
    job: message.job ? message.job.toString() : message.job ?? null,
    senderType: message.senderType || 'employer',
    senderId: message.senderId?.toString?.() ?? message.senderId ?? null,
    body: message.body || '',
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    createdAt: message.createdAt || new Date().toISOString(),
    updatedAt: message.updatedAt || message.createdAt || new Date().toISOString(),
  };
};

const MessagesContent = ({ user, apiClient = api }) => {
  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState("");

  const [messagesByEmployer, setMessagesByEmployer] = useState({});
  const [conversationLoading, setConversationLoading] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  const [messageDraft, setMessageDraft] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineEmployers, setOnlineEmployers] = useState(() => new Set());

  const socketRef = useRef(null);
  const selectedEmployerRef = useRef(null);
  const threadsRef = useRef(threads);
  const messagesRef = useRef(messagesByEmployer);
  const fileInputRef = useRef(null);

  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  useEffect(() => {
    selectedEmployerRef.current = selectedEmployerId;
  }, [selectedEmployerId]);

  useEffect(() => {
    messagesRef.current = messagesByEmployer;
  }, [messagesByEmployer]);

  const updateThreadMeta = (employerId, updates = {}) => {
    const key = employerId?.toString?.() || employerId;
    setThreads((prev) => {
      const index = prev.findIndex((thread) => thread.employerId === key);
      const base = index >= 0 ? prev[index] : { employerId: key };
      const incrementUnread = updates.incrementUnread ? 1 : 0;
      const resetUnread = updates.resetUnread ?? false;
      const unreadCount = resetUnread
        ? 0
        : incrementUnread
        ? (base.unreadCount || 0) + incrementUnread
        : base.unreadCount || 0;

      const merged = {
        employerId: key,
        employerName: updates.employerName ?? base.employerName ?? "Employer",
        employerEmail: updates.employerEmail ?? base.employerEmail ?? "",
        lastMessage: updates.lastMessage ?? base.lastMessage ?? "",
        lastMessageAt: updates.lastMessageAt ?? base.lastMessageAt ?? new Date().toISOString(),
        unreadCount,
      };

      const next = index >= 0 ? [...prev] : [...prev, merged];
      if (index >= 0) {
        next[index] = merged;
      } else {
        next[next.length - 1] = merged;
      }

      return next.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    });
  };

  const ensureThreadExists = (summary = {}) => {
    if (!summary.employerId) return;
    const employerId = summary.employerId?.toString?.() || summary.employerId;
    if (threadsRef.current.some((thread) => thread.employerId === employerId)) return;
    updateThreadMeta(employerId, {
      employerName: summary.employerName || 'Employer',
      employerEmail: summary.employerEmail || '',
      lastMessage: summary.lastMessage || '',
      lastMessageAt: summary.lastMessageAt || new Date().toISOString(),
      incrementUnread: summary.senderType === 'employer',
      resetUnread: summary.senderType !== 'employer',
    });
  };

  const fetchThreads = async () => {
    if (!user) return;
    setThreadsLoading(true);
    setThreadsError("");

    try {
      const { data } = await apiClient.get('/messages');
      const list = (data?.data?.threads ?? []).map(normalizeThread);
      setThreads(list);
      if (list.length > 0 && !selectedEmployerRef.current) {
        setSelectedEmployerId(list[0].employerId);
      }
    } catch (error) {
      setThreadsError(
        error.response?.data?.message || error.message || 'Unable to load messages right now.'
      );
    } finally {
      setThreadsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token,
        role: 'applicant',
      },
    });
    socketRef.current = socket;

    const handleIncomingMessage = (payload) => {
      const { message, employerId, context = {} } = payload;
      if (!employerId || !message) return;

      ensureThreadExists({
        employerId,
        employerName: context.employerName,
        employerEmail: context.employerEmail,
        lastMessage: message.body,
        lastMessageAt: message.createdAt,
        senderType: message.senderType,
      });

      const normalized = normalizeMessage(message);
      if (!normalized) return;

      setMessagesByEmployer((prev) => {
        const existing = prev[employerId] || [];
        const exists = existing.some((entry) => entry._id === normalized._id);
        if (exists) return prev;
        const nextMessages = [...existing, normalized].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        return {
          ...prev,
          [employerId]: nextMessages,
        };
      });

      const key = employerId.toString();
      const incrementUnread =
        normalized.senderType === 'employer' && selectedEmployerRef.current !== key;

      updateThreadMeta(key, {
        employerName: context.employerName,
        employerEmail: context.employerEmail,
        lastMessage: normalized.body,
        lastMessageAt: normalized.createdAt,
        incrementUnread,
        resetUnread: selectedEmployerRef.current === key,
      });
    };

    const handleConversationUpdate = (summary) => {
      if (!summary?.employerId) return;
      ensureThreadExists(summary);
      const key = summary.employerId.toString();
      const incrementUnread = summary.senderType === 'employer' && selectedEmployerRef.current !== key;
      updateThreadMeta(key, {
        employerName: summary.employerName,
        employerEmail: summary.employerEmail,
        lastMessage: summary.lastMessage,
        lastMessageAt: summary.lastMessageAt,
        incrementUnread,
        resetUnread: selectedEmployerRef.current === key,
      });
    };

    const handlePresenceBootstrap = (payload = {}) => {
      if (Array.isArray(payload.employers)) {
        setOnlineEmployers(new Set(payload.employers.map((id) => id.toString())));
      }
    };

    const handlePresenceUpdate = (payload = {}) => {
      if (payload.role !== 'employer' || !payload.id) return;
      const key = payload.id.toString();
      setOnlineEmployers((prev) => {
        const next = new Set(prev);
        if (payload.online) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });
    };

    socket.on('message:new', handleIncomingMessage);
    socket.on('conversation:updated', handleConversationUpdate);
    socket.on('presence:bootstrap', handlePresenceBootstrap);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('connect_error', (err) => {
      console.error('Socket error:', err.message);
    });

    return () => {
      socket.off('message:new', handleIncomingMessage);
      socket.off('conversation:updated', handleConversationUpdate);
      socket.off('presence:bootstrap', handlePresenceBootstrap);
      socket.off('presence:update', handlePresenceUpdate);
      socket.disconnect();
    };
  }, []);

  const fetchConversation = async (employerId) => {
    if (!employerId) return;
    setConversationLoading(true);
    try {
      const { data } = await apiClient.get(`/messages/${employerId}`);
      const messages = (data?.data?.messages ?? []).map(normalizeMessage);
      setMessagesByEmployer((prev) => ({
        ...prev,
        [employerId]: messages,
      }));
      const last = messages[messages.length - 1];
      updateThreadMeta(employerId, {
        lastMessage: last?.body,
        lastMessageAt: last?.createdAt,
        resetUnread: true,
      });
    } catch (error) {
      console.error('Failed to fetch conversation', error);
    } finally {
      setConversationLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedEmployerId) return;
    updateThreadMeta(selectedEmployerId, { resetUnread: true });
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', { employerId: selectedEmployerId });
    }
    if (!messagesRef.current[selectedEmployerId]) {
      fetchConversation(selectedEmployerId);
    } else {
      const existing = messagesRef.current[selectedEmployerId];
      const last = existing[existing.length - 1];
      updateThreadMeta(selectedEmployerId, {
        lastMessage: last?.body,
        lastMessageAt: last?.createdAt,
        resetUnread: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployerId]);

  const handleSendMessage = async () => {
    if (!selectedEmployerId || (!messageDraft.trim() && !attachment)) return;

    setSendLoading(true);
    setAttachmentError("");
    const trimmed = messageDraft.trim();

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const formData = new FormData();
      if (trimmed) {
        formData.append('message', trimmed);
      }
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await fetch(`${API_BASE}/messages/${selectedEmployerId}`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to send message');
      }

      const saved = normalizeMessage(payload?.data?.message);
      const fallback = normalizeMessage({
        employer: selectedEmployerId,
        body: trimmed || (attachment ? `Attachment: ${attachment.name}` : ''),
        senderType: 'applicant',
        createdAt: new Date().toISOString(),
        attachments: attachment
          ? [
              {
                name: attachment.name,
                url: '',
                type: attachment.type,
                size: attachment.size,
              },
            ]
          : [],
      });
      const appendedMessage = saved || fallback;

      setMessagesByEmployer((prev) => {
        const existing = prev[selectedEmployerId] || [];
        const exists = existing.some((entry) => entry._id === appendedMessage._id);
        const nextMessages = exists
          ? existing
          : [...existing, appendedMessage].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        return {
          ...prev,
          [selectedEmployerId]: nextMessages,
        };
      });

      updateThreadMeta(selectedEmployerId, {
        lastMessage: appendedMessage.body,
        lastMessageAt: appendedMessage.createdAt,
        resetUnread: true,
      });

      setMessageDraft("");
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to send message', error);
      setAttachmentError(error.message || 'Failed to send message');
    } finally {
      setSendLoading(false);
    }
  };

  const filteredThreads = useMemo(() => {
    if (!searchTerm.trim()) return threads;
    const term = searchTerm.toLowerCase();
    return threads.filter(
      (thread) =>
        (thread.employerName || '').toLowerCase().includes(term) ||
        (thread.lastMessage || '').toLowerCase().includes(term)
    );
  }, [threads, searchTerm]);

  const activeMessages = selectedEmployerId
    ? messagesByEmployer[selectedEmployerId] || []
    : [];

  const isSendDisabled = (!messageDraft.trim() && !attachment) || !selectedEmployerId || sendLoading;

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAttachment(null);
      return;
    }
    setAttachment(file);
    setAttachmentError("");
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-gray-600">
              Keep track of your conversations with employers and respond to new opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search conversations"
                      className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                    />
                  </div>
                </div>

                <div className="max-h-[32rem] overflow-y-auto p-3 space-y-3">
                  {threadsLoading ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-6 text-sm text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading conversations...
                    </div>
                  ) : filteredThreads.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                      {threadsError || 'No conversations yet. Apply to jobs to start chatting with employers.'}
                    </div>
                  ) : (
                    filteredThreads.map((thread) => (
                      <ThreadListItem
                        key={thread.employerId}
                        thread={thread}
                        isActive={thread.employerId === selectedEmployerId}
                        isOnline={onlineEmployers.has(thread.employerId)}
                        onSelect={() => setSelectedEmployerId(thread.employerId)}
                      />
                    ))
                  )}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-8">
              {!selectedEmployerId ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-lg font-semibold text-gray-900">Select a conversation</p>
                  <p className="mt-1 max-w-md text-sm text-gray-500">
                    Choose an employer from the list to view the conversation history and respond to messages.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-6 py-4">
                    {(() => {
                      const thread = threads.find((item) => item.employerId === selectedEmployerId);
                      if (!thread) return null;
                      const isOnline = onlineEmployers.has(thread.employerId);
                      return (
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{thread.employerName || 'Employer'}</p>
                            {isOnline && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{thread.employerEmail}</p>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 px-6 py-6">
                    {conversationLoading ? (
                      <div className="flex h-full items-center justify-center text-sm text-gray-600">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading conversation...
                      </div>
                    ) : activeMessages.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-lg font-semibold text-gray-900">Say hello!</p>
                        <p className="mt-1 max-w-md text-sm text-gray-500">
                          Let the employer know you're excited about the role or ask any follow-up questions.
                        </p>
                      </div>
                    ) : (
                      activeMessages.map((message) => (
                        <MessageBubble key={message._id || message.id} message={message} />
                      ))
                    )}
                  </div>

                  <footer className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-indigo-600 focus-within:bg-white focus-within:shadow-md">
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleAttachmentChange}
                    />
                    <textarea
                      rows={1}
                      value={messageDraft}
                      onChange={(event) => setMessageDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full resize-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
                    />
                    {attachment && (
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="max-w-[220px] truncate">{attachment.name}</span>
                        </div>
                        <button type="button" onClick={clearAttachment} className="text-indigo-500 hover:text-indigo-700">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {attachmentError && (
                      <p className="mt-2 text-xs text-red-500">{attachmentError}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 transition"
                      title="Attach a file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={isSendDisabled}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition ${
                        isSendDisabled ? "cursor-not-allowed bg-gray-200 text-gray-500" : "bg-indigo-600 text-white hover:bg-indigo-500"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      {sendLoading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
               </footer>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/Login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MessagesContent user={user} />;
}