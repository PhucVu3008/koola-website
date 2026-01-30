import { UserForm } from '@/components/admin/UserForm';

export default function CreateUserPage({ params }: { params: { locale: string } }) {
  return <UserForm locale={params.locale} mode="create" />;
}
