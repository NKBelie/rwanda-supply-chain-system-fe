"use client";
import { useState } from "react";
import { Edit2, Star, ThumbsUp, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buyerReviews, type BuyerReview, type ReviewStatus } from "./data";

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (readOnly ? value : hovered || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange?.(star)}
            className={cn("transition-transform", !readOnly && "hover:scale-110 cursor-pointer", readOnly && "cursor-default")}
          >
            <Star className={cn(sz, filled ? "fill-amber-400 text-amber-400" : "text-border")} />
          </button>
        );
      })}
    </div>
  );
}

function statusStyle(s: ReviewStatus): string {
  if (s === "Published") return "bg-emerald-500/10 text-emerald-700";
  if (s === "Pending") return "bg-amber-500/10 text-amber-700";
  return "bg-slate-500/10 text-slate-600";
}

const TABS = ["All", "Published", "Pending", "Draft"] as const;

export function ReviewsPage() {
  const [reviews, setReviews] = useState<BuyerReview[]>(buyerReviews);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [editTarget, setEditTarget] = useState<BuyerReview | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftRating, setDraftRating] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filtered = reviews.filter((r) => tab === "All" || r.status === tab);

  const avgRating = (() => {
    const published = reviews.filter((r) => r.status === "Published" && r.rating > 0);
    if (!published.length) return 0;
    return (published.reduce((s, r) => s + r.rating, 0) / published.length).toFixed(1);
  })();

  const openEdit = (r: BuyerReview) => {
    setEditTarget(r);
    setDraftTitle(r.title);
    setDraftBody(r.body);
    setDraftRating(r.rating || 0);
    setSubmitSuccess(false);
  };

  const submitReview = () => {
    if (!draftRating || !draftTitle.trim() || !draftBody.trim()) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editTarget?.id
          ? { ...r, title: draftTitle.trim(), body: draftBody.trim(), rating: draftRating, status: "Published" as ReviewStatus, date: new Date().toISOString().slice(0, 10) }
          : r
      )
    );
    setSubmitSuccess(true);
    setTimeout(() => { setEditTarget(null); setSubmitSuccess(false); }, 1500);
  };

  const markHelpful = (id: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  return (
    <>
      <PageHeader
        title="My Reviews"
        description="Rate suppliers and products to help improve the platform."
        crumbs={[{ label: "Buyer", href: "/buyer/dashboard" }, { label: "Reviews" }]}
      />
      <PageBody>
        {/* Summary */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Reviews", value: reviews.filter((r) => r.status !== "Pending").length },
            { label: "Published", value: reviews.filter((r) => r.status === "Published").length },
            { label: "Pending", value: reviews.filter((r) => r.status === "Pending").length },
            { label: "Avg. Rating", value: avgRating ? `${avgRating} ★` : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-3 text-center shadow-sm">
              <div className="text-2xl font-semibold text-foreground">{s.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pending review prompt */}
        {reviews.filter((r) => r.status === "Pending").length > 0 && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              ⭐ You have {reviews.filter((r) => r.status === "Pending").length} order{reviews.filter((r) => r.status === "Pending").length > 1 ? "s" : ""} awaiting your review.
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Your feedback helps verify product quality and builds trust on the platform.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Reviews */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-12 text-center text-muted-foreground text-sm">
            No reviews in this category.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => (
              <Card key={review.id} className="border-border/80 bg-background shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{review.product}</p>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle(review.status))}>
                          {review.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.supplier}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {review.rating > 0 && <StarRating value={review.rating} readOnly size="sm" />}
                      <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                    </div>
                  </div>

                  {review.status === "Published" && review.title ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-foreground">"{review.title}"</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => markHelpful(review.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-surface"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({review.helpful})
                        </button>
                        <button
                          onClick={() => openEdit(review)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-surface"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                  ) : review.status === "Pending" ? (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">You haven't reviewed this order yet.</p>
                      <Button size="sm" className="mt-2" onClick={() => openEdit(review)}>
                        Write a Review
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageBody>

      {/* Write/edit review modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditTarget(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {editTarget.status === "Pending" ? "Write a Review" : "Edit Review"}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{editTarget.product} · {editTarget.supplier}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">
                ✓ Review submitted! Thank you for your feedback.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Your rating *</p>
                  <StarRating value={draftRating} onChange={setDraftRating} size="lg" />
                  {draftRating > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][draftRating]}
                    </p>
                  )}
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Review title *</span>
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Summarise your experience…"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Detailed review *</span>
                  <textarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    rows={4}
                    placeholder="Describe product quality, delivery experience, supplier communication…"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </label>
                <div className="flex gap-2 justify-end pt-1">
                  <Button variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
                  <Button
                    onClick={submitReview}
                    disabled={!draftRating || !draftTitle.trim() || !draftBody.trim()}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
