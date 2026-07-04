import { RecoverPasswordForm } from "@/auth/components/recover-password-form"

const RecoverPasswordPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-4xl px-4">
                <RecoverPasswordForm />
            </div>
        </div>
    )
}

export default RecoverPasswordPage
