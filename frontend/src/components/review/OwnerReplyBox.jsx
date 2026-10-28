import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import Button from "../ui/Button";
import { useReplyToReview } from "../../hooks/useReviewMutations";

export default function OwnerReplyBox({ review }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const reply = useReplyToReview();

  const hasReply = !!review.ownerReply?.text;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a reply");
      return;
    }
    setError("");
    try {
      await reply.mutateAsync({ id: review._id, text: text.trim() });
      setText("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to post reply"
      );
    }
  };

  if (hasReply) {
    return (
      <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
        <div className="flex items-center gap-1.5 mb-1">
          <MessageCircle className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-semibold text-orange-600">
            Your response
          </span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {review.ownerReply.text}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(review.ownerReply.repliedAt).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Thank the customer or address their feedback..."
        maxLength={500}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" size="sm" disabled={reply.isPending}>
        {reply.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
        Post reply
      </Button>
    </form>
  );
}