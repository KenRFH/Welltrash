import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password" className="block font-medium text-sm text-gray-700">Current Password</label>

                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e: any) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        autoComplete="current-password"
                    />

                    <div className="text-red-600 mt-2">{errors.current_password}</div>
                </div>

                <div>
                    <label htmlFor="password" className="block font-medium text-sm text-gray-700">New Password</label>

                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e: any) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        autoComplete="new-password"
                    />

                    <div className="text-red-600 mt-2">{errors.password}</div>
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-700">Confirm Password</label>

                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e: any) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        autoComplete="new-password"
                    />

                    <div className="text-red-600 mt-2">{errors.password_confirmation}</div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700" disabled={processing}>Save</button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
