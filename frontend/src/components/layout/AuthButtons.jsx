import Button from "../ui/Button";

export default function AuthButtons() {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <Button as="link" to="/auth" variant="ghost" size="md">
        Login
      </Button>
      <Button as="link" to="/auth/register" variant="primary" size="md">
        Sign Up
      </Button>
    </div>
  );
}