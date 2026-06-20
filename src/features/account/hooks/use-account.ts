import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiClient } from "../../../shared/api/apiClient";
import { DEFAULT_PROFILE } from "../constants";
import type { AccountProfile } from "../constants";
import { toast } from "sonner";

export interface Result<T> {
  success: boolean;
  data?: T;
  statusCode?: number;
  message?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface AccountProfileResponse {
  id?: string | null;
  identityId?: string | null;
  userName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  createdAt?: string | null;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface WalletResponse {
  id: string;
  userId: string;
  balance: number;
}

export interface WalletTransactionResponse {
  id: string;
  walletId: string;
  type: number; // 1 = Topup, 2 = Payment, 3 = Refund
  status: number; // 1 = Pending, 2 = Succeeded, 3 = Failed
  amount: number;
  balanceAfter: number;
  currency: string;
  referenceType: string;
  referenceId: string;
  referenceCode: number;
  description: string;
  createdAt: string;
}

export interface WalletStatementResponse {
  walletId: string;
  userId: string;
  currentBalance: number;
  openingBalance: number;
  closingBalance: number;
  totalTopup: number;
  totalPayment: number;
  netChange: number;
  succeededTransactionCount: number;
  pendingTransactionCount: number;
  failedTransactionCount: number;
  createdAtFrom?: string;
  createdAtTo?: string;
}

async function fetchFullProfile(profile: AccountProfileResponse): Promise<AccountProfileResponse> {
  const [avatarRes, coverRes, profileRes] = await Promise.allSettled([
    apiClient.get<Result<{ url?: string | null }>>("/api/identity/users/me/images/avatar"),
    apiClient.get<Result<{ url?: string | null }>>("/api/identity/users/me/images/cover"),
    apiClient.get<Result<any>>("/api/identity/users/me/profile")
  ]);

  if (avatarRes.status === "fulfilled" && avatarRes.value.data?.success && avatarRes.value.data.data?.url) {
    profile.avatarUrl = avatarRes.value.data.data.url;
  }

  if (coverRes.status === "fulfilled" && coverRes.value.data?.success && coverRes.value.data.data?.url) {
    profile.coverUrl = coverRes.value.data.data.url;
  }

  if (typeof window !== "undefined") {
    if (profile.avatarUrl && profile.avatarUrl.includes("/local-avatar-fallback/")) {
      const localAvatar = localStorage.getItem("user_avatar_" + profile.identityId);
      if (localAvatar) {
        profile.avatarUrl = localAvatar;
      } else {
        profile.avatarUrl = "";
      }
    } else if (!profile.avatarUrl && profile.identityId) {
      const localAvatar = localStorage.getItem("user_avatar_" + profile.identityId);
      if (localAvatar) {
        profile.avatarUrl = localAvatar;
      }
    }

    if (profile.coverUrl && profile.coverUrl.includes("/local-cover-fallback/")) {
      const localCover = localStorage.getItem("user_cover_" + profile.identityId);
      if (localCover) {
        profile.coverUrl = localCover;
      } else {
        profile.coverUrl = "";
      }
    } else if (!profile.coverUrl && profile.identityId) {
      const localCover = localStorage.getItem("user_cover_" + profile.identityId);
      if (localCover) {
        profile.coverUrl = localCover;
      }
    }
  }

  if (profileRes.status === "fulfilled" && profileRes.value.data?.success && profileRes.value.data.data) {
    const details = profileRes.value.data.data;
    profile.displayName = details.displayName;
    profile.bio = details.bio;
    profile.location = details.location;
    profile.gender = details.gender;
    profile.dateOfBirth = details.dateOfBirth;
    profile.phoneNumber = details.phoneNumber;
  }

  return profile;
}

export function useAccount() {
  const [profile, setProfile] = React.useState<AccountProfile>(DEFAULT_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);

  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ["account-profile"],
    queryFn: async (): Promise<AccountProfileResponse | null> => {
      try {
        const response = await apiClient.get<Result<AccountProfileResponse>>("/api/identity/users/me");
        if (response.data && response.data.success && response.data.data) {
          return await fetchFullProfile(response.data.data);
        }
      } catch (error) {
        const apiError = error as AxiosError;
        if (apiError.response?.status === 404) {
          try {
            const syncResponse = await apiClient.post<Result<AccountProfileResponse>>("/api/identity/users/sync");
            if (syncResponse.data && syncResponse.data.success && syncResponse.data.data) {
              return await fetchFullProfile(syncResponse.data.data);
            }
          } catch (syncError) {
            console.error("Loi khi sync session nguoi dung:", syncError);
          }
          return null;
        }
        throw apiError;
      }
      return null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const { data: wallet, refetch: refetchWallet } = useQuery({
    queryKey: ["wallet", "me"],
    queryFn: async (): Promise<WalletResponse | null> => {
      const maxRetries = 5;
      const delayMs = 2000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await apiClient.get<Result<WalletResponse>>("/api/wallet/me");
          if (response.data?.success && response.data.data) {
            return response.data.data;
          }
          return null;
        } catch (error) {
          const err = error as { response?: { status?: number } };
          const status = err.response?.status;
          if (status === 404) {
            if (attempt < maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
              continue;
            } else {
              toast.error("Lỗi hệ thống: Không thể khởi tạo ví của bạn.");
            }
          }
          console.error("Loi khi lay thong tin vi:", error);
          return null;
        }
      }
      return null;
    },
    staleTime: 30 * 1000,
    retry: false,
  });

  const { data: walletTransactionsData, refetch: refetchTransactions } = useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: async (): Promise<PagedResult<WalletTransactionResponse>> => {
      try {
        const response = await apiClient.get<Result<PagedResult<WalletTransactionResponse>>>(
          "/api/wallet/me/transactions",
          {
            params: {
              page: 1,
              pageSize: 100,
            },
          }
        );
        return response.data?.data ?? { items: [], totalCount: 0, page: 1, pageSize: 100 };
      } catch (error) {
        console.error("Loi khi lay giao dich vi:", error);
        return { items: [], totalCount: 0, page: 1, pageSize: 100 };
      }
    },
    staleTime: 30 * 1000,
    retry: false,
  });

  const walletTransactions = walletTransactionsData?.items || [];

  const [statementFrom, setStatementFrom] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [statementTo, setStatementTo] = React.useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const { data: walletStatement, refetch: refetchStatement, isFetching: isFetchingStatement } = useQuery({
    queryKey: ["wallet", "statement", statementFrom, statementTo],
    queryFn: async (): Promise<WalletStatementResponse | null> => {
      try {
        const response = await apiClient.get<Result<WalletStatementResponse>>("/api/wallet/me/statement", {
          params: {
            createdAtFrom: statementFrom ? `${statementFrom}T00:00:00Z` : undefined,
            createdAtTo: statementTo ? `${statementTo}T23:59:59Z` : undefined,
          },
        });
        if (response.data?.success && response.data.data) {
          return response.data.data;
        }
        return null;
      } catch (error) {
        console.error("Loi khi lay sao ke vi:", error);
        return null;
      }
    },
    staleTime: 30 * 1000,
    retry: false,
  });

  const resetProfile = React.useCallback(() => {
    if (profileData) {
      let avatar = profileData.avatarUrl || "";
      let cover = profileData.coverUrl || "";

      if (typeof window !== "undefined" && profileData.identityId) {
        if (!avatar || avatar.includes("/local-avatar-fallback/")) {
          const localAvatar = localStorage.getItem("user_avatar_" + profileData.identityId);
          if (localAvatar) {
            avatar = localAvatar;
          } else {
            avatar = "";
          }
        }
        if (!cover || cover.includes("/local-cover-fallback/")) {
          const localCover = localStorage.getItem("user_cover_" + profileData.identityId);
          if (localCover) {
            cover = localCover;
          } else {
            cover = "";
          }
        }
      }

      setProfile({
        name: profileData.userName || profileData.email || "",
        email: profileData.email || "",
        avatar: avatar,
        joinedDate: profileData.createdAt
          ? new Date(profileData.createdAt).toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
          : "",
        displayName: profileData.displayName || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
        gender: profileData.gender || "",
        dateOfBirth: profileData.dateOfBirth || "",
        phoneNumber: profileData.phoneNumber || "",
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        cover: cover,
      });
    }
  }, [profileData]);

  React.useEffect(() => {
    if (profileData) {
      setTimeout(() => resetProfile(), 0);
      const timer = window.setTimeout(() => {
        refetchWallet();
        refetchTransactions();
        refetchStatement();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [profileData, resetProfile, refetchWallet, refetchTransactions, refetchStatement]);

  const updateProfileField = (field: keyof AccountProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return {
    profile,
    identityId: profileData?.identityId || "",
    refetchProfile,
    isEditingProfile,
    setIsEditingProfile,
    updateProfileField,
    wallet,
    walletTransactions,
    refetchWallet,
    refetchTransactions,
    statementFrom,
    setStatementFrom,
    statementTo,
    setStatementTo,
    walletStatement,
    refetchStatement,
    isFetchingStatement,
    resetProfile,
  };
}
