import { LoginForm } from "@/auth/components/login-form"

const LogInPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-4xl">
                <LoginForm />
            </div>
        </div>
    )
}

export default LogInPage
