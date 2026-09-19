const API_MESSAGES: Record<string, string> = {
  'Email is already registered': 'Cet e-mail est déjà utilisé.',
  'Invalid email or password': 'E-mail ou mot de passe incorrect.',
  'Invalid or expired token': 'Jeton invalide ou expiré.',
  'Authentication required': 'Authentification requise.',
  'Task not found': 'Tâche introuvable.',
  'Validation failed': 'Erreur de validation.',
  'Invalid status value': 'Statut invalide.',
  'Invalid request body': 'Requête invalide.',
  'Title is required': 'Le titre est obligatoire.',
  'Email is required': "L'e-mail est obligatoire.",
  'Email must be valid': "L'e-mail doit être valide.",
  'Password is required': 'Le mot de passe est obligatoire.',
  'Password must be at least 8 characters':
    'Le mot de passe doit contenir au moins 8 caractères.',
  'Status is required': 'Le statut est obligatoire.',
}

export function translateApiMessage(message: string): string {
  return API_MESSAGES[message] ?? message
}
