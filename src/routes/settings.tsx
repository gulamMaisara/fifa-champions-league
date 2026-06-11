import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCurrentPlayer } from "@/lib/current-player";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Scoring — FIFA Fantasy" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const player = useCurrentPlayer();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["scoring"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scoring_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({
    win_points: 3,
    draw_points: 1,
    loss_points: -1,
    not_played_points: 0,
    max_not_played: 2,
  });

  useEffect(() => {
    if (q.data)
      setForm({
        win_points: q.data.win_points,
        draw_points: q.data.draw_points,
        loss_points: q.data.loss_points,
        not_played_points: q.data.not_played_points,
        max_not_played: q.data.max_not_played,
      });
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("scoring_settings").update(form).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Scoring updated");
      qc.invalidateQueries({ queryKey: ["scoring"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (player?.name !== "Abir") {
    return (
      <div className="max-w-2xl space-y-6 text-center py-12">
        <h1 className="display text-4xl text-neon">Access Denied</h1>
        <p className="text-muted-foreground">Only Abir can adjust scoring settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="display text-4xl">Scoring</h1>
        <p className="text-sm text-muted-foreground">
          Tweak how points are awarded. Affects the leaderboard immediately.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <NumberInput
          label="Win points"
          value={form.win_points}
          onChange={(v) => setForm({ ...form, win_points: v })}
        />
        <NumberInput
          label="Draw points"
          value={form.draw_points}
          onChange={(v) => setForm({ ...form, draw_points: v })}
        />
        <NumberInput
          label="Loss points"
          value={form.loss_points}
          onChange={(v) => setForm({ ...form, loss_points: v })}
        />
        <NumberInput
          label="Not-played points"
          value={form.not_played_points}
          onChange={(v) => setForm({ ...form, not_played_points: v })}
        />
        <NumberInput
          label="Max not-played per player"
          value={form.max_not_played}
          onChange={(v) => setForm({ ...form, max_not_played: v })}
          min={0}
        />
        <div className="flex justify-end">
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="rounded-md bg-neon px-5 py-2 font-semibold text-primary-foreground glow-neon disabled:opacity-60"
          >
            {save.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(parseInt(e.target.value || "0", 10))}
        className="w-28 rounded-md border border-border bg-input px-3 py-2 text-right"
      />
    </div>
  );
}
