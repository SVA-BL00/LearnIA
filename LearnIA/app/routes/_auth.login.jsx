import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";

const SocialButton = ({ provider, label }) => (
	<Form action={`/auth/${provider}`} method="post">
		<button type="submit">{label}</button>
	</Form>
);

export default function Login() {
	return (
		<>
			<div id="learnia-logo">LearnIA</div>
			<div className="log-form">
				<SocialButton
					provider={SocialsProvider.GITHUB}
					label="Login with Github"
				/>
				<SocialButton
					provider={SocialsProvider.GOOGLE}
					label="Login with Google"
				/>
				<SocialButton
					provider={SocialsProvider.MICROSOFT}
					label="Login with Microsoft"
				/>
			</div>
		</>
	);
}
