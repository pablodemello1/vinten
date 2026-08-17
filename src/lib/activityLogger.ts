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
 * Registra una interacción o evento del usuario/invitado en la tabla `eventos_usuario` de Supabase.
 * 
 * @param tipoEvento Nombre o identificador del evento (ej: 'inicio_sesion', 'consulta_tutor_ai', 'leccion_completada', 'visita_pantalla')
 * @param detalles Objeto JSON con los detalles adicionales específicos de la interacción
 */
export async function logUserEvent(
  tipoEvento: string,
  detalles: Record<string, any> = {}
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const guestSessionId = getGuestSessionId();
    const currentUserId = session?.user?.id || null;

    const eventPayload = {
      user_id: currentUserId,
      tipo_evento: tipoEvento,
      detalles: {
        ...detalles,
        guest_session_id: currentUserId ? null : guestSessionId,
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
    };

    // 1. Inserción principal en la tabla `eventos_usuario`
    const { error: eventError } = await supabase
      .from('eventos_usuario')
      .insert([eventPayload]);

    if (eventError) {
      console.warn('Advertencia registrando en eventos_usuario:', eventError.message);
    }

    // 2. Inserción secundaria en `user_activities` para retrocompatibilidad
    try {
      await supabase.from('user_activities').insert([{
        user_id: currentUserId,
        guest_session_id: currentUserId ? null : guestSessionId,
        activity_type: tipoEvento,
        description: typeof detalles.descripcion === 'string' ? detalles.descripcion : (detalles.texto_consulta || tipoEvento),
        metadata: eventPayload.detalles,
      }]);
    } catch {
      // Ignorar errores de retrocompatibilidad
    }

    return !eventError;
  } catch (err) {
    console.error('Error inesperado al registrar evento de usuario:', err);
    return false;
  }
}

/**
 * Alias de compatibilidad para el logger anterior.
 */
export async function logActivity(
  activityType: string,
  description?: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  return logUserEvent(activityType, { descripcion: description, ...metadata });
}
