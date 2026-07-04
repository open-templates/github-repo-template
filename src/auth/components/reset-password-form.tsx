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
import { useNavigate } from 'react-router'
import logo from '@/assets/react-supabase-auth-template-logo.png'

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { t } = useTranslation();
    const { updatePassword, signOut, loading } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error(t('auth.passwordsDontMatch'));
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await updatePassword(password);

            if (error) {
                toast.error(error.message || 'Failed to update password');
            } else {
                toast.success(t('auth.passwordUpdated', "Password updated successfully"));
                setPasswordUpdated(true);

                // Sign out user after password change for security
                setTimeout(async () => {
                    try {
                        await signOut();
                        navigate('/', { replace: true });
                    } catch (error) {
                        navigate('/', { replace: true });
                    }
                }, 2000);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = async () => {
        try {
            await signOut();
            navigate('/', { replace: true });
        } catch (error) {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">{t('auth.resetPasswordTitle', "Reset password")}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {t('auth.resetPasswordSubtitle', "Enter your new password")}
                                </p>
                            </div>

                            {!passwordUpdated ? (
                                <>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">{t('auth.newPassword', "New password")}</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder={t('auth.newPasswordPlaceholder', "New password")}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={loading || isSubmitting}
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="confirmPassword">{t('auth.confirmNewPassword', "Confirm new password")}</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder={t('auth.confirmNewPasswordPlaceholder', "Confirm new password")}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={loading || isSubmitting}
                                            minLength={6}
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
                                            t('auth.updatePassword', "Update password")
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                                        <Icon icon="lucide:check-circle" className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            {t('auth.passwordUpdated', "Password updated")}
                                        </p>
                                        <p className="text-xs text-green-500 dark:text-green-500 mt-2">
                                            {t('auth.signingOutAndRedirecting', "Signing out and redirecting")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center text-sm">
                                <Button variant="link" onClick={handleBackToLogin} className="underline underline-offset-4 hover:text-primary">
                                    {t('auth.backToLogin', "Back to login")}
                                </Button>
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
                        termsLink: t('auth.termsOfService', "Terms of service"  ),
                        privacyLink: t('auth.privacyPolicy', "Privacy policy")
                    }}
                />
            </div>
        </div>
    )
} 