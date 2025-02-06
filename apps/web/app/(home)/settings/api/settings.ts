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
    const response = await apiCall<{ message: string; user: User }>("/auth/profile")
    return response.user
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiCall<{ message: string; user: User }>("/auth/profile", "PATCH", data)
    return response.user
  },

  // Password
  updatePassword: async (data: UpdatePasswordData) => {
    const response = await apiCall<{ message: string }>("/auth/password", "PATCH", data)
    return response.message
  },

  // Team Management
  getTeamMembers: async () => {
    const response = await apiCall<{ users: User[] }>("/tenants/users")
    return response
  },

  inviteUser: async (data: InviteUserData) => {
    const response = await apiCall<InviteResponse>("/tenants/invite", "POST", data)
    console.log('InviteResponse', response)
    return response
  },

  validateInvitation: async (token: string) => {
    const response = await apiCall<{ message: string }>(`/tenants/validate-invitation/${token}`)
    return response.message
  },

  acceptInvitation: async (token: string) => {
    const response = await apiCall<{ message: string }>(`/tenants/accept-invitation/${token}`, "POST")
    return response.message
  },

  changeUserRole: async (userId: string, newRole: "admin" | "user") => {
    const response = await apiCall<{ message: string }>(`/tenants/users/${userId}/role`, "PATCH", { role: newRole })
    return response.message
  },

  removeTeamMember: async (userId: string) => {
    const response = await apiCall<{ message: string }>(`/tenants/users/${userId}`, "DELETE")
    return response.message
  },

  getPendingInvitations: async () => {
    const response = await apiCall<any[]>("/tenants/invitations", "GET")
    return response
  },

  resendInvitation: async (invitationId: string) => {
    const response = await apiCall<{ message: string }>(`/tenants/invitations/${invitationId}/resend`, "POST")
    return response.message
  },

  cancelInvitation: async (invitationId: string) => {
    const response = await apiCall<{ message: string }>(`/tenants/invitations/${invitationId}`, "DELETE")
    return response.message
  },
}

export const settingsApi = realSettingsApi
