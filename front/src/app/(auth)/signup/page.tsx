
import { SignupForm } from "@/features/auth";
import { AuthSplitScreen } from "@/widgets/auth-layout";

const SignupPage = () => {
    return <AuthSplitScreen>
        <SignupForm />
    </AuthSplitScreen>
}

export default SignupPage;