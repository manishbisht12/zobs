"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "@/utils/api";
import {
  Search,
  MessageCircle,
  Send,
  Paperclip,
  FileText,
  Phone,
  Mail,
  MoreVertical,
  CircleDot,
  X,
  Loader2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_BASE.replace(/\/api$/, "");

const avatarPalette = [
  "bg-amber-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-500",
];

const normalizeThread = (thread, index = 0) => ({
  applicantId: thread.applicantId?.toString?.() || thread.applicantId,
  applicantName: thread.applicantName || "Applicant",
  applicantEmail: thread.applicantEmail || "",
  lastMessage: thread.lastMessage || "",
  lastMessageAt: thread.lastMessageAt || new Date().toISOString(),
  unreadCount: thread.unreadCount || 0,
  avatarColor: avatarPalette[index % avatarPalette.length],
});

const normalizeMessage = (message) => {
  if (!message) return null;
  const id = message._id || message.id || `local-${Date.now()}`;
  return {
    id: id.toString(),
    body: message.body || message.text || "",
    senderType: message.senderType || 'employer',
    createdAt: message.createdAt || new Date().toISOString(),
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
  };
};

const formatRelativeTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
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

const ThreadListItem = ({ thread, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full rounded-xl border p-4 text-left transition ${
      isActive ? "border-gray-900 bg-gray-900/5 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:bg-white"
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold ${
            thread.avatarColor || "bg-gray-400"
          }`}
        >
          {(thread.applicantName || "A")
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{thread.applicantName}</p>
          <p className="text-xs text-gray-500">{thread.applicantEmail}</p>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {thread.lastMessage?.trim() ? thread.lastMessage : "No messages yet"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-gray-400">{formatRelativeTime(thread.lastMessageAt)}</span>
        {thread.unreadCount > 0 && (
          <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
            {thread.unreadCount}
          </span>
        )}
      </div>
    </div>
  </button>
);

const MessageBubble = ({ message }) => {
  const isEmployer = message.senderType === "employer";
  const timestamp = new Date(message.createdAt).toLocaleString();
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-4 ${
        isEmployer
          ? "ml-auto max-w-xl border-gray-900 bg-gray-900 text-white"
          : "max-w-2xl border-gray-200 bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-sm font-medium">
        <span>{isEmployer ? "You" : "Candidate"}</span>
        <span className={isEmployer ? "text-gray-300" : "text-gray-500"}>{timestamp}</span>
      </div>
      <p className="whitespace-pre-line text-sm leading-6">{message.body}</p>
      {message.attachments.length > 0 && (
        <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {message.attachments.map((file, idx) => (
            <button
              key={`${message.id}-att-${idx}`}
              className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-gray-300 hover:bg-white transition"
            >
              <FileText className="h-4 w-4" />
              <span>{file.name || file.label || `Attachment ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EmployerMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState("");

  const [messagesByApplicant, setMessagesByApplicant] = useState({});
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [activeApplicantId, setActiveApplicantId] = useState(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [applicants, setApplicants] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const socketRef = useRef(null);
  const activeApplicantRef = useRef(null);

  useEffect(() => {
    activeApplicantRef.current = activeApplicantId;
  }, [activeApplicantId]);

  useEffect(() => {
    const fetchThreads = async () => {
      setThreadsLoading(true);
      setThreadsError("");
      try {
        const { data } = await api.get('/employer/messages/threads');
        const list = (data?.data?.threads || []).map((thread, index) => normalizeThread(thread, index));
        setThreads(list);
        if (!activeApplicantRef.current && list.length > 0) {
          setActiveApplicantId(list[0].applicantId);
        }
      } catch (error) {
        setThreadsError(error.response?.data?.message || error.message || 'Unable to load conversations.');
      } finally {
        setThreadsLoading(false);
      }
    };

    const fetchApplicants = async () => {
      try {
        const { data } = await api.get('/employer/applications/applicants');
        const list = data?.data?.applicants || [];
        const normalized = list.map((applicant, index) => ({
          id: applicant.applicantId || applicant.applicantEmail || `applicant-${index}`,
          name: applicant.applicantName || 'Applicant',
          email: applicant.applicantEmail || '',
          phone: applicant.applicantPhone || '',
          avatarColor: avatarPalette[index % avatarPalette.length],
          latestJobTitle: applicant.stats?.latestJobTitle || '',
          stats: applicant.stats || {},
          lastAppliedAt: applicant.lastAppliedAt || null,
        }));
        setApplicants(normalized);
      } catch (error) {
        console.error('Failed to load applicants', error);
      }
    };

    fetchThreads();
    fetchApplicants();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token,
        role: 'employer',
      },
    });
    socketRef.current = socket;

    const handleIncomingMessage = ({ message, applicantId, context = {} }) => {
      const normalized = normalizeMessage(message);
      if (!normalized || !applicantId) return;
      const key = applicantId.toString();

      setMessagesByApplicant((prev) => {
        const existing = prev[key] || [];
        const exists = existing.some((entry) => entry.id === normalized.id);
        if (exists) return prev;
        return {
          ...prev,
          [key]: [...existing, normalized],
        };
      });

      setThreads((prev) => {
        const idx = prev.findIndex((thread) => thread.applicantId === key);
        const base = idx >= 0 ? prev[idx] : normalizeThread({ applicantId: key, ...context }, prev.length);
        const unread = normalized.senderType === 'applicant' && activeApplicantRef.current !== key
          ? (base.unreadCount || 0) + 1
          : 0;
        const merged = {
          ...base,
          applicantName: context.applicantName || base.applicantName,
          applicantEmail: context.applicantEmail || base.applicantEmail,
          lastMessage: normalized.body,
          lastMessageAt: normalized.createdAt,
          unreadCount: unread,
        };
        const next = idx >= 0 ? [...prev] : [...prev, merged];
        if (idx >= 0) {
          next[idx] = merged;
        } else {
          next[next.length - 1] = merged;
        }
        return next.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    const handleConversationUpdate = (summary) => {
      if (!summary?.applicantId) return;
      const key = summary.applicantId.toString();
      setThreads((prev) => {
        const idx = prev.findIndex((thread) => thread.applicantId === key);
        const base = idx >= 0 ? prev[idx] : normalizeThread(summary, prev.length);
        const unread = summary.senderType === 'applicant' && activeApplicantRef.current !== key
          ? (base.unreadCount || 0) + 1
          : 0;
        const merged = {
          ...base,
          applicantName: summary.applicantName || base.applicantName,
          applicantEmail: summary.applicantEmail || base.applicantEmail,
          lastMessage: summary.lastMessage || base.lastMessage,
          lastMessageAt: summary.lastMessageAt || base.lastMessageAt,
          unreadCount: unread,
        };
        const next = idx >= 0 ? [...prev] : [...prev, merged];
        if (idx >= 0) {
          next[idx] = merged;
        } else {
          next[next.length - 1] = merged;
        }
        return next.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    socket.on('message:new', handleIncomingMessage);
    socket.on('conversation:updated', handleConversationUpdate);
    socket.on('connect_error', (err) => {
      console.error('Socket error:', err.message);
    });

    return () => {
      socket.off('message:new', handleIncomingMessage);
      socket.off('conversation:updated', handleConversationUpdate);
      socket.disconnect();
    };
  }, []);

  const fetchConversation = async (applicantId) => {
    if (!applicantId) return;
    setMessagesLoading(true);
    try {
      const { data } = await api.get('/employer/messages/conversation', {
        params: { applicantId },
      });
      const messages = (data?.data?.messages || []).map(normalizeMessage);
      setMessagesByApplicant((prev) => ({
        ...prev,
        [applicantId]: messages,
      }));
      setThreads((prev) =>
        prev.map((thread) =>
          thread.applicantId === applicantId
            ? {
                ...thread,
                unreadCount: 0,
                lastMessage: messages[messages.length - 1]?.body || thread.lastMessage,
                lastMessageAt: messages[messages.length - 1]?.createdAt || thread.lastMessageAt,
              }
            : thread
        )
      );
    } catch (error) {
      console.error('Failed to load conversation', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (!activeApplicantId) return;
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', { applicantId: activeApplicantId });
    }
    if (!messagesByApplicant[activeApplicantId]) {
      fetchConversation(activeApplicantId);
    } else {
      setThreads((prev) =>
        prev.map((thread) =>
          thread.applicantId === activeApplicantId ? { ...thread, unreadCount: 0 } : thread
        )
      );
    }
  }, [activeApplicantId, messagesByApplicant]);

  const filteredThreads = useMemo(() => {
    if (!searchTerm.trim()) return threads;
    const term = searchTerm.toLowerCase();
    return threads.filter(
      (thread) =>
        thread.applicantName.toLowerCase().includes(term) ||
        thread.applicantEmail.toLowerCase().includes(term) ||
        (thread.lastMessage || '').toLowerCase().includes(term)
    );
  }, [threads, searchTerm]);

  const candidateOptions = useMemo(() => {
    if (!candidateSearch.trim()) return applicants;
    const term = candidateSearch.toLowerCase();
    return applicants.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term) ||
        (candidate.latestJobTitle || '').toLowerCase().includes(term)
    );
  }, [applicants, candidateSearch]);

  const activeMessages = activeApplicantId ? messagesByApplicant[activeApplicantId] || [] : [];

  const handleSendMessage = async () => {
    if (!activeApplicantId || !messageDraft.trim()) return;

    setSendLoading(true);
    const trimmed = messageDraft.trim();

    try {
      const { data } = await api.post('/employer/messages', {
        applicantId: activeApplicantId,
        message: trimmed,
      });

      const saved = normalizeMessage(data?.data?.message);
      const fallback = normalizeMessage({
        id: `local-${Date.now()}`,
        body: trimmed,
        senderType: 'employer',
        createdAt: new Date().toISOString(),
      });
      const appended = saved || fallback;

      setMessagesByApplicant((prev) => {
        const existing = prev[activeApplicantId] || [];
        const exists = existing.some((entry) => entry.id === appended.id);
        return {
          ...prev,
          [activeApplicantId]: exists ? existing : [...existing, appended],
        };
      });

      setThreads((prev) =>
        prev
          .map((thread) =>
            thread.applicantId === activeApplicantId
              ? {
                  ...thread,
                  lastMessage: appended.body,
                  lastMessageAt: appended.createdAt,
                  unreadCount: 0,
                }
              : thread
          )
          .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      );

      setMessageDraft("");
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSendLoading(false);
    }
  };

  const isSendDisabled = !messageDraft.trim() || !activeApplicantId || sendLoading;

  const handleCandidateSelection = (candidate) => {
    if (!candidate) return;
    const identifier = candidate.id?.toString?.() || candidate.id;
    if (!identifier) return;

    setThreads((prev) => {
      const exists = prev.some((thread) => thread.applicantId === identifier);
      if (exists) return prev;
      const placeholder = normalizeThread(
        {
          applicantId: identifier,
          applicantName: candidate.name,
          applicantEmail: candidate.email,
          lastMessage: "",
          lastMessageAt: new Date().toISOString(),
        },
        prev.length
      );
      return [placeholder, ...prev];
    });

    setActiveApplicantId(identifier);
    setModalOpen(false);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-gray-600">Manage your conversations with candidates in real time.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <MessageCircle className="h-4 w-4" />
          New Conversation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
            <div className="max-h-[32rem] space-y-3 overflow-y-auto p-3">
              {threadsLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-6 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading conversations...
                </div>
              ) : threadsError ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-red-600">
                  {threadsError}
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  No conversations yet. Start one from the button above.
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <ThreadListItem
                    key={thread.applicantId}
                    thread={thread}
                    isActive={thread.applicantId === activeApplicantId}
                    onSelect={() => setActiveApplicantId(thread.applicantId)}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">
          {activeApplicantId ? (
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
              <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
                {(() => {
                  const thread = threads.find((item) => item.applicantId === activeApplicantId);
                  if (!thread) return null;
                  return (
                    <>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold ${
                            thread.avatarColor || "bg-gray-400"
                          }`}
                        >
                          {(thread.applicantName || "A")
                            .split(" ")
                            .map((n) => n.charAt(0))
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{thread.applicantName}</p>
                          <p className="text-xs text-gray-500">{thread.applicantEmail}</p>
                        </div>
                      </div>
                      <button className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </>
                  );
                })()}
              </header>

              <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 px-6 py-6">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-600">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading conversation...
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-lg font-semibold text-gray-900">Start the conversation</p>
                    <p className="mt-1 max-w-md text-sm text-gray-500">
                      Send a message to introduce yourself, share next steps, or follow up on an application.
                    </p>
                  </div>
                ) : (
                  activeMessages.map((message) => <MessageBubble key={message.id} message={message} />)
                )}
              </div>

              <footer className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-900 focus-within:bg-white focus-within:shadow-md">
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
                    className="flex-1 resize-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 transition" title="Attach file (coming soon)">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={isSendDisabled}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition ${
                        isSendDisabled ? "cursor-not-allowed bg-gray-200 text-gray-500" : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      {sendLoading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <CircleDot className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-semibold text-gray-900">Select a conversation</p>
              <p className="mt-1 max-w-md text-sm text-gray-500">
                Choose a candidate from the list to view your conversation history and send messages.
              </p>
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Start a new conversation</h2>
                <p className="text-sm text-gray-500">Choose an applicant to begin chatting.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={candidateSearch}
                  onChange={(event) => setCandidateSearch(event.target.value)}
                  placeholder="Search applicants..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto px-6 py-4">
              {candidateOptions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  No applicants found.
                </div>
              ) : (
                candidateOptions.map((candidate, index) => {
                  const hasConversation = threads.some(
                    (thread) => thread.applicantId === candidate.id
                  );
                  const initials = candidate.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const roleDisplay = candidate.latestJobTitle || "Applicant";
                  const totalApplications = candidate.stats?.total ?? 0;
                  const recentApplied = candidate.lastAppliedAt
                    ? formatRelativeTime(candidate.lastAppliedAt)
                    : null;

                  return (
                    <button
                      key={`${candidate.id}-${index}`}
                      onClick={() => handleCandidateSelection(candidate)}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-gray-900 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-white font-semibold ${
                            candidate.avatarColor || avatarPalette[index % avatarPalette.length]
                          }`}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                          <p className="text-xs text-gray-500">{roleDisplay}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                            <span>{totalApplications} application{totalApplications === 1 ? "" : "s"}</span>
                            {recentApplied && <span>• Last applied {recentApplied}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        {hasConversation ? (
                          <>
                            <MessageCircle className="h-4 w-4" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Start
                          </>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


