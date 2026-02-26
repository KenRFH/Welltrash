import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700">Email</label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        autoComplete="username"
                        onChange={(e: any) => setData('email', e.target.value)}
                    />

                    <div className="text-red-600 mt-2">{errors.email}</div>
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="block font-medium text-sm text-gray-700">Password</label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        autoComplete="new-password"
                        onChange={(e: any) => setData('password', e.target.value)}
                    />

                    <div className="text-red-600 mt-2">{errors.password}</div>
                </div>

                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-700">Confirm Password</label>

                    <input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        autoComplete="new-password"
                        onChange={(e: any) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <div className="text-red-600 mt-2">{errors.password_confirmation}</div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <button className="ms-4 bg-gray-800 text-white px-4 py-2 rounded-md" disabled={processing}>
                        Reset Password
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
