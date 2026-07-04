import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from "@iconify/react"
import { useTranslation, Trans } from 'react-i18next'
import { useState, FormEvent } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { toast } from 'sonner'
import { Link, useNavigate, useLocation } from 'react-router'
import { AuthDivider } from "@/components/auth-divider"
import logo from '@/assets/react-supabase-auth-template-logo.png'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const { signIn, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await loginWithGoogle();
      if (error) {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } catch {
      toast.error('An unexpected error occurred with Google login');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('auth.welcomeBack', "Welcome back")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t('auth.loginToAccount', "Login to your account to continue")}
                </p>
              </div>
              <Button
                variant="outline"
                type="button"
                className="w-full cursor-pointer"
                onClick={handleGoogleLogin}
                disabled={loading || isSubmitting || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Icon icon="lucide:loader-2" className="animate-spin" width={18} />
                ) : (
                  <Icon icon="flat-color-icons:google" width={26} />
                )}
                <span>{isGoogleLoading ? t('common.loading') : t('auth.loginWithGoogle', "Login with Google")}</span>
              </Button>
              <AuthDivider>
                {t('auth.orContinueWithEmail', "Or continue with email")}
              </AuthDivider>
              <div className="grid gap-3">
                <Label htmlFor="email">{t('auth.email', "Email")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('auth.emailPlaceholder', "Email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || isSubmitting}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('auth.password', "Password")}</Label>
                  <Link
                    to="/recover-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {t('auth.forgotPassword', "Forgot password")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || isSubmitting}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="lucide:loader-2" className="animate-spin" />
                    {t('common.loading', "Loading")}
                  </>
                ) : (
                  t('auth.login', "Login")
                )}
              </Button>
              <div className="text-center text-sm">
                {t('auth.dontHaveAccount', "Don't have an account?")}{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  {t('auth.signUp', "Sign up")}
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={logo}
              alt="React Supabase Auth Template"
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground">
        <Trans
          i18nKey="auth.agreementText"
          defaults="By continuing, you agree to our {{termsLink}} and {{privacyLink}}"
          components={{
            termsLink: <a href="#" className="underline underline-offset-4 hover:text-primary" />,
            privacyLink: <a href="#" className="underline underline-offset-4 hover:text-primary" />
          }}
          values={{
            termsLink: t('auth.termsOfService', "Terms of service"),
            privacyLink: t('auth.privacyPolicy', "Privacy policy")
          }}
        />
      </div>
    </div>
  )
}
