import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../hooks/useToast'
import { ApiError } from '../services/api'
import { register } from '../services/authService'

export function RegisterPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    form?: string
  }>({})

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: {
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!email.trim()) {
      nextErrors.email = "L'e-mail est obligatoire"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Veuillez saisir une adresse e-mail valide'
    }
    if (!password) {
      nextErrors.password = 'Le mot de passe est obligatoire'
    } else if (password.length < 8) {
      nextErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Veuillez confirmer le mot de passe'
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    setErrors({})
    try {
      await register({ email: email.trim(), password })
      showToast('Compte créé. Vous pouvez vous connecter.', 'success')
      navigate('/login', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Impossible de créer le compte. Veuillez réessayer.'
      setErrors({ form: message })
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Inscrivez-vous pour gérer vos tâches en toute sécurité."
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
        />
        <Input
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          required
        />
        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          S&apos;inscrire
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Déjà inscrit ?{' '}
        <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}
