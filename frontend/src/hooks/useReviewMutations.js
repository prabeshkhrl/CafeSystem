import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "../lib/toast";

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/reviews", payload);
      return data.data;
    },
    onSuccess: (review) => {
      qc.invalidateQueries({ queryKey: ["reviews", review.restaurantId] });
      qc.invalidateQueries({ queryKey: ["order", review.orderId] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["restaurant", review.restaurantId] });
      qc.invalidateQueries({ queryKey: ["dashboard-reviews"] });
      toast.success("Thanks for your review!");
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/reviews/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      toast.success("Review updated");
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/reviews/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
      qc.invalidateQueries({ queryKey: ["restaurant"] });
      qc.invalidateQueries({ queryKey: ["dashboard-reviews"] });
      toast.success("Review deleted");
    },
  });
}

export function useReplyToReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, text }) => {
      const { data } = await api.patch(`/reviews/${id}/reply`, { text });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["dashboard-reviews"] });
      toast.success("Reply posted");
    },
  });
}