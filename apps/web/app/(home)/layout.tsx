
import ProtectedLayout from '@/components/protected-layout';
export default async function HomeLayout({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}