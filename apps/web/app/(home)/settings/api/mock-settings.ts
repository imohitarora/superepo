import { User, UpdateProfileData, UpdatePasswordData, InviteUserData } from './settings'

// Simulated delay to mimic API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data
let currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
}

let teamMembers: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'user',
  },
]

export const mockSettingsApi = {
  // Profile
  getProfile: async () => {
    await delay(500)
    return currentUser
  },

  updateProfile: async (data: UpdateProfileData) => {
    await delay(500)
    currentUser = {
      ...currentUser,
      name: data.name,
    }
    // Update the user in team members as well
    teamMembers = teamMembers.map(member =>
      member.id === currentUser.id ? currentUser : member
    )
    return currentUser
  },

  // Password
  updatePassword: async (data: UpdatePasswordData) => {
    await delay(500)
    // Simulate password validation
    if (data.currentPassword === 'wrongpassword') {
      throw new Error('Current password is incorrect')
    }
    return null
  },

  // Team Management
  getTeamMembers: async () => {
    await delay(500)
    return teamMembers
  },

  inviteUser: async (data: InviteUserData) => {
    await delay(500)
    const newUser: User = {
      id: (teamMembers.length + 1).toString(),
      name: data.email.split('@')[0],
      email: data.email,
      role: data.role,
    }
    teamMembers.push(newUser)
    return null
  },

  validateInvitation: async (token: string) => {
    await delay(500)
    return null
  },

  acceptInvitation: async (token: string) => {
    await delay(500)
    return null
  },

  // Additional mock endpoints for missing functionality
  changeUserRole: async (userId: string, newRole: 'admin' | 'user') => {
    await delay(500)
    teamMembers = teamMembers.map(member =>
      member.id === userId ? { ...member, role: newRole } : member
    )
    return null
  },

  removeTeamMember: async (userId: string) => {
    await delay(500)
    // Don't allow removing the current user
    if (userId === currentUser.id) {
      throw new Error('Cannot remove yourself')
    }
    teamMembers = teamMembers.filter(member => member.id !== userId)
    return null
  },
}
