import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import GlobalToast from "./Components/GlobalToast";

// Unregister any active PWA service workers
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
            registration.unregister();
        }
    });
}

const appName = "Jasa Penjemputan & Pengelolaan Sampah se Jember | Welltrash";

createInertiaApp({
    title: (title) => title ? `${title} | Jasa Penjemputan & Pengelolaan Sampah se Jember` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const initialFlash = props.initialPage.props.flash;
        const initialAuth = props.initialPage.props.auth;

        root.render(
            <HelmetProvider>
                <GlobalToast initialFlash={initialFlash as any} />
                <App {...props} />
            </HelmetProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});

