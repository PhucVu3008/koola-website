/**
 * Login Layout - No authentication check
 * 
 * This overrides the parent admin layout to avoid redirect loops
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
