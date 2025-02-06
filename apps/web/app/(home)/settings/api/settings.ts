import { apiCall } from "@/services/api-service"

export interface User {
  id: string
  email: string
  tenantId?: string
  roles: string[]
  createdAt?: string
  updatedAt?: string
  name?: string
  bio?: string
  avatarUrl?: string
}

export interface UpdateProfileData {
  name?: string
  bio?: string
  avatarUrl?: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

export interface InviteUserData {
  email: string
}

export interface InviteResponse {
  message: string
  invitation: {
    email: string
    token: string
    expiresAt: string
  }
}

const realSettingsApi = {
  // Profile
  getProfile: async () => {
    const response = await apiCall<{ user: User }>("/auth/profile")
    return response.user
  },
  
  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiCall<{ user: User }>("/auth/profile", "PATCH", data)
    return response.user
  },

  // Password
  updatePassword: async (data: UpdatePasswordData) => {
    await apiCall<{ message: string }>("/auth/password", "PATCH", data)
    return null
  },

  // Team Management
  getTeamMembers: async () => {
    const response = await apiCall<{ users: User[] }>("/tenants/users")
    return response.users
  },
  
  inviteUser: async (data: InviteUserData) => {
    const response = await apiCall<InviteResponse>("/tenants/invite", "POST", data)
    return response
  },
  
  validateInvitation: async (token: string) => {
    await apiCall<void>(`/tenants/validate-invitation/${token}`)
    return null
  },
  
  acceptInvitation: async (token: string) => {
    await apiCall<void>(`/tenants/accept-invitation/${token}`, "POST")
    return null
  },

  changeUserRole: async (userId: string, newRole: "admin" | "user") => {
    await apiCall<{ message: string }>(`/tenants/users/${userId}/role`, "PATCH", { role: newRole })
    return null
  },

  removeTeamMember: async (userId: string) => {
    await apiCall<{ message: string }>(`/tenants/users/${userId}`, "DELETE")
    return null
  },

  getPendingInvitations: async () => {
    const response = await apiCall<any[]>("/tenants/invitations", "GET")
    return response
  },

  resendInvitation: async (invitationId: string) => {
    const response = await apiCall<{ message: string }>(`/tenants/invitations/${invitationId}/resend`, "POST")
    return response
  },
}

export const settingsApi = realSettingsApi
