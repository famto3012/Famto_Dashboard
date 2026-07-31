import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { whatsappApi } from "@/api/whatsapp/whatsappApi";
import { WHATSAPP_QUERY_KEYS } from "@/utils/whatsapp/formatters";
import createApiClient from "@/api/apiClient";

export const useWhatsappContactTags = () => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["whatsapp", "contacts", "tags"],
    queryFn: () => whatsappApi.contactTags(navigate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useWhatsappContacts = (filters = {}) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.contacts(filters),
    queryFn: () => whatsappApi.contacts(navigate, filters),
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });
};

export const useImportWhatsappContactsCsv = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => whatsappApi.importContactsCsv(navigate, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp", "contacts"] });
    },
  });
};

export const useSyncFromFamtoCustomers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => whatsappApi.syncFromFamtoCustomers(navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp", "contacts"] });
    },
  });
};

export const useWhatsappCampaigns = () => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.campaigns,
    queryFn: () => whatsappApi.campaigns(navigate),
    staleTime: 60 * 1000,
  });
};

export const useCreateWhatsappCampaign = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => whatsappApi.createCampaign(navigate, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.campaigns });
      queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.analytics() });
    },
  });
};

export const useSendWhatsappCampaign = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId) =>
      createApiClient(navigate).post(`/whatsapp/campaigns/${campaignId}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.campaigns });
    },
  });
};

export const useWhatsappTemplates = (filters = {}) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.templates(filters),
    queryFn: () => whatsappApi.templates(navigate, filters),
    staleTime: 60 * 1000,
  });
};

export const useSyncWhatsappTemplates = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => whatsappApi.syncTemplates(navigate),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["whatsapp", "templates"] }),
  });
};

export const useWhatsappAnalytics = (range = "7d") => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.analytics(range),
    queryFn: () => whatsappApi.analytics(navigate, { range }),
    staleTime: 2 * 60 * 1000,
  });
};

export const useWhatsappWallet = () => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.wallet,
    queryFn: () => whatsappApi.wallet(navigate),
    staleTime: 60 * 1000,
  });
};

export const useRechargeWhatsappWallet = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => whatsappApi.rechargeWallet(navigate, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.wallet }),
  });
};

export const useWhatsappBusinessProfile = () => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.profile,
    queryFn: () => whatsappApi.businessProfile(navigate),
    staleTime: 60 * 1000,
  });
};

export const useUpdateWhatsappBusinessProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => whatsappApi.updateBusinessProfile(navigate, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.profile }),
  });
};
