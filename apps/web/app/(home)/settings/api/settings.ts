import { apiCall } from "@/services/api-service"
import { mockSettingsApi } from "./mock-settings"

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

// Use mock API if NEXT_PUBLIC_USE_MOCK_API is true
const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

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
    throw new Error("Not implemented")
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

  // These endpoints don't exist yet in the real API
  changeUserRole: async (userId: string, newRole: "admin" | "user") => {
    throw new Error("Not implemented")
  },

  removeTeamMember: async (userId: string) => {
    throw new Error("Not implemented")
  },
}

export const settingsApi = useMockApi ? mockSettingsApi : realSettingsApi
