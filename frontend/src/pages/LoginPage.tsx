import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { notifyAuthChanged } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { ApiError } from '../services/api'
import { login } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      nextErrors.email = "L'e-mail est obligatoire"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Veuillez saisir une adresse e-mail valide'
    }
    if (!password) {
      nextErrors.password = 'Le mot de passe est obligatoire'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    setErrors({})
    try {
      await login({ email: email.trim(), password })
      notifyAuthChanged()
      showToast('Connexion réussie.', 'success')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Impossible de se connecter. Veuillez réessayer.'
      setErrors({ form: message })
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre espace personnel de gestion des tâches."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
        />
        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Se connecter
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Pas encore de compte ?{' '}
        <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/register">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  )
}
