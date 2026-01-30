import { UserForm } from '@/components/admin/UserForm';

export default function EditUserPage({ params }: { params: { locale: string; id: string } }) {
  return <UserForm userId={parseInt(params.id)} locale={params.locale} mode="edit" />;
}
