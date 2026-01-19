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
        subscription_status: user.subscriptionStatus
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
    const { error } = await supabase
      .from('invitations')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', token)
    
    if (error) throw error
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
    
    // Insere novas áreas
    if (areas.length > 0) {
      const { error } = await supabase
        .from('focus_areas')
        .insert(areas.map(area => ({
          user_id: userId,
          title: area.title,
          description: area.description,
          category: area.category,
          status: area.status
        })))
      
      if (error) throw error
    }
  },

  async getFocusAreas(userId: string): Promise<FocusArea[]> {
    const { data, error } = await supabase
      .from('focus_areas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
      createdAt: new Date(item.created_at).toISOString(),
      updatedAt: new Date(item.updated_at).toISOString()
    }))
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