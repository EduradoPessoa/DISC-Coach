import { supabase } from './supabase'
import { User, AssessmentResult, FocusArea, Invitation } from '../types'

export const supabaseApi = {
  // --- USERS ---
  async saveUser(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        position: user.position,
        department: user.department,
        plan: user.plan,
        subscription_status: user.subscriptionStatus,
        invited_by: user.invitedBy
      })
    
    if (error) throw error
  },

  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data ? {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      position: data.position,
      department: data.department,
      plan: data.plan,
      subscriptionStatus: data.subscription_status
    } : null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data ? {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      position: data.position,
      department: data.department,
      plan: data.plan,
      subscriptionStatus: data.subscription_status
    } : null
  },

  // --- INVITATIONS ---
  async saveInvitation(invite: Invitation): Promise<void> {
    const { error } = await supabase
      .from('invitations')
      .insert({
        email: invite.email,
        token: invite.token,
        role: invite.role,
        invited_by: invite.invitedBy,
        used: invite.used
      })
    
    if (error) throw error
  },

  async getInvitationByToken(token: string): Promise<Invitation | null> {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data ? {
      id: data.id,
      email: data.email,
      token: data.token,
      role: data.role,
      invitedBy: data.invited_by,
      used: data.used,
      discount: 0, // Valor padrão
      createdAt: new Date(data.created_at).getTime(),
      usedAt: data.used_at ? new Date(data.used_at).getTime() : undefined
    } : null
  },

  async markInvitationAsUsed(token: string): Promise<void> {
    const { error } = await supabase.rpc('redeem_invite', { invite_token: token });
    
    if (error) throw error
  },

  // --- ADMIN ---
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(d => ({
      id: d.id,
      email: d.email,
      name: d.name,
      role: d.role,
      position: d.position,
      department: d.department,
      plan: d.plan,
      subscriptionStatus: d.subscription_status,
      createdAt: d.created_at,
      invitedBy: d.invited_by
    }))
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const dbUpdates: any = {}
    if (updates.email !== undefined) dbUpdates.email = updates.email
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.role !== undefined) dbUpdates.role = updates.role
    if (updates.position !== undefined) dbUpdates.position = updates.position
    if (updates.department !== undefined) dbUpdates.department = updates.department
    if (updates.plan !== undefined) dbUpdates.plan = updates.plan
    if (updates.subscriptionStatus !== undefined) dbUpdates.subscription_status = updates.subscriptionStatus
    if (updates.invitedBy !== undefined) dbUpdates.invited_by = updates.invitedBy

    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)

    if (error) throw error
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error
  },

  async getTeamMembers(adminId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*, assessments(id, scores, analysis, created_at)')
      .eq('invited_by', adminId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(d => {
      const latestAssessment = d.assessments?.[0]; // Assuming one or taking the first one
      // If assessments is an array (which it is), we need to sort or pick the latest if not ordered.
      // But usually Supabase returns array.
      
      return {
        id: d.id,
        email: d.email,
        name: d.name,
        role: d.role,
        plan: d.plan,
        status: latestAssessment ? 'Concluído' : 'Pendente',
        profile: latestAssessment?.analysis?.profile || '-',
        resultId: latestAssessment?.id,
        invitedBy: d.invited_by,
        createdAt: d.created_at
      }
    })
  },

  // --- ASSESSMENTS ---
  async saveAssessment(result: AssessmentResult): Promise<void> {
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: result.userId,
        scores: result.scores,
        analysis: result.analysis
      })
    
    if (error) throw error
  },

  async getAssessmentHistory(userId: string): Promise<AssessmentResult[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      timestamp: new Date(item.created_at).getTime(),
      scores: item.scores,
      analysis: item.analysis
    }))
  },

  async updateAssessmentAnalysis(userId: string, resultId: string, analysis: any): Promise<void> {
    const { error } = await supabase
      .from('assessments')
      .update({ analysis })
      .eq('id', resultId)
      .eq('user_id', userId)
    
    if (error) throw error
  },

  // --- FOCUS AREAS ---
  async saveFocusAreas(userId: string, areas: FocusArea[]): Promise<void> {
    // Deleta áreas existentes do usuário
    const { error: deleteError } = await supabase
      .from('focus_areas')
      .delete()
      .eq('user_id', userId)
    
    if (deleteError) throw deleteError
    
    if (areas.length === 0) return

    const { error } = await supabase
      .from('focus_areas')
      .insert(areas.map(area => ({
        user_id: userId,
        title: area.title,
        description: area.description,
        category: area.category,
        status: area.status,
        due_date: area.dueDate
      })))

    if (error) throw error
  },

  async getFocusAreas(userId: string): Promise<FocusArea[]> {
    const { data, error } = await supabase
      .from('focus_areas')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    
    return (data || []).map(area => ({
      id: area.id,
      title: area.title,
      description: area.description,
      category: area.category,
      status: area.status,
      dueDate: area.due_date
    }))
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data || []
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    if (error) throw error
  },
  
  async updateFocusArea(userId: string, areaId: string, updates: any): Promise<void> {
    const { error } = await supabase
      .from('focus_areas')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', areaId)
      .eq('user_id', userId)
    
    if (error) throw error
  },

  async removeFocusArea(userId: string, areaId: string): Promise<void> {
    const { error } = await supabase
      .from('focus_areas')
      .delete()
      .eq('id', areaId)
      .eq('user_id', userId)
    
    if (error) throw error
  }
}