import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import GlobalToast from "./Components/GlobalToast";

const appName = "WellTrash - Jasa Angkut Sampah & Pengolahan Limbah di Jember";

createInertiaApp({
    title: (title) => title ? `${title} | WellTrash` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const initialFlash = props.initialPage.props.flash;

        root.render(
            <>
                <GlobalToast initialFlash={initialFlash as any} />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
