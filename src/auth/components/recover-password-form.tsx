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
import { Link } from 'react-router'
import logo from '@/assets/react-supabase-auth-template-logo.png'

export function RecoverPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { t } = useTranslation();
    const { resetPassword, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await resetPassword(email);

            if (error) {
                toast.error(error.message || 'Failed to send reset email');
            } else {
                toast.success(t('auth.resetLinkSent', "Reset link sent to your email"));
                setEmailSent(true);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">{t('auth.recoverPasswordTitle', "Recover password")}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {t('auth.recoverPasswordSubtitle', "Enter your email to receive a reset link")}
                                </p>
                            </div>

                            {!emailSent ? (
                                <>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">{t('auth.email', "Email")}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={t('auth.emailPlaceholder', "Email")}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            t('auth.sendResetLink', "Send reset link")
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                                        <Icon icon="lucide:check-circle" className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            {t('auth.resetLinkSent', "Reset link sent")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center text-sm">
                                <Link to="/" className="underline underline-offset-4 hover:text-primary">
                                    {t('auth.backToLogin', "Back to login")}
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src={logo}
                            alt="Krill Bill Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                <Trans
                    i18nKey="auth.agreementText"
                    defaults="By continuing, you agree to our {{termsLink}} and {{privacyLink}}"
                    components={{
                        termsLink: <a href="#" />,
                        privacyLink: <a href="#" />
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