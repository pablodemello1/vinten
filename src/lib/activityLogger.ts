import { supabase } from './supabase';

const GUEST_SESSION_KEY = 'vinten_guest_session_id';

/**
 * Retorna o genera un ID de sesión de invitado persistente en localStorage.
 */
export function getGuestSessionId(): string {
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Registra una actividad del usuario o invitado en la tabla user_activities de Supabase.
 */
export async function logActivity(
  activityType: string,
  description?: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const guestSessionId = getGuestSessionId();

    const activityPayload = {
      user_id: session?.user?.id || null,
      guest_session_id: session?.user ? null : guestSessionId,
      activity_type: activityType,
      description: description || null,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      },
    };

    const { error } = await supabase.from('user_activities').insert([activityPayload]);

    if (error) {
      console.warn('Error registrando actividad en Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error inesperado al registrar actividad:', err);
    return false;
  }
}
