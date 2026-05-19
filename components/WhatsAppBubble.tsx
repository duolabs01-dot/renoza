import { MessageCircle, Send } from "lucide-react";
import CopyButton from "./CopyButton";

export default function WhatsAppBubble({
  text,
  compact = false,
}: {
  text: string;
  compact?: boolean;
}) {
  const sendUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-white">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="text-sm font-bold text-charcoal">WhatsApp brief</span>
      </div>
      <div className={`whatsapp-bubble whitespace-pre-wrap p-4 text-sm leading-7 ${compact ? "max-h-56 overflow-hidden" : ""}`}>
        {text}
        <span className="mt-2 block text-right text-[11px] text-white/58">09:41</span>
      </div>
      {!compact ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={sendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#1ebe57]"
          >
            <Send className="h-4 w-4" />
            Send on WhatsApp
          </a>
          <CopyButton text={text} label="Copy brief" />
        </div>
      ) : null}
    </div>
  );
}
