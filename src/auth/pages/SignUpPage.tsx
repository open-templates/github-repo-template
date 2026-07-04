import { SignUpForm } from "@/auth/components/signup-form"

const SignUpPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-4xl">
                <SignUpForm />
            </div>
        </div>
    )
}

export default SignUpPage
